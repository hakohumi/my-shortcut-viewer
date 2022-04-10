// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { promises as fs } from 'fs'
import * as vscode from 'vscode'
import { QuickPickItem } from 'vscode'

export async function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "myshortcutviewer" is now active!'
  )

  // 使用できるコマンド一覧を取得する
  const getCommands = await vscode.commands.getCommands()

  let disposable = vscode.commands.registerCommand(
    'myshortcutviewer.helloWorld',
    async () => {
      // settings.jsonから表示させたいコマンドを取得する
      const settingskeybindings = async () => {
        const config = await vscode.workspace.getConfiguration(
          'myshortcutviewer'
        )
        const shortcuts = config.get('myshortcut') as string[]

        return shortcuts
      }

      const myKeybindings = await parseKeybindingsJson()

      const items = (await settingskeybindings()).map(
        (myCommand): QuickPickItem => {
          const hasMyCommand = myKeybindings.find(
            (myKeybinding) => myKeybinding.command === myCommand
          )

          if (hasMyCommand === undefined) {
            // TODO: 既定のショートカットキーの場合、エラーとなる
            // TODO既定のショートカットを取得できる方法を探す

            throw Error(`find not ${myCommand} command in myKeybindings`)
          }

          return {
            label: myCommand,
            description: `${hasMyCommand.key}`,
          }
        }
      )

      vscode.window
        .showQuickPick(items, {
          matchOnDescription: true,
          placeHolder: '選択したコマンドを実行します。',
        })
        .then((item) => {
          if (item === undefined) {
            return
          }

          console.log(`selected ${item.label}`)
          vscode.window.showInformationMessage(`selected ${item.label}`)

          const command = getCommands.find((it) => it === item.label)

          if (command === undefined) {
            console.log(`find not command => ${item.label}`)
            return
          }

          vscode.commands.executeCommand(item.label)
        })

      // callback end
    }
  )

  context.subscriptions.push(disposable)
}

export function deactivate() {}

class KeybindingsJson {
  constructor(
    readonly command: string,
    readonly key: string,
    readonly when?: string
  ) {}

  toString() {
    return `key: ${this.key} command: ${this.command} when: ${this.when}\n`
  }
}

async function parseKeybindingsJson() {
  const userHome =
    process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']
  if (userHome === undefined) {
    throw Error('not env user home path')
  }

  const readedKeybindingsJsonFile = await fs
    .readFile(`${userHome}\\AppData\\Roaming\\Code\\User\\keybindings.json`, {
      encoding: 'utf-8',
    })
    .catch(() => {
      throw Error('error not found keybinds.json')
    })

  const lineString = readedKeybindingsJsonFile.split('\n')

  const processedJsonString = lineString.filter((it) => {
    return it.indexOf('//') === -1
  })

  const preProcessedJsonString = processedJsonString.join('\n')

  const keybindingsJson = (
    JSON.parse(preProcessedJsonString) as KeybindingsJson[]
  )
    .filter((it) => it.command.slice(0, 1) !== '-')
    .map((it) => new KeybindingsJson(it.command, it.key, it.when))

  return keybindingsJson
}
