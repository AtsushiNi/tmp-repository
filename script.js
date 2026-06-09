(async () => {
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const getMessages = () => {
    const candidates = [...document.querySelectorAll('[data-tid], [role="listitem"], .fui-ChatMessage')];

    return candidates
      .map(el => {
        const text = el.innerText?.trim();
        if (!text) return null;

        return {
          text,
          html: el.outerHTML.slice(0, 3000)
        };
      })
      .filter(Boolean);
  };

  const unique = new Map();

  const scrollTarget =
    document.querySelector('[data-tid="message-pane-list-runway"]') ||
    document.querySelector('[role="main"]') ||
    document.scrollingElement;

  console.log("取得開始。Teamsの画面を触らず待ってください。");

  let sameCount = 0;
  let lastSize = 0;

  for (let i = 0; i < 300; i++) {
    const messages = getMessages();

    for (const m of messages) {
      const key = m.text.slice(0, 500);
      unique.set(key, m);
    }

    console.log(`scroll=${i}, messages=${unique.size}`);

    if (unique.size === lastSize) {
      sameCount++;
    } else {
      sameCount = 0;
      lastSize = unique.size;
    }

    if (sameCount >= 20) {
      console.log("新規取得が止まったため終了します。");
      break;
    }

    scrollTarget.scrollTop = 0;
    scrollTarget.dispatchEvent(new WheelEvent("wheel", { deltaY: -1200, bubbles: true }));
    window.scrollTo(0, 0);

    await sleep(1200);
  }

  const result = [...unique.values()];

  const blob = new Blob([JSON.stringify(result, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `teams_messages_${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  a.click();

  console.log(`完了: ${result.length}件をJSON保存しました。`);
})();
