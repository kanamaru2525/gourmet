# 簡易仕様書

##  アプリ名

現在地からお店を調べるよサービス

---

##  対象OSおよびブラウザ(ver.含む)

### 動作確認済ブラウザ
- Google Chrome バージョン: 124.0.6367.78
- Microsoft Edge バージョン: 131.0.2903.146
- Sleipnir バージョン:6.5.9.4000
### 動作確認済みOS
- Windows11 23H2
---

##  開発環境/言語
### 言語
- TypeScript
- JavaScript 
- CSS
### 開発環境
- Visual Studio Code
- Node.js 22.13.0
- Git 
- Git hub

---

##  開発期間
-  1/14 ～ 1/19

---

##  機能概要(機能一覧)

1. 検索機能　キーワード検索/検索範囲選択
2. 一覧表示機能　ページング/店名・ジャンル・アクセスの表示
3. 詳細表示 店名・ジャンル・住所・予算・定休日・営業時間の表示

---

##  フレームワーク(ver.含む)

- フレームワーク:
    - Next.js バージョン-15.1.4
- UI ライブラリ:
    - Yamada UI バージョン-1.7.3 
- 主なライブラリ:
    - axios:HTTPリクエスト用
    - swr: データフェッチング用
---

##  テーブル定義(ER図)などの設計ドキュメント
# API設計

## エンドポイント

- **エンドポイント**: `/api/shops`
- **メソッド**: `GET`
- **説明**: このエンドポイントは、ユーザーから指定された条件に基づいて飲食店情報を取得します。レスポンスとして、指定されたページネーションおよび検索条件に従って、最大12件の店舗情報を返します。

## パラメータ

リクエストに対して、以下のクエリパラメータを受け付けます。

- `count` (optional)  
  - **説明**: 1ページあたりに取得する店舗数  
  - **デフォルト値**: `12`  
  
- `startNum` (optional)  
  - **説明**: ページネーションの開始位置  
  - **例**: `?startNum=2` → 13件目から取得
  
- `range` (optional)  
  - **説明**: 検索範囲（m単位）  
  - **デフォルト値**: `3`（1000m）  
  
- `lat` (optional)  
  - **説明**: 検索を行う基準地点の緯度  
  - **デフォルト値**: 東京駅（35.681236）  
  
- `lng` (optional)  
  - **説明**: 検索を行う基準地点の経度  
  - **デフォルト値**: 東京駅（139.767125）  
  
- `keyword` (optional)  
  - **説明**: 検索キーワード（飲食店名、料理名など） 

## レスポンス

### 成功時のレスポンス

成功した場合、下記のURLのレスポンスフィールドに則ったJSON形式で店舗情報を返します。

- URL
https://webservice.recruit.co.jp/doc/hotpepper/reference.html　


##  開発環境構築手順

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/kanamaru2525/gourmet.git
   ```
2. **依存関係のインストール**
   ```bash
   cd your-project
   yarn install
   ```
3. **環境変数を設定**
   - `.env` ファイルを作成し、以下を記載：
     ```env
     NEXT_PUBLIC_HOTPEPPER_API_KEY={APIKey}
     ```
4. **開発サーバーを起動**
   ```bash
   npm run dev
   ```
5. **ブラウザで確認**
   - URL: [http://localhost:3000](http://localhost:3000)

---

##  コンセプト
- 直感的に操作して、検索結果を分かりやすく表示することをコンセプトとしました。
- これは、似たようなサービスをもちいているときに、私が感じた部分で、絞れる項目が増えすぎると直ぐに調べることができない、または使いこなす事ができないと感じたからです。
---

##  こだわったポイント
- 拘ったポイントとして、詳細機能をモーダルウィンドウをもちいて実装した部分です。<br>
技術的に私がまだTypescriptを完全に理解しきれていないので、ページ転移をなるべく少なくできる限り1つの画面で完結できるようにしました。
---

##  デザイン面でこだわったポイント
- デザイン面で拘った部分としては、Yamada UIを用いて、シンプルに作成したところです。
また、帰ってくる画像のsizeがバラバラなので、cardからはみ出ないようにデザインした部分も拘りました。
---

##  技術面でアドバイスして欲しいポイント
- modalを用いている部分に、下記のエラーが発生して、Vercelでのデプロイができなかったところ。<br>
- また、リロードを挟むと、shopdataがなかった時の表示"飲食店がみつかりませんでした”が出てしまう部分。
---

##  自己評価
- 完成度:65点
- 良かった点:提示された機能を一通り実装することができた部分と、シンプルながらデザインまで着手することができた部分。
- 改善点: デプロイすることができなかったのと、MapBoxをもちいて実際に地図上に表示することが出来たら良いなと感じた。また、モバイルへの対応をしていないためする必要があると感じた。