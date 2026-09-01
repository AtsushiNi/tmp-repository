# src/gitlab_ai_platform/ 再編仕様書

> このドキュメントは、実装作業を行う別のAI/環境向けの入力として書かれている。
> この会話の文脈を前提とせず、これ単体で読んで実行できることを目指す。

## 背景

`src/gitlab_ai_platform/` 直下は現在20個のパッケージがすべて同じ階層にフラットに並んでおり、
一覧性が低い。技術レイヤー(entrypoints/pipeline/adapters/infra)ではなく、**ユーザーが実際に
使う機能単位**で束ね直す。詳細な調査過程は `dependency-map.html`(同ディレクトリ)を参照。

## 全体タスクリスト(この順で実施する)

各タスク・各PR(タスク1のPR 1a〜1fを含む)は独立したIssueとして起票してから着手する。
Issueの起票自体はこのドキュメントを実行するAI側がMCP経由で行う想定。

| # | タスク | 状態 | 詳細 |
|---|---|---|---|
| 1 | ディレクトリ再編フェーズ1(18モジュールの丸ごと移動。`cli`/`poller`は対象外) | 本書で仕様化済み(PR 1a〜1fの6つに分割) | 下記「タスク1」参照。1PRが大きくなりすぎないよう、グループ単位でPRを分ける |
| 2 | シンプル化監査(過剰な抽象化・ファイル分割の見直し) | 本書で仕様化済み(6ステップ) | 下記「タスク2」参照。フェーズ1の**後**、フェーズ2の**前**に実施する理由は「タスク2」冒頭参照 |
| 3 | ディレクトリ再編フェーズ2(`cli`の9ファイル・`poller`の2ファイルを内部分割) | 本書で仕様化済み(13ステップ) | 下記「タスク3」参照 |
| 4 | `config`の分割(`CoreConfig`/`EngineConfig`/`ReviewConfig`(仮)/`IssuePipelineConfig`(仮)) | 本書で仕様化済み(7ステップ) | 下記「タスク4」参照 |
| 5 | `gitlab_adapter`のPythonライブラリ(`python-gitlab`等)置換検討 | 本書で仕様化済み(6ステップ) | 下記「タスク5」参照 |
| 6 | `mcp`のClaude Code Pluginへの昇華 | 本書で仕様化済み(4ステップ、詳細調査は未着手) | 下記「タスク6」参照 |

## 最終的な5グループ + 1アグリゲータ

| 名前 | 役割 | 他グループへの依存 |
|---|---|---|
| `mr_review_watcher` | エンジニアの開発機上で動作し、poll/webhookでMRレビューを行う | `engine`・`core` |
| `issue_pipeline_container` | Dockerコンテナ上で動作し、Issueラベルをpoll/webhookで検出して実装〜レビューまで完全自動で行う | `engine`・`core` |
| `mcp` | 対話型Claude Codeが単独で使えるGitLab操作を提供する。自動化は何も起動しない | `core`のみ(`engine`には依存しない) |
| `engine` | `mr_review_watcher`と`issue_pipeline_container`だけが共有する実行エンジン(Claude Code実行・worktree管理・状態記録) | `core`のみ |
| `core` | 3機能全部が使う土台。他グループに一切依存しない葉 | なし |
| `cli`(トップレベル、5グループの外) | 全サブコマンドを束ねる薄いアグリゲータ。上記5グループ全部からimportする | 全部 |

`cli`を「core」に含めなかった理由: `cli/main.py`は`mr_review_watcher.cli.watch`・
`issue_pipeline_container.cli.dispatcher`・`mcp.cli.decompose`・`engine.cli.single_run`を
すべてimportして束ねる、依存の向きが「他グループ→core」ではなく「main.py→他グループ全部」。
coreの定義(誰からも依存されるだけで、他グループに依存しない葉)に反するため、5グループの外側に
薄いアグリゲータとして独立させる。

## 最終形のディレクトリツリー(cli/pollerの内部分割まで完了した状態)

```
src/gitlab_ai_platform/
  __init__.py
  _paths.py                        # 変更なし。何にも依存しない共有ユーティリティ

  cli/                              # 5グループを束ねる薄いアグリゲータ(トップレベル)
    __init__.py
    __main__.py
    main.py
    exit_codes.py

  mr_review_watcher/
    __init__.py
    poller.py                       # ← poller/poller.py
    types.py                        # ← poller/types.py
    webhook/                        # ← webhook/ 丸ごと
    cli/
      __init__.py
      watch.py                      # ← cli/watch.py
      worker_pool.py                # ← cli/worker_pool.py
      lock.py                       # ← cli/lock.py

  issue_pipeline_container/
    __init__.py
    issue_poller.py                 # ← poller/issue_poller.py
    issue_types.py                  # ← poller/issue_types.py
    api/                            # ← api/ 丸ごと
    issue_store/                    # ← issue_store/ 丸ごと
    orchestrator/                   # ← orchestrator/ 丸ごと(フェーズではなく調整役なのでphases/の外)
    phases/                         # job.py/parser.py/prompts.py/types.py/errors.pyという
      __init__.py                   # 共通シェイプを持つ、対称なきょうだい5つをまとめる
      issue_analysis/                # ← issue_analysis/ 丸ごと
      design/                        # ← design/ 丸ごと
      plan/                          # ← plan/ 丸ごと
      implement/                     # ← implement/ 丸ごと
      push/                          # ← push/ 丸ごと
    cli/
      __init__.py
      dispatcher.py                 # ← cli/dispatcher.py
      api_server.py                 # ← cli/api_server.py
      respond.py                    # ← cli/respond.py

  mcp/
    __init__.py
    adapter_mcp_server/             # ← adapter_mcp_server/ 丸ごと
    cli/
      __init__.py
      decompose.py                  # ← cli/decompose.py

  engine/
    __init__.py
    runner/                         # ← runner/ 丸ごと
    workspace/                      # ← workspace/ 丸ごと
    store/                          # ← store/ 丸ごと
    job/                            # ← job/ 丸ごと
    review/                         # ← review/ 丸ごと
    cli/
      __init__.py
      single_run.py                 # ← cli/single_run.py

  core/
    __init__.py
    gitlab_adapter/                 # ← gitlab_adapter/ 丸ごと
    logging_/                       # ← logging_/ 丸ごと
    config/                         # ← config/ 丸ごと(中身の分割は今回スコープ外)
```

`tests/gitlab_ai_platform/` も同じ構成でミラーする。

## タスク詳細

一度に全部やらない。上の全体タスクリストの順で、それぞれ独立したIssueとして進める。

### タスク1: フェーズ1(単一パッケージの丸ごと移動のみ)

`cli/` と `poller/` は**このフェーズでは分割しない**。中身は変えず、importパスだけ新しい
グループ配下のパスに書き換えて、パッケージ自体は元の形のままトップレベルに残す
(`src/gitlab_ai_platform/cli/`, `src/gitlab_ai_platform/poller/` は変更しない)。

**タスク1は1つのPRではやらない。** 18モジュール・100ファイル超を一度に動かすと差分が大きすぎて
レビューできない。**グループ単位で5つのPR(1a〜1e)に分け、それぞれ単独でCIが通る状態で
マージする。** 各モジュールへの直接の依存元は少数(`gitlab_adapter`は5箇所、`config`は3箇所等)
なので、「あるモジュールを動かす回のPRでは、そのモジュールを参照している箇所だけ直す」形にすれば、
参照元がまだ移動済みかどうかに関係なく各PR単独でビルドを壊さずに進められる。順序は依存の少ない
側から: `core` → `engine` → `mcp` → `mr_review_watcher` → `issue_pipeline_container`。
最後に1fでdocs更新と最終確認をまとめる。

共通の準備(1aの一部として1回だけ): `src/gitlab_ai_platform/{mr_review_watcher,
issue_pipeline_container,mcp,engine,core}/` ディレクトリと空の`__init__.py`を作成する。

#### PR 1a: `core`グループを作る(`gitlab_adapter`・`logging_`・`config`)

- [ ] `git mv`で`gitlab_adapter`・`logging_`・`config`を`core/`配下へ(`tests/`もミラー)
- [ ] これら3つを参照している**全ファイル**(`logging_`はほぼ全モジュールから参照されるため
      対象が多いが、直す内容は`from ..logging_ import` → `from ..core.logging_ import`
      のような1行の書き換えで機械的)のimportパスを新パスに更新する
- [ ] 相対importのドット数は、参照元ファイル自身の深さは変わらないので今回は再計算不要
      (参照先が`gitlab_ai_platform.core.X`に変わるだけ)
- [ ] `ruff` / `mypy` / `pytest` が通ることを確認してからPRを出す

#### PR 1b: `engine`グループを作る(`runner`・`workspace`・`store`・`job`・`review`)

- [ ] `git mv`で5つを`engine/`配下へ(`tests/`もミラー)
- [ ] これら5つを参照している全ファイル(`design`/`implement`/`plan`/`issue_analysis`/`push`/
      `orchestrator`/`cli/*.py`/`poller/*.py`等、まだ移動していないファイルも含む)のimportパスを
      `gitlab_ai_platform.engine.X`に更新する
- [ ] `ruff` / `mypy` / `pytest` が通ることを確認してからPRを出す

#### PR 1c: `mcp`グループを作る(`adapter_mcp_server`)

- [ ] `git mv src/gitlab_ai_platform/adapter_mcp_server src/gitlab_ai_platform/mcp/adapter_mcp_server`
      (`tests/`もミラー)
- [ ] 参照元(`cli/decompose.py`等)のimportパスを更新する
- [ ] `ruff` / `mypy` / `pytest` が通ることを確認してからPRを出す

#### PR 1d: `mr_review_watcher`グループを作る(`webhook`)

- [ ] `git mv src/gitlab_ai_platform/webhook src/gitlab_ai_platform/mr_review_watcher/webhook`
      (`tests/`もミラー)
- [ ] 参照元(`cli/watch.py`)のimportパスを更新する
- [ ] `ruff` / `mypy` / `pytest` が通ることを確認してからPRを出す

#### PR 1e: `issue_pipeline_container`グループを作る(`api`・`issue_store`・`orchestrator`・phases5個)

- [ ] `api`, `issue_store`, `orchestrator` を`git mv`で`issue_pipeline_container/`直下へ
- [ ] `issue_pipeline_container/phases/`ディレクトリと空の`__init__.py`を作成し、
      `issue_analysis`, `design`, `plan`, `implement`, `push` を`git mv`でその配下へ
      (この5つはjob.py/parser.py/prompts.py/types.py/errors.pyという共通シェイプを持つ対称な
      きょうだいなので、フェーズではない`orchestrator`とは分けてひとまとめにする)
- [ ] (`tests/`もミラー)
- [ ] **この8つはお互いを参照し合っている**(`orchestrator`が`phases`配下5つをimportし、
      `phases`配下の`design`/`implement`/`plan`/`issue_analysis`が`orchestrator`をimportし返す
      双方向依存)ので、8つ全部をこのPR内でまとめて動かし、パッケージ内部の相互参照も
      新しいドット数(`design`は`gitlab_ai_platform/design/`の1階層から`gitlab_ai_platform/
      issue_pipeline_container/phases/design/`の3階層に移るため、`orchestrator`を参照する行は
      `from ..orchestrator import ...`→`from ...orchestrator import ...`のようにドット数を
      再計算する)に合わせて書き換える
- [ ] 参照元(`cli/dispatcher.py`, `cli/respond.py`, `poller/issue_poller.py`)のimportパスも更新する
- [ ] `ruff` / `mypy` / `pytest` が通ることを確認してからPRを出す

#### PR 1f: ドキュメント更新と最終確認

- [ ] `docs/architecture.md`のコンポーネント表の「実装場所」列を新パスに更新する
- [ ] 旧パス(`gitlab_ai_platform.<旧モジュール名>`)を参照している`docs/`配下のファイルを
      `git grep -rl "gitlab_ai_platform\.\(webhook\|api\|issue_store\|orchestrator\|issue_analysis\|design\|plan\|implement\|push\|adapter_mcp_server\|runner\|workspace\|store\|job\|review\|gitlab_adapter\|logging_\|config\)\b" docs/`
      で洗い出し、新パスに更新する
- [ ] `pip install -e .` 後、`gitlab-ai-platform --help` が正常に動くことを確認する

1a〜1fが全部終わると20モジュール中18個が正しいグループに収まり、「20個並列」の問題はほぼ解消する。
`cli/` と `poller/` はこのタスク全体を通じてパスを変更しない(タスク3の対象)。

### タスク2: シンプル化監査

フェーズ1の後、フェーズ2の前に実施する(理由は上の全体タスクリスト参照)。

- [ ] 各グループ内のProtocol抽象化(`*/protocol.py`)を洗い出し、実装が1つしかないものを
      リストアップする(将来の差し替え予定が無いなら統合を検討)
- [ ] 各`errors.py`が実際に複数の例外型を使い分けているか確認する
- [ ] `issue_analysis`/`design`/`plan`/`implement`/`push`/`review`の各`job.py`/`parser.py`/
      `prompts.py`/`types.py`/`errors.py`分割が、実際に複数箇所からimportされて再利用されて
      いるか(単一箇所からしか呼ばれないなら分割の必要性を再検討)を`git grep`で確認する
- [ ] 各`__init__.py`のre-exportのうち、呼び出し側から実際に使われていないものを洗い出す
- [ ] 見つかった簡素化候補を一覧化し、それぞれの影響範囲(依存元・テスト)を確認する
- [ ] 影響が小さく安全なものから個別のIssueとして切り出して適用する
      (1つの巨大なリファクタPRにはしない)

### タスク3: フェーズ2(`cli`と`poller`の内部分割)

上記ツリーの最終形まで、`cli/`の9ファイルと`poller/`の2ファイルをそれぞれの行き先へ分割移動する。

- [ ] 各グループに`cli/`サブパッケージ(`__init__.py`)を作成する:
      `mr_review_watcher/cli/`, `issue_pipeline_container/cli/`, `mcp/cli/`, `engine/cli/`
- [ ] `git mv cli/watch.py mr_review_watcher/cli/watch.py`
      (同様に`worker_pool.py`, `lock.py`も`mr_review_watcher/cli/`へ)
- [ ] `git mv cli/dispatcher.py issue_pipeline_container/cli/dispatcher.py`
      (同様に`api_server.py`, `respond.py`も`issue_pipeline_container/cli/`へ)
- [ ] `git mv cli/decompose.py mcp/cli/decompose.py`
- [ ] `git mv cli/single_run.py engine/cli/single_run.py`
- [ ] `cli/main.py`・`exit_codes.py`・`__main__.py`・`__init__.py`はトップレベル`cli/`に残す
      (変更しない。5グループを束ねるアグリゲータとして独立させる、上の「最終的な5グループ+
      1アグリゲータ」節参照)
- [ ] `git mv poller/poller.py mr_review_watcher/poller.py`
      (同様に`poller/types.py`も`mr_review_watcher/types.py`へ)
- [ ] `git mv poller/issue_poller.py issue_pipeline_container/issue_poller.py`
      (同様に`poller/issue_types.py`も`issue_pipeline_container/issue_types.py`へ)
- [ ] `tests/gitlab_ai_platform/cli/`・`tests/gitlab_ai_platform/poller/`も同じ構成でミラーする
- [ ] 移動した各ファイル自身が持つ相対importを、新しい階層の深さに合わせて再計算する
      (例: `cli/watch.py`→`mr_review_watcher/cli/watch.py`は1階層深くなるため、
      `from ..core.config import ...`(ドット2つ)は`from ...core.config import ...`
      (ドット3つ)に変わる。`poller.py`/`issue_poller.py`も同様)
- [ ] `cli/main.py`から各グループの`cli/`サブパッケージへのimportパスを更新する
      (`watch`/`dispatcher`/`decompose`/`single_run`のサブコマンドハンドラ)
- [ ] `pyproject.toml`の`[project.scripts]`(`gitlab_ai_platform.cli.main:main`)は変更不要
      (`main.py`がトップレベル`cli/`に残るため)
- [ ] `ruff check .` / `ruff format --check .` / `mypy src` / `pytest` を実行し、全部通ることを確認
- [ ] `pip install -e .` 後、`gitlab-ai-platform --help`・各サブコマンド(`review`/`watch`/
      `worker`/`api`/`respond`/`decompose`)が正常に動くことを確認

### タスク4: `config`の分割

現状30フィールドの単一dataclass。実測すると`mr_review_watcher`専用10個/
`issue_pipeline_container`専用5個/`engine`専用12個/本当に共通3個に既に分かれている。

- [ ] `core/config/`に`CoreConfig`(`gitlab_url`/`gitlab_token`/`gitlab_token_mcp`)を追加定義する
- [ ] `engine/`に`EngineConfig`(`job_db_path`/`workspace_root`/`workspace_max_disk_mb`/
      `runner_log_dir`/`runner_timeout_seconds`/`reviews_root`/`store_backend`+postgres5フィールド)
      を追加定義する
- [ ] `mr_review_watcher/`に`ReviewConfig`(仮称。`projects`/`poll_interval_seconds`/
      `max_parallel`/`review_label`/`state_db_path`/`webhook_enabled`/`webhook_host`/`webhook_port`/
      `webhook_path`/`webhook_secret_token`)を追加定義する
- [ ] `issue_pipeline_container/`に`IssuePipelineConfig`(仮称。`api_host`/`api_port`/`api_token`/
      `issue_label`/`issue_ticket_db_path`)を追加定義する
- [ ] `config/loader.py`の読み込みロジックを、上記4つを組み立てて返す形に変更する
      (`.env`/`config.toml`のファイル形式・キー名は変えない)
- [ ] 各合成ルート(`cli/main.py`, `mr_review_watcher/cli/watch.py`,
      `issue_pipeline_container/cli/{dispatcher,api_server,respond}.py`,
      `mcp/cli/decompose.py`, `mcp/adapter_mcp_server/main.py`, `engine/cli/single_run.py`の7箇所)
      が、既存の単一`Config`ではなく必要な組み合わせだけを受け取るよう書き換える
- [ ] 既存の`Config`関連テスト(`tests/gitlab_ai_platform/core/config/`)を4分割後の構造に合わせて
      更新する

### タスク5: `gitlab_adapter`のPythonライブラリ置換検討

`gitlab_adapter`は`logging_`以外このアプリに一切依存しておらず、ほぼ独立したGitLabクライアント
ライブラリ。`rest.py`(644行、`gitlab_adapter`全体の6割)は`python-gitlab`等の既存ライブラリで
圧縮できる可能性がある。

- [ ] `python-gitlab`(または同等のライブラリ)が、現在`gitlab_adapter/protocol.py`の
      `GitLabReader`/`GitLabWriter`が要求するAPI(MR取得・diff取得・discussion取得・Issue取得/作成/
      更新・branch作成・commit作成・MRコメント作成)を全部カバーしているか調査する
- [ ] `protocol.py`の許可リスト設計(許可されたメソッドしか存在しない)を変えずに、
      `rest.py`の内部実装だけライブラリ呼び出しに差し替えられるか検証する
- [ ] 既存の独自dataclass(`types.py`)への変換ロジックが必要になる箇所を洗い出す
- [ ] 社内PyPIミラーでの入手可否を確認する(利用可能と確認済み)
- [ ] 依存追加の妥当性・書き込み権限まわりの安全性検証結果をまとめる
- [ ] 既存テスト(`tests/gitlab_ai_platform/core/gitlab_adapter/`)を保ったまま実装を段階的に
      差し替える

### タスク6: `mcp`のClaude Code Pluginへの昇華

`adapter_mcp_server`を`python -m gitlab_ai_platform.mcp.adapter_mcp_server`+手動`--mcp-config`
登録ではなく、Claude Codeのプラグイン機構でインストール可能な形にできないか検討する。

- [ ] Claude Codeのプラグイン機構(マニフェスト形式・配布方法・インストール手順)を調査する
- [ ] 現在の`--mcp-config`手動登録方式との違い(ユーザー体験・セキュリティ・配布経路)を整理する
- [ ] プラグイン化のメリット・実現可能性を評価する(投資対効果を判断できる材料を揃える)
- [ ] 実現可能と判断したら、プラグインマニフェストを作成し`docs/specs/adapter-mcp-server.md`を
      更新する

## 共通の検証方針

コードに触るタスク(1・3・4・5)は、それぞれの最終ステップで以下を確認する。CIと同じ基準。

- `ruff check .` / `ruff format --check .` / `mypy src` / `pytest` が全部通ること
  (`.github/workflows/ci.yml`と同じ4項目)
- `git grep` で更新漏れの旧import パス(コード・docs双方)が残っていないことを確認
- `pip install -e .` 後、`gitlab-ai-platform --help` が正常に動くこと
- 挙動が変わる場合は対応する`docs/`配下のドキュメントも同じPR/コミットで更新すること
