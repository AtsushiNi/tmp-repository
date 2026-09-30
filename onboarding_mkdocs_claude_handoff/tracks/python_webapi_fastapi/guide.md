# Python・Web API・FastAPI 外部教材 学習ガイド

調査日: 2026-09-30
対象: Java開発経験者、Python/FastAPI未経験
目的: 金融リスク計測システム参画時の初期研修
注意: 所要時間は推定。URLと記載範囲はWebページを開いて確認済み。外部教材の転載はしない。

## 選定方針
- 公式ドキュメントを正確性の基準とし、日本語解説を導入に使う。
- Java既習の基本概念を重複して教えない。
- 公式FastAPI日本語版はAI翻訳を含むため、不明瞭な箇所は英語原文を確認する。
- コード実行環境が使えない場合は実習をコード読解に切り替える。

## 候補比較
| 分野 | 候補 | 採否 | 理由 |
|---|---|---|---|
| Python | [公式チュートリアル](https://docs.python.org/ja/3/tutorial/) | 主教材 | 正確・体系的。ただし範囲を絞る |
| Python | [JavaとPythonの違い Qiita](https://qiita.com/yukikoblog8376/items/41df37828fd96ef6d2c7) | 補助 | コード対比が分かりやすい。型の説明は公式で補う |
| Python | [Python×Java命名比較 Qiita](https://qiita.com/cake-milk/items/f3a6d98d0066cf404312) | 発展 | コーディング規約に適する |
| Web API | [MDN HTTP概要](https://developer.mozilla.org/ja/docs/Web/HTTP/Guides/Overview) | 主教材 | HTTPの仕組みを説明 |
| Web API | [AWS RESTful API](https://aws.amazon.com/jp/what-is/restful-api/) | 主教材 | システム間連携の例がある |
| Web API | [MDN メソッド](https://developer.mozilla.org/ja/docs/Web/HTTP/Reference/Methods) | 主教材 | 標準的なHTTPメソッド説明 |
| Web API | [MDN ステータス](https://developer.mozilla.org/ja/docs/Web/HTTP/Reference/Status) | 主教材 | ステータスコードを確認できる |
| FastAPI | [公式チュートリアル](https://fastapi.tiangolo.com/ja/tutorial/) | 主教材 | 最小アプリから段階的に学べる |
| FastAPI | [Zenn FastAPI入門](https://zenn.dev/oit2003/articles/5f344b75ad5391) | 補助 | 日本語で実装全体像をつかめる |

## 初期研修: Python 105分
| 分 | 教材・範囲 | 到達目標 | スキップ |
|---:|---|---|---|
| 10 | [Qiita JavaとPythonの違い](https://qiita.com/yukikoblog8376/items/41df37828fd96ef6d2c7) 文法、インデント、繰り返し、リスト、クラス | Javaとの差を把握 | 初心者向け一般論 |
| 20 | [Python公式 3章](https://docs.python.org/ja/3/tutorial/introduction.html) 3.1.2、3.1.3 | 文字列、スライス、リスト | 3.1.1電卓 |
| 25 | [Python公式 4章](https://docs.python.org/ja/3/tutorial/controlflow.html) 4.1～4.3、4.8の関数定義と引数 | 制御フロー、関数 | 高度な関数機能 |
| 25 | [Python公式 5章](https://docs.python.org/ja/3/tutorial/datastructures.html) 5.1、5.5、5.6 | リスト、辞書、ループ | スタック・キュー、タプル・集合の詳細 |
| 15 | [Python公式 8章](https://docs.python.org/ja/3/tutorial/errors.html) 8.1～8.4 | 例外処理、例外送出 | 高度な例外処理 |
| 10 | 確認問題・コード読解 | 短い関数を説明 | - |

## 初期研修: Web API 60分
| 分 | 教材・範囲 | 到達目標 | スキップ |
|---:|---|---|---|
| 15 | [MDN HTTP概要](https://developer.mozilla.org/ja/docs/Web/HTTP/Guides/Overview) 構成要素、フロー、メッセージ | リクエストとレスポンスを説明 | 歴史、HTTP/2詳細、Cookie詳細 |
| 15 | [AWS RESTful API](https://aws.amazon.com/jp/what-is/restful-api/) APIとは、RESTとは、仕組み、クライアントリクエスト | API構造を説明 | AWS製品紹介 |
| 10 | [MDN HTTPメソッド](https://developer.mozilla.org/ja/docs/Web/HTTP/Reference/Methods) GET、POST、PUT、DELETE | メソッドの用途を説明 | 他メソッドの詳細 |
| 10 | [MDN ステータス](https://developer.mozilla.org/ja/docs/Web/HTTP/Reference/Status) 200、201、400、401、403、404、422、500、503 | 成功・失敗を区別 | その他のコード |
| 10 | 確認問題 | HTTP通信を読解 | - |

## 初期研修: FastAPI 120分
| 分 | 教材・範囲 | 到達目標 | スキップ |
|---:|---|---|---|
| 15 | [Zenn FastAPI入門](https://zenn.dev/oit2003/articles/5f344b75ad5391) 概要、最小アプリ、Swagger UI | 全体像を理解 | 詳細な環境設定 |
| 20 | [公式 最初のステップ](https://fastapi.tiangolo.com/ja/tutorial/first-steps/) 最小アプリ、起動、/docs、OpenAPI | GET APIを説明・実行 | デプロイ関連 |
| 20 | [公式 パス](https://fastapi.tiangolo.com/ja/tutorial/path-params/)・[クエリ](https://fastapi.tiangolo.com/ja/tutorial/query-params/) 型宣言、デフォルト、検証 | 検索条件を受け取る | 高度なパラメータ検証 |
| 20 | [公式 ボディ](https://fastapi.tiangolo.com/ja/tutorial/body/) Pydanticモデル、型、ボディ | JSONをモデルで受け取る | 複雑なネスト |
| 15 | [公式 レスポンスモデル](https://fastapi.tiangolo.com/ja/tutorial/response-model/) 戻り値の型、response_model | 出力形式を定義 | 高度なフィルタリング |
| 15 | [公式 エラーハンドリング](https://fastapi.tiangolo.com/ja/tutorial/handling-errors/) HTTPException中心 | HTTPエラーを返す | カスタムハンドラー |
| 15 | ミニ演習: 架空の市場データ検索API | GET、入力検証、JSON応答、404を説明 | - |

## 理解度確認問題
1. Javaの`Map<String, Integer>`に近いPythonの組み込みデータ構造は何か。
2. Pythonの`list[dict[str, float]]`が表す構造は何か。
3. Pythonの`try/except`はJavaの何に対応するか。
4. HTTPリクエストのメソッド、URL、ヘッダー、ボディの役割を説明せよ。
5. 401と403の違いを説明せよ。
6. FastAPIの`@app.get('/items/{item_id}')`は何を宣言しているか。
7. `item_id: int`に数字以外を渡した場合、どこで入力検証されるか。
8. Pydantic `BaseModel`とJava DTOの類似点・相違点を挙げよ。
9. `response_model`を設定する理由を説明せよ。
10. `HTTPException(status_code=404)`を使う場面を説明せよ。

## 発展学習
- Python: [クラス](https://docs.python.org/ja/3/tutorial/classes.html)、[モジュール](https://docs.python.org/ja/3/tutorial/modules.html)、[venv](https://docs.python.org/ja/3/library/venv.html)（URL・内容未検証、後日確認）
- FastAPI: [Dependencies](https://fastapi.tiangolo.com/ja/tutorial/dependencies/)、[Bigger Applications](https://fastapi.tiangolo.com/ja/tutorial/bigger-applications/)、[Testing](https://fastapi.tiangolo.com/ja/tutorial/testing/)（URL・内容未検証）
- 案件補足: Router/Service/Repository、同期/非同期、SQLAlchemy、API Key、pytest、uv、環境変数、ECS/Valkey接続。

## 補足教材の制作方針
- JavaとPythonの比較表（型、例外、クラス、コレクション、命名）。
- PydanticとJava DTOの対応図。
- FastAPIのRouter/Service/Repository構成図。
- `def`と`async def`の使い分けの概説。
- 架空の市場データ検索API（実データ・秘密情報は使わない）。
- 外部教材の内容は転載せず、リンクと案件固有の補足のみを記載。

## 調査の限界
- URLと主要記載内容は2026-09-30にWebで確認。全コード例の実行検証は未実施。
- 学習時間は実測値ではなく推定。
- 発展学習のURLは候補として記載したもので、個別ページの検証は未実施。
