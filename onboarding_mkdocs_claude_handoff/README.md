# 新規参画者向けオンボーディング教材 — Claude Code引き渡しパッケージ

対象: Java開発経験あり・金融業務、Python/FastAPI、コンテナ/ECS/Valkey、CI/CD/Claude Code未経験。

## 目的
MkDocsで3日間の初期研修と参画後の発展学習を提供する。外部教材の本文は転載せず、調査済みURL・読む範囲・読み飛ばす範囲・時間・到達目標を表示する。

## ファイル
- `curriculum.md`: 3日間の研修時間割（各360分）
- `catalog_index.yaml`: 分野ごとの正本ファイル参照と時間配分
- `tracks/*/catalog.yaml`: 調査済み教材の**正本**（元の形式を維持）
- `tracks/*/guide.md`: 読書指示、比較、補足、理解度確認
- `integration_exercise.md`: 3日目の総合演習
- `quality_review.md`: 検証状態、重複、残課題
- `CLAUDE.md`: 実装時の必須制約と成果物

## 注意
調査資料の検証日は2026-09-30。今回の統合はアップロードされた資料の整合性チェックであり、全URLの再アクセス検証・コード実行検証ではない。GitLab Self-Managed、ECS、Valkey、Claude Codeの案件採用バージョンは未確定。未確認情報を推測で埋めない。
