# My Bookshelf — GitHub Pages版

HTML/CSS/JavaScriptだけで動く、個人用の読書記録アプリです。Node.jsやSQLiteのサーバーは不要です。

## 機能
- 本の追加・編集・削除
- 読了／未読、お気に入り、評価、ジャンル、読了日、購入日
- 感想・メモ・心に残った言葉
- キーワード検索、絞り込み、並び替え
- 年間読書目標とジャンル集計
- JSONバックアップの書き出し・復元
- ブラウザーの `localStorage` に保存

## GitHub Pagesで公開する手順

1. GitHubにログインし、右上の `+` → **New repository** を選びます。
2. Repository nameを `my-bookshelf` などにします。
3. **Public** を選び、**Create repository** を押します。
4. **Add file** → **Upload files** を選び、このフォルダー内の `index.html`、`styles.css`、`app.js`、`README.md` をアップロードします。ZIPそのものではなく、解凍後のファイルをアップロードしてください。
5. **Commit changes** を押します。
6. リポジトリの **Settings** → 左メニュー **Pages** を開きます。
7. **Build and deployment** の **Source** で `Deploy from a branch` を選びます。
8. Branchを `main`、フォルダーを `/(root)` にして **Save** を押します。
9. 1〜数分ほど待ち、同じPages画面に表示される **Visit site** を押します。URLは通常 `https://GitHubのユーザー名.github.io/リポジトリ名/` です。

## データ保存について（重要）

- 本のデータは公開サイトやGitHubのリポジトリではなく、**アクセスしたブラウザー内**に保存されます。
- 同じURLでも、別の端末・別のブラウザーとはデータが共有されません。
- ブラウザーのデータ削除や端末故障でデータを失う可能性があるため、定期的に「JSONを書き出す」でバックアップしてください。
- GitHub PagesのURLを知っている人はサイトを閲覧できます。個人情報や公開したくないメモをサイト上で公開する仕組みではありませんが、入力内容は自分の端末で管理し、共有端末では使用を避けてください。
- この版にはログイン機能・クラウド同期はありません。複数端末で同じデータを使いたい場合は、認証付きのバックエンドを別途用意してください。
- 表紙画像URLは外部サイトから読み込まれます。画像URLのサイトが画像表示を許可していない場合は表示されません。

## ローカルで試す

`index.html` をブラウザーで開くだけで動作します。開発時はVS CodeのLive Serverなどを利用してもOKです。
