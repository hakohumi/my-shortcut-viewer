# MyShortcutViewer

## 概要

達成したい課題

- 久しぶりに使用するショートカットのコマンドを思い出したい。
- よく使用するショートカットをリストで出したい。

アプリの挙動

ショートカットコマンドでアプリを実行すると、

画面上に、事前に登録した表示させたいコマンド一覧を表示させる。
or
コマンドパレットにコマンド一覧がでてきて、選択できる。

## アプリの仕様

### 流れ

1. 事前に表示させたいコマンドのリストをsettings.jsonの`myshortcutviewer.myshortcut`オブジェクトから読み込む。
   - package.jsonで拡張機能の設定値として登録しておく。
2. 読み込んだコマンドリストのショートカットキーを取得する。
   - 現在のショートカットの一覧を取得する。
     - デフォルトのショートカットリスト(ファイルで存在しないため、ビューとして表示させる。)
     - ユーザが変更したショートカットリスト(bindings.json)
   - 表示させたいコマンドのkeyを抽出する。
3. 各コマンドをQuickPick(コマンドパレットで選択できるView)として登録し、コマンド名、ショートカットコマンドを表示させ、選択して実行できるようにする。

### TODO

- [x] settings.jsonに登録したコマンドを取得できる
- [x] settings.jsonから取得したコマンドのkeyを取得する
  - [x] keybindings.jsonからコマンドとkeyを取得する
  - [x] settings.jsonで取得したコマンドを結合し、keyを対応させる
- [x] コマンドパレットの場所にsettings.jsonで取得したコマンドとkeyを表示させる
- [x] コマンドパレットで表示させたコマンドを選択するとコマンドが実行できる
- [x] keybindings.jsonにコマンドが存在しない場合、既定のキーバインディングからデフォルトのショートカットキーをを取得してくる
- [ ] コマンド名の変更
- [ ] settings.jsonの初期値や型の設定
- [ ] settings.jsonにコマンドを追加する時、候補を表示させる
- [ ] settings.jsonに変な値が入った場合の処理
- [ ] "oem_3"などの文字をわかりやすくパースしたい
- [ ] サイドパネルorビューでショートカット一覧を表示
- [ ] MacOS対応
