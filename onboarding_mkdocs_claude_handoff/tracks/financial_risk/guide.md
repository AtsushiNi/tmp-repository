# 金融リスク計測 入門研修ガイド

- 調査日: 2026-09-30
- 対象: Java開発経験者・金融未経験者
- 初期研修: 315分
- 方針: 外部資料へのリンクを中心にし、案件固有の補足だけを記載する。
- 検証区分: `verified_page` はWebページの本文または索引を実際に開いて確認。`verified_search` は検索結果で内容を確認したが本文の再オープンに失敗。`not_verified` は内容未確認。

## 研修の順序

| 分野 | 時間 | 読む教材・範囲 | 読み飛ばす範囲 | 到達目標 |
|---|---:|---|---|---|
| デリバティブ基礎 | 75分 | JPX有識者コラム第1〜3話（各15分）、日本証券業協会「仕組債とは」第1項（10分）、取引例と確認問題（20分） | JPX第4話以降、投資戦略・取引所制度の細部 | 先物・オプション・スワップの契約とCFを説明できる |
| 時価評価・リスクファクター | 60分 | JPXオプション価格計算ツールの説明・利用（15分）、MathWorks例のリスクファクターと将来時価評価の説明（20分）、金利・為替と時価の補足（15分）、確認（10分） | オプション取引戦略、MATLABコード詳細 | 市場データから時価が決まる流れを説明できる |
| CE・PE・PFE | 90分 | BIS CRE50の50.26〜50.28（15分）、EBA 2013_611の質問・回答（15分）、案件定義の補足とCE+PE計算（20分）、PFEとCVAの比較（25分）、確認（15分） | CRE50の法的定義の詳細、EBAの法改正履歴、SA-CCRの詳細式 | 簡便方式とシミュレーション方式を区別できる |
| モンテカルロ法 | 90分 | MathWorks例の導入・シナリオ・将来評価・Exposure・CVAに関する説明（35分）、処理フロー補足（25分）、手計算例（20分）、確認（10分） | MATLABの実装コード、キャリブレーション詳細、数値計算最適化 | 時点×経路のエクスポージャー配列から分位点を計算できる |

各所要時間は研修設計上の目安であり、外部サイトの公称時間ではない。英語資料は指定段落を中心に読み、必要に応じてブラウザ翻訳を使う。

## 採用教材URLと選定理由

1. [JPX 有識者コラム](https://www.jpx.co.jp/derivatives/market-report/column/index.html) — 第1〜3話（先物、オプション、スワップ）。日本語、金融未経験者向け。索引確認済み。PDF個別本文の全ページ精査は未実施。
2. [日本証券業協会「仕組債とは？」](https://www.jsda.or.jp/about/hatten/risk/shikumisai/index.html) — 第1項。スワップ・オプションがキャッシュフローに与える影響を確認。本文確認済み。
3. [JPX オプション価格計算ツール](https://www.jpx.co.jp/markets/derivatives/options-calculator/) — ツールの説明と価格変化の観察。案内ページ確認済み。ツール内部の動作は未検証。
4. [BIS CRE50](https://www.bis.org/committees/bcbs/basel-framework/standard/cre/50/inforce/2019-12-15/published/2019-12-15) — 50.26〜50.28。Current/Peak/Expected Exposureの定義。本文確認済み。
5. [EBA Q&A 2013_611](https://www.eba.europa.eu/single-rule-book-qa/qna/view/publicId/2013_611) — 質問・最終回答。正の時価と想定元本×掛目によるアドオン。検索結果で確認、本文再オープン失敗。2021年にアーカイブ済みの旧方式であることに注意。
6. [MathWorks Counterparty Credit Risk and CVA](https://www.mathworks.com/help/fininst/counterparty-credit-risk-and-cva.html) — 導入、リスクファクター・エクスポージャー・CVAの説明。本文確認済み。MATLABコードは読まない。
7. [BIS CRE52 SA-CCR](https://www.bis.org/committees/bcbs/basel-framework/standard/cre/52/inforce/2019-12-15/published/2020-06-05) — 発展学習。EAD = 1.4×(RC+PFE)。検索結果で確認、本文再オープン失敗。

## 用語・定義・数式と出典

| 用語 | この研修での意味 | 根拠と前提 |
|---|---|---|
| CE | 現在の信用エクスポージャー。単一無担保取引の説明例は max(V0,0) | BIS CRE50.26。ネッティング・担保等は別途考慮 |
| PE | **案件固有の定義**：想定元本×掛目の簡便方式アドオン | EBA Q&A 2013_611が旧Mark-to-market方式のnotional×percentageを説明。PEという略称自体は案件用語 |
| 簡便方式の与信残高 | **案件固有の基本形** CE+PE | 旧Current Exposure/Mark-to-market方式との類似。規制上の現行一般式とは断定しない |
| PFE（シミュレーション） | 将来時点の正のエクスポージャー分布の所定分位点。教材内ではPFE(t)=Q_q[max(V(t),0)] | BIS CRE50.27はPeak Exposureを高分位点として定義。PFE呼称・対象期間・信頼水準は案件仕様確認が必要 |
| EE | 将来時点の正のエクスポージャーの平均 | BIS CRE50.28 |
| CVA | カウンターパーティのデフォルトによる期待損失を反映する価値調整 | MathWorksのunilateral CVA例。概念式 CVA=(1-R)∫discountedEE(t)dPD(t)。モデルの測度・相関・担保条件に依存 |
| SA-CCR | 規制上の別方式。EAD=1.4×(RC+PFE) | BIS CRE52。ここでのPFEは規制方式のアドオンであり、シミュレーション分位点と混同しない |

**重要**：BISではPEがPeak Exposureの略として使われることがある。本案件のPE（想定元本×掛目）と同一視しない。さらにPFEは資料ごとに「高分位点」「規制上のアドオン」などを指し得る。画面・DB・設計書では計算方式と定義を明記する。

## 独自補足：Java開発者のための処理フロー

### 簡便方式

```text
TradeRepository -> TradeDTO (notional, productType, maturity, ...)
MarketDataRepository -> MarketData
PricingService.price(trade, marketData) -> V0
CurrentExposureCalculator -> CE = max(V0, 0) [単一無担保取引の例]
AddonRateRepository -> rate(productType, maturity, ...)
PotentialExposureCalculator -> PE = notional * rate [案件の簡略例]
CreditExposureAggregator -> CE + PE [案件の簡略例]
```

### シミュレーション方式

```text
Trade/Portfolio + MarketData + ModelParameters
  -> ScenarioGenerator: riskFactors[scenario][time]
  -> PricingEngine: mtm[scenario][time]
  -> Netting/Collateral (適用時)
  -> ExposureCalculator: exposure[scenario][time] = max(netMtm, 0) [無担保例]
  -> DistributionAggregator:
       PFE[time] = quantile(exposure[:,time], q)
       EE[time]  = mean(exposure[:,time])
  -> PFE reporting / CVA calculation (EE, default probabilities, recovery, discount)
```

**教育用数値例**：将来1年後の4シナリオの時価を `[-10, 20, 50, 100]` とすると、無担保・単一取引のエクスポージャーは `[0,20,50,100]`。EEは42.5。75%分位点は分位点の補間規則に依存する（nearest-rankなら50、線形補間なら62.5）。実務では99%などの高分位点、十分なシナリオ数、分位点定義を指定する。数値例は独自作成。

### PFEとCVAの違い

- 共通: リスクファクターシナリオ、将来時価、ネッティング・担保を考慮したエクスポージャー計算を再利用できる場合がある。
- PFE: 将来時点ごとのエクスポージャー分布の高分位点を計算。信用限度・与信管理などで利用。
- CVA: 将来の期待エクスポージャーにデフォルト確率・損失率・割引等を適用し、信用リスクによる価値調整を求める。
- 注意: PFEとCVAでは使用する確率測度（実世界/リスク中立）、シナリオ校正、信用との依存関係、担保・割引の扱いが異なる場合がある。**同じ乱数経路や計算結果をそのまま共用できるとは限らない**。

## 理解度確認（回答例付き）

1. Q: 先物・オプション・スワップの違いは？ A: 将来の売買契約、権利、CF交換という契約構造の違い。
2. Q: 時価と想定元本は同じか？ A: 違う。想定元本は契約上の計算基準、時価は市場条件で変わる評価額。
3. Q: 単一無担保取引でV0=-5のCEは？ A: 0。
4. Q: 想定元本1億円、掛目2%、CE300万円ならCE+PEは？ A: PE200万円、合計500万円。
5. Q: PEとPFEは同じか？ A: この案件では違う。PEは掛目アドオン、シミュレーションPFEは将来分布の分位点。
6. Q: モンテカルロ法の順序は？ A: 市場シナリオ→将来時価→エクスポージャー→分位点。
7. Q: 時価がマイナスのシナリオはどうする？ A: 単一無担保取引の説明例では正の部分を取り0にする。
8. Q: EEとPFEの集約演算は？ A: EEは平均、PFEは分位点。
9. Q: PFEの値がCVAの直接入力になるか？ A: 通常の基本的なCVA式ではPFE分位点ではなく期待エクスポージャーを使う。
10. Q: SA-CCRのPFEとシミュレーションPFEは同じか？ A: 必ずしも同じでない。前者は規制方式のアドオン成分。
11. Q: 分位点の実装で確認する事項は？ A: 信頼水準、補間規則、時点、シナリオ数、集計単位。
12. Q: CVAとPFEのシナリオをそのまま共用できるか？ A: モデル・測度・校正・担保条件の整合確認が必要。

## 発展学習

1. BIS CRE50：ネッティングセット、担保、Expected Positive Exposure、Peak Exposureの全定義。
2. BIS CRE52：SA-CCRのRC、PFE add-on、multiplier、alphaと適用条件。
3. MathWorks例：金利モデルの校正、シナリオ生成、将来キャッシュフロー割引、CVA計算コード。
4. JPXの先物・オプション詳細パンフレット：商品ごとのペイオフと理論価格。
5. 案件内資料（未提供・未検証）：掛目テーブル、CE集計単位、ネッティング、担保、PFE信頼水準、時間軸、シナリオ測度、CVAモデル、計算頻度。

## Claude Codeへの実装指示（今回は実装しない）

- `catalog.yaml` のURL・検証状態・学習時間をそのまま表示すること。
- 外部Webサイトへアクセスして確認したと偽らないこと。調査済みの定義・数式は本ガイドを優先し、知識で上書きしないこと。
- 初期研修と発展学習を別ページにし、各セクションに進捗チェックと理解度確認を設けること。
- 外部資料の本文を転載しないこと。独自補足のみローカル教材として記述すること。
- 案件固有・規制上・教育用単純化を必ず区別すること。
