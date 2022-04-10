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

1. 事前に表示させたいコマンドのリストをsettings.jsonの独自キーから読み込む
   - package.jsonで拡張機能の設定値として登録しておく。
2. 読み込んだコマンドリストのショートカットキーを取得する。
   - 現在のショートカットの一覧を取得する。
   - 表示させたいコマンドのkeyを抽出する。
3. 各コマンドをQuickPick(コマンドパレットで選択できるView)として登録し、コマンド名、ショートカットコマンドを表示し、選択して実行できるようにする。

現在

- keybindings.jsonから、ユーザが変更したことのあるショートカットを読み込み、コマンドパレットで選択し実行できる機能となっている。
