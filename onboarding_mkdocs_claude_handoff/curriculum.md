# 3日間の初期研修カリキュラム

1日あたり**360分（6時間、休憩は別）**、合計1080分。外部教材の時間は推定値。順序は提案であり案件要件に応じて調整可。

## 1日目：APIアプリケーション（360分）
| 学習項目 | 分 | 参照 |
|---|---:|---|
| 案件概要・金融リスク計測システムの全体像 | 45 | 案件固有・要作成 |
| Python | 105 | tracks/python_webapi_fastapi/guide.md |
| Web API / HTTP / REST | 60 | 同上 |
| FastAPI | 120 | 同上 |
| 復習・確認問題 | 30 | 同上の理解度確認問題 |

## 2日目：実行基盤・開発運用（360分）
| 学習項目 | 分 | 参照 |
|---|---:|---|
| コンテナ | 75 | tracks/container_ecs_valkey/guide.md |
| AWS ECS | 105 | 同上 |
| Valkey | 75 | 同上 |
| GitLab CI/CD | 60 | tracks/gitlab_claude_code/guide.md |
| Claude Code | 45 | 同上 |

## 3日目：金融リスク計測（360分）
| 学習項目 | 分 | 参照 |
|---|---:|---|
| デリバティブの基礎 | 75 | tracks/financial_risk/guide.md |
| 時価評価・リスクファクター | 60 | 同上 |
| CE・PE・PFE、CVA概要 | 90 | 同上 |
| モンテカルロ法 | 90 | 同上 |
| 総合演習 | 45 | integration_exercise.md |

## 到達目標
- Pythonの短いコードとFastAPIの入出力・エラー処理を読める。
- HTTPリクエストからECSタスク・Valkey参照までの構成を説明できる。
- GitLab pipeline / stage / job / RunnerとClaude Codeの検証手順を説明できる。
- **案件用語としてのPE=想定元本×掛目、簡便方式CE+PE**と、将来分布の分位点を使うシミュレーションPFEを区別できる。
- モンテカルロの「シナリオ→将来時価→正のエクスポージャー→分位点/平均」を説明できる。
