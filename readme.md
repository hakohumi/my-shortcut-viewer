# MyShortcutViewer

## この拡張機能の概要

VSCodeで色々な言語やフレームワークを転々としていると、環境ごとに使用する拡張機能が異なりますよね。
「前はよく使用してたんだけど、久々でショートカットキー忘れちゃった」というように、使用したいショートカットのキーが思い出せないということが私はよくあります。

なので、よく使うショートカット「だけ」をパッと一覧で表示できたらなぁ、と思い作成したのがこの拡張機能になります。

## 使い方

事前にsettings.jsonへ表示させたいコマンドを設定し、
ショートカットキー(初期値: **Ctrl + Shift + T**)を押すと、
コマンドの一覧と割り当たっているショートカットキーが一覧表示されます。

表示されたコマンドを選択すると、そのコマンドを実行できます。

### 注意事項

- VSCodeを起動して最初の拡張機能の実行時に

## 事前設定

settings.jsonに表示させたいコマンドのIDを設定します。

コマンドIDは、

1. コマンドパレットなどで`基本設定: キーボード ショートカットを開く`を実行
2. 表示させたいコマンドを右クリック
3. `コマンド ID のコピー`をクリック

することで取得できます。

### 設定値 例

```json:settings.json
{
  // ~~~ 他の設定 ~~~
  "myshortcutviewer.myshortcuts": [
    "workbench.action.tasks.build", // タスク: ビルド タスクの実行
    "workbench.action.debug.start", // Debug: デバッグの開始
    "markdown-preview-enhanced.openPreviewToTheSide", // Markdown: Markdown Preview Enhanced: Open Preview to the Side
    "extension.DoxygenPreviewer", // Doxygen Previewer
  ]
}
```
