# GitLab CI/CD・Claude Code オンボーディング学習ガイド

- 検証日: 2026-09-30
- 対象: Java/Maven経験あり、GitLab基本操作経験少々、CI/CD・Claude Code初心者
- 初期研修: GitLab CI/CD 60分 + Claude Code 45分 = 105分
- 検証の意味: 公開Webページの表示・記述を確認。製品の実機動作や社内環境への適合は未検証。
- 参照先の製品バージョン: GitLab公式現行オンライン文書（特定バージョン固定なし）、Claude Code公式現行オンライン文書（特定CLIバージョン固定なし）。社内GitLabバージョン・Runnerバージョンは未確認。

## 初期研修 A: GitLab CI/CD（60分）

| 時間 | 教材 | 読む範囲 | 読み飛ばす範囲 | 到達目標・選定理由 |
|---|---|---|---|---|
| 0–10分 | [パイプライン](https://docs.gitlab.com/ja-jp/ci/pipelines/) | 冒頭、パイプラインの構成・実行契機 | 高度なパイプライン種別・運用管理 | pushから処理が始まる仕組みを説明。公式日本語で概念が整理されている |
| 10–20分 | [ジョブ](https://docs.gitlab.com/ja-jp/ci/jobs/) | 冒頭、ジョブの追加、ステージとジョブ | 高度なジョブ制御・トラブルシューティング | job/stage/Runnerの役割を区別。公式で実行ログの概念まで確認できる |
| 20–45分 | [初めてのパイプライン](https://docs.gitlab.com/ja-jp/ci/quick_start/) | 前提条件、Runner確認、`.gitlab-ci.yml`作成、パイプライン確認 | `needs`、`rules`、`cache`、`artifacts`の詳細 | YAMLから実行までの流れを追える。実習可能ならサンドボックスのみで実行 |
| 45–52分 | [Runner管理](https://docs.gitlab.com/ja-jp/ci/runners/runners_scope/) | 冒頭のRunnerの種類と適用範囲 | Runner作成・登録・削除・トークン管理 | RunnerがGitLabサーバーとは別の実行主体だと説明できる |
| 52–60分 | 本ガイドの補足・理解度確認 | Java/Maven対応表と設問1〜4 | なし | 知識を既存のJava開発経験に結びつける |

**学習時の注意:** GitLab.comとSelf-ManagedではRunnerの準備状況が異なる。既存プロジェクトの `.gitlab-ci.yml` を閲覧できる場合は、`stages`、各ジョブの `stage`、`script`、`tags` を探す。実環境へのpushやRunner設定変更は行わない。

### Java/Maven経験者向け補足

- `mvn test` は実行するコマンド。GitLabの **job** はそのコマンドをRunner上で実行する単位。
- `build`、`test` は **stage** の例。Mavenライフサイクルのフェーズと同一ではない。
- **pipeline** は複数jobの実行全体。GitLabが管理し、実際のjob実行はRunnerが担う。
- `.gitlab-ci.yml` はGitLab CI/CDの設定ファイル。`pom.xml` の代替ではなく、`mvn` を呼び出す側。
- Runnerのexecutorによって実行環境が変わる。Docker executorを使う場合の`image`を、すべてのRunnerで共通の必須項目と誤解しない。
- 同一stageのjobはRunnerの空きなど条件が整えば並列実行される。stage順とjob間依存を混同しない。

### 概念確認用の最小例（教材独自・実機未検証）

```yaml
stages:
  - build
  - test

compile:
  stage: build
  script:
    - mvn -B -DskipTests package

unit_test:
  stage: test
  script:
    - mvn -B test
```

この例は**Runner側にJavaとMavenが利用可能であること**が前提。実際に使う場合はexecutor、イメージ、ネットワーク、Maven依存関係取得、キャッシュ等を別途設計する。build成果物をtestジョブに引き継ぐ構成にはなっていない。

### GitLab CI/CD 理解度確認

1. Pipeline、stage、job、Runnerをそれぞれ1文で説明する。
2. `stages: [build, test]` にbuildジョブ2個、testジョブ1個がある。通常のステージ実行順と、並列実行の条件を説明する。
3. `.gitlab-ci.yml` と `pom.xml` の責務の違いは何か。
4. ジョブがpendingのままのとき、Runnerの利用可能性とタグを確認する理由は何か。

**解答の観点:** 1: 全体/段階/処理単位/実行主体。2: build段階完了後test、同一段階はRunnerが対応できれば並列。3: CIオーケストレーションとJavaビルド定義。4: 実行可能なRunnerが見つからない場合がある。

## 初期研修 B: Claude Code（45分）

| 時間 | 教材 | 読む範囲 | 読み飛ばす範囲 | 到達目標・選定理由 |
|---|---|---|---|---|
| 0–7分 | [概要](https://code.claude.com/docs/ja/overview) | Claude Codeとは、利用方法・基本的な機能 | 多様な環境・連携機能の詳細 | IDE補完との違いとエージェントの作業範囲を理解 |
| 7–19分 | [クイックスタート](https://code.claude.com/docs/ja/quickstart) | 前提条件、起動、初期操作、基本タスク | OS別インストールの詳細（社内手順を優先） | 対象リポジトリで起動して質問する流れを説明 |
| 19–31分 | [一般的なワークフロー](https://code.claude.com/docs/ja/common-workflows) | コードベース理解、バグ修正、テストに該当する節 | 高度な拡張・外部連携 | 調査→変更→テストの進め方を説明 |
| 31–38分 | [ベストプラクティス](https://code.claude.com/docs/ja/best-practices) | 目的と検証条件の明示、変更確認、反復改善に関する節 | 高度なコンテキスト最適化 | 根拠・差分・テスト結果を確認する姿勢を身につける |
| 38–41分 | [セキュリティ](https://code.claude.com/docs/ja/security) | 権限・承認と安全な利用に関する冒頭 | 管理者向け詳細設定 | AIに操作権限を渡すリスクを認識 |
| 41–45分 | 本ガイドの補足・理解度確認 | 設問5〜8 | なし | 実務での利用判断を確認 |

**制約:** Claude Codeが外部Webにアクセスできない研修環境では、URLの存在確認や新機能の断定をClaude Codeにさせない。公式資料の確認はブラウザで行う。Claude Codeのインストールや認証は社内承認済み環境でのみ実施する。

### Java開発者向けの利用パターン

- **コード理解:** 「`pom.xml`と`src/main/java`を読み、モジュール間依存を根拠ファイル付きで説明。変更しない」
- **修正:** 「この不具合の再現条件と修正方針を先に提示。承認後に最小限の差分で修正」
- **テスト:** 「影響するJUnitテストを特定し、実行可能なら実行。実行できなければ未実施と明記」
- **レビュー:** 「`git diff`の変更箇所について、欠陥候補、根拠、再現手順、重要度を整理。コードを変更しない」
- **人間による確認:** `git diff`、テスト結果、例外処理、既存仕様との整合をレビュー。AIの説明だけで完了扱いにしない。

### Claude Code 理解度確認

5. コードを変更せず既存処理を調査させるには、どのように指示するか。
6. Claude Codeが「テストは成功」と回答した。何を確認するか。
7. AIによるレビュー指摘を、そのままマージリクエストへ転記してよいか。理由は何か。
8. 外部WebにアクセスできないClaude Codeが、GitLabの最新仕様を説明した。どう扱うか。

**解答の観点:** 5: 対象ファイル・質問・根拠提示・変更禁止を明示。6: 実行コマンド、ログ、実行環境、未実施項目。7: いいえ、コードと仕様に照らして人が検証。8: 未検証とし、事前検証した公式URLと検証日を参照。

## 参画後の発展学習

### GitLab CI/CD

1. [複雑なパイプラインのチュートリアル](https://docs.gitlab.com/ja-jp/ci/quick_start/tutorial/) — 45〜60分（目安）。`image`、`artifacts`、複数ジョブを追う。Docusaurus固有の操作は省略可。
2. [YAML構文リファレンス](https://docs.gitlab.com/ja-jp/ci/yaml/) — 40〜60分（目安）。`rules`、`needs`、`artifacts`、`cache`、`tags`、`resource_group` を必要なときに参照。通読しない。
3. [Runner管理](https://docs.gitlab.com/ja-jp/ci/runners/runners_scope/) — 20〜30分（目安）。instance/group/projectの使い分け。設定変更は行わない。
4. 社内GitLabのバージョン・Runner executor・タグ・ジョブ実行権限・Mavenビルド環境は案件固有情報として別途確認。

### Claude Code

1. [一般的なワークフロー](https://code.claude.com/docs/ja/common-workflows) — 30〜45分（目安）。Git操作、テスト、変更管理を深掘り。
2. [ベストプラクティス](https://code.claude.com/docs/ja/best-practices) — 30〜45分（目安）。大きな変更を分割し、検証条件を先に決める。
3. [セキュリティ](https://code.claude.com/docs/ja/security) — 20〜30分（目安）。権限、承認、機密情報の扱い。
4. [Claude Code 101 日本語解説（第三者）](https://zenn.dev/appare/articles/claude-code-101-01-what-is-claude-code) — 20〜30分（目安）。2026年9月の記事。新機能・操作方法は公式資料と照合する。

## 候補比較と採否

| 分野 | 候補 | 採否 | 理由 |
|---|---|---|---|
| GitLab | 公式クイックスタート | 初期採用 | 日本語、YAMLから実行まで一続き |
| GitLab | 公式パイプライン・ジョブ | 初期採用 | 基礎用語を正確に把握できる |
| GitLab | [GitLab CI/CD導入の手引き（2019）](https://zenn.dev/forcia_tech/articles/20191208_gitlab_ci_cd) | 補助のみ | 読みやすいが古く、Node題材でMavenに直接対応しない |
| GitLab | 公式複雑なパイプライン | 発展採用 | 学習量が60分枠に収まらない |
| Claude | 公式概要・クイックスタート | 初期採用 | 現行公式日本語ページ |
| Claude | 公式ワークフロー・ベストプラクティス・セキュリティ | 初期一部・発展 | 実務と安全面に必要だが通読には長い |
| Claude | [Claude Code 101 日本語解説（2026）](https://zenn.dev/appare/articles/claude-code-101-01-what-is-claude-code) | 発展補助 | 新しい日本語の全体像。ただし第三者記事 |
| Claude | [2025年の入門ハンズオン](https://zenn.dev/canly/articles/2e0d115e360144) | 非採用 | バージョン依存の操作説明が古くなるおそれ |

## 検証範囲・保守ルール

- 2026-09-30時点で上記の主要な公式ページをWebで開いて確認。記事の全文と全リンク先を網羅的に検証したわけではない。
- 時間は本研修向けの**推定学習時間**であり、公式が保証する読了時間ではない。
- GitLab Self-Managedの特定バージョン、Claude Codeの特定CLIリリースでの動作は**未検証**。
- MkDocs構築時は、このガイドとcatalog.yamlに記載された事実のみを利用し、Claude Code自身の学習済み知識でバージョン・URL・機能を補完しない。
- 外部ページが見つからない場合は「リンク未確認」と表示し、代替URLを創作しない。
- 外部教材の本文は転載せず、リンクと学習指示だけを表示する。
- 本ファイルのコード例は概念説明用であり、運用投入前に社内環境で検証する。
