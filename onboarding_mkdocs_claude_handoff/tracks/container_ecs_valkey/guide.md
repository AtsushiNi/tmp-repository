# コンテナ・AWS ECS・Valkey オンボーディング教材ガイド

> 調査・検証日: 2026-09-30 / 対象: Java経験者・各技術未経験 / 初期研修合計: **255分**

## Claude Codeへの引き渡し条件

- `catalog.yaml`を教材メタデータの正本とする。初期研修の時間配分を変更しない。
- `verified: true`はページ記述の確認を意味し、コード実行や本番環境での動作保証ではない。`verified: false`の情報を推測で補わない。
- `latest`のドキュメントを固定バージョンと誤認しない。採用するDocker Engine、ECSプラットフォーム、Valkey/ElastiCacheエンジンの実バージョンは未提示。
- 外部教材はリンクと読む範囲を示し、本文を転載しない。AWS操作やDockerのインストールを初期研修の必須条件にしない。

## 既存調査のレビュー

- **重複**: CT02/CT03のDockerfile主要命令、ECS02/ECS03のタスク定義、VK02/VK03のデータ型。前者を導入、後者を補足・定着に分ける。
- **不足**: ECSの起動基盤比較、ValkeyのTTL/キャッシュ更新、障害対応・監視・同期整合性。前二者を補足し、未選定部分は発展学習に明示。
- **検証上の注意**: VK03は検索結果の本文抜粋を確認したが、直接ページを開くとリダイレクトのみ表示された。個別節の精査は未実施。

## 初期研修（合計255分）

### コンテナ（75分）

| ID | 分 | 教材 | 読む範囲 | 読み飛ばす範囲 | 到達目標 | 検証 |
|---|---:|---|---|---|---|---|
| CT01 | 20 | [Docker入門（日本語）](https://zenn.dev/yujmatsu/articles/20260106_docker_beginner) | Dockerとは、コンテナとVM、イメージとコンテナ | dbt固有の話題、運用の詳細 | コンテナの役割 | 2026-09-30確認 |
| CT02 | 25 | [Docker公式 Writing a Dockerfile](https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/) | Dockerfile例、主要命令 | ビルド最適化の詳細 | Dockerfile読解 | 2026-09-30確認 |
| CT03 | 15 | [Docker公式 Dockerfile reference](https://docs.docker.com/reference/dockerfile) | CMDとENTRYPOINTを中心に読む。FROM/RUN/COPYはCT02の復習のみ | CT02で理解済みの説明、詳細構文・高度なオプション | ビルド時と実行時の違い | 2026-09-30確認 |
| CT04 | 15 | 独自理解度確認（下記） | 下記の問題 | ― | コンテナの理解度確認 | 教材内作成 |

### AWS ECS（105分）

| ID | 分 | 教材 | 読む範囲 | 読み飛ばす範囲 | 到達目標 | 検証 |
|---|---:|---|---|---|---|---|
| ECS01 | 20 | [ECS構成要素の日本語入門](https://zenn.dev/tmtk/articles/a15f71f8150a86) | はじめに、主要構成要素 | 細かな運用論 | ECS構成要素 | 2026-09-30確認 |
| ECS02 | 25 | [AWS ECS タスク定義](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_definitions.html) | 概要、タスクとサービス | 関連トピック詳細 | タスク定義の理解 | 2026-09-30確認 |
| ECS03 | 30 | [AWS ECS Fargate開始ガイド](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/getting-started-fargate.html) | ステップ1-4の概要 | 実環境作成・削除 | ECS実行フロー | 2026-09-30確認 |
| ECS04 | 15 | [AWS Fargateタスク定義パラメータ](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_definition_parameters.html) | タスクサイズ、コンテナ定義、ネットワークモード | 全パラメータ網羅 | 設定値の役割 | 2026-09-30確認 |
| ECS05 | 15 | 独自理解度確認（下記） | 下記の問題 | ― | ECS理解度確認 | 教材内作成 |

### Valkey（75分）

| ID | 分 | 教材 | 読む範囲 | 読み飛ばす範囲 | 到達目標 | 検証 |
|---|---:|---|---|---|---|---|
| VK01 | 10 | [ValkeyとRedisの比較（日本語）](https://qiita.com/future_kame/items/2b872168cc6b6c8306b8) | Redisとは、Valkeyとは、特徴 | ライセンス・移行の細部 | Valkeyの位置付け | 2026-09-30確認 |
| VK02 | 30 | [Valkey公式 Quick start](https://valkey.io/topics/quickstart/) | What is Valkey、Data Operations、Strings、Hashes、Example Use Case: Caching with Valkey（TTLを含む） | Installation and Setup、Best Practicesの詳細、Next Steps | 基本操作 | 2026-09-30確認 |
| VK03 | 20 | [Valkey公式 Data types](https://valkey.io/docs/topics/data-types/) | Strings、Hashes、Lists、Sets、Sorted Setsの概要 | 個別コマンド全リファレンス | データ型の理解 | 2026-09-30確認 |
| VK04 | 15 | 独自理解度確認（下記） | 下記の問題 | ― | Valkey理解度確認 | 教材内作成 |

## Java経験者向け補足（独自解説）

### コンテナ

Javaのjar/warは主としてアプリケーション成果物。コンテナイメージはOSユーザー空間のファイルや実行環境、依存物、起動時の既定設定を含む。コンテナはJVMそのものではなく、Java/Python等のプロセスを隔離された環境で動かす仕組み。`RUN`はイメージ構築時、`CMD`は起動時の既定コマンド、`ENTRYPOINT`は起動時の実行コマンドを構成する。`EXPOSE`だけでホスト側へのポート公開は完了しない。

### ECS

タスク定義＝設定の設計図、タスク＝起動された実行単位、サービス＝指定数のタスクを維持する仕組み。FargateはホストEC2の直接管理を不要にする実行基盤であり、ECSそのものと同義ではない。EC2起動方式やECS Managed Instancesも存在する。タスクCPU/メモリ、コンテナ定義、IAMロール、ネットワーク設定を区別する。サービスのタスク停止時はスケジューラが置換を試みるが、アプリケーションの可用性を無条件に保証するものではない。

### Valkey

ValkeyはJavaの`HashMap`と異なりネットワーク越しのデータストア。Stringは値全体、Hashは1キーの複数フィールド、Listは挿入順の列、Setは重複なし、Sorted Setはスコア順に扱う。TTLは期限切れを制御するが、RDB更新後の鮮度を単独では保証しない。RDBを正本とする場合、同期成功時刻、更新遅延、欠損時のフォールバック、再同期を別途設計する。

## 理解度確認問題と模範解答（各分野15分）

**CT-1** Dockerfile・イメージ・コンテナの関係は？
- 模範解答: Dockerfileを使ってイメージをビルドし、イメージを元にコンテナを起動する。

**CT-2** RUNとCMDはいつ働く？
- 模範解答: RUNはビルド時、CMDはコンテナ起動時の既定コマンド。

**CT-3** JVMとコンテナは同じか？
- 模範解答: 異なる。JVMはJava実行環境、コンテナはプロセスの実行環境を隔離する仕組み。

**ECS-1** タスク定義・タスク・サービスを区別せよ。
- 模範解答: 定義は設定、タスクは実行単位、サービスは所望のタスク数を維持する仕組み。

**ECS-2** サービス配下のタスクが停止すると？
- 模範解答: サービススケジューラが必要数を回復するため代替タスクの起動を試みる。

**ECS-3** FargateのCPU/メモリはどこに設定する？
- 模範解答: タスク定義のタスクサイズ等。Fargate固有の許容組合せに従う。

**ECS-4** ECSとFargateは同じか？
- 模範解答: ECSはオーケストレーション、Fargateは実行基盤の一つ。

**VK-1** StringとHashの用途例は？
- 模範解答: Stringは単一のシリアライズ値、Hashは同一レコードの複数フィールド。

**VK-2** RDB正本のキャッシュでTTLだけで鮮度保証できるか？
- 模範解答: できない。同期遅延・失敗・古いデータの残存を別途制御する。

**VK-3** ListとSorted Setの主な違いは？
- 模範解答: Listは挿入位置に基づく順序、Sorted Setはメンバーごとのスコアに基づく順序。

## 参画後の発展学習

| テーマ | 教材 | 読む範囲 | 読み飛ばす範囲 | 目安 | 検証 |
|---|---|---|---|---:|---|
| コンテナのイメージ最適化・セキュリティ | [公式資料](https://docs.docker.com/reference/dockerfile) | マルチステージ、USER、HEALTHCHECK | 未使用命令の網羅 | 30分 | 2026-09-30確認 |
| ECS起動基盤・キャパシティプロバイダー | [公式資料](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/capacity-launch-type-comparison.html) | 起動タイプ、キャパシティプロバイダー、FargateとEC2の違い | 移行パターンの網羅 | 30分 | 2026-09-30確認 |
| ECS障害解析・CloudWatch・ALB・スケーリング | 未選定（推測禁止） | 未検証 | 未検証 | 未算定 | 未検証 |
| Valkey TTL・キャッシュミス・期限切れ | [公式資料](https://valkey.io/topics/quickstart/) | Example Use Case: Caching with Valkey、Best Practices and Troubleshooting | インストール・高度なモジュール | 25分 | 2026-09-30確認 |
| ElastiCache Valkeyエンジンのバージョン | [公式資料](https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html) | Valkeyエンジンの対応バージョンと更新上の注意 | Redis OSS/Memcachedの詳細 | 25分 | 2026-09-30確認 |
| RDB→Valkey同期の運用設計・整合性保証 | 未選定（推測禁止） | 未検証 | 未検証 | 未算定 | 未検証 |

## 案件固有で確定すべき事項

- ECS: 起動基盤、タスク定義、CPU/メモリ、IAMロール、VPC/サブネット/セキュリティグループ、ALB、監視、再起動方針。
- Valkey: 実エンジンバージョン、キー命名、TTL、更新方式、RDBとの同期遅延の上限、障害時フォールバック、永続化要否、認証/TLS。
- これらは今回の添付調査結果から確定できないため、具体的な設定値や採用方式は記載しない。

## 検証記録と制約

- 2026-09-30にDocker公式Dockerfile入門・リファレンス、AWS公式タスク定義・Fargate開始ガイド・タスクパラメータ、Valkey Quick start、既存の日本語記事3本をWebで開いた。
- Valkey Data typesはWeb検索で本文抜粋を確認。直接openはリダイレクト表示のため、ページ全体の確認済みとは扱わない。
- AWS公式起動方式比較およびElastiCacheエンジンバージョン一覧をWeb検索結果で確認。これらは更新される資料で、特定の本番バージョンを確定しない。
- Dockerコマンド、AWSリソース作成、Valkeyコマンドの実行検証はしていない。時間は推定。

## 主要根拠URL

- https://docs.docker.com/get-started/docker-concepts/building-images/writing-a-dockerfile/
- https://docs.docker.com/reference/dockerfile
- https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/task_definitions.html
- https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/getting-started-fargate.html
- https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/capacity-launch-type-comparison.html
- https://valkey.io/topics/quickstart/
- https://valkey.io/docs/topics/data-types/
- https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/engine-versions.html
