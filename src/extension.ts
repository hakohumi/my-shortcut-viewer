// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { promises as fs } from 'fs'
import * as vscode from 'vscode'
import { QuickPickItem } from 'vscode'

export async function activate(context: vscode.ExtensionContext) {
  console.log('"myshortcutviewer" is start')

  const defaultKeybindingsJson = await vscode.commands
    .executeCommand('workbench.action.openDefaultKeybindingsFile')
    .then(async () => {
      await vscode.commands.executeCommand('editor.action.selectAll')
      await vscode.commands.executeCommand('editor.action.clipboardCopyAction')
      await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
      return await vscode.env.clipboard.readText()
    })
  const defaultKeybindings = await parseKeybindingsJson(defaultKeybindingsJson)

  // 使用できるコマンド一覧を取得する
  const getAllCommandsOfVSCode = await vscode.commands.getCommands()

  let disposable = vscode.commands.registerCommand(
    'myshortcutviewer.showShortcut',
    async () => {
      // settings.jsonから表示させたいコマンドを取得する
      const settingskeybindings = async () => {
        const config = await vscode.workspace.getConfiguration(
          'myshortcutviewer'
        )
        const shortcuts = config.get('myshortcuts') as string[]

        return shortcuts
      }

      const userHome =
        process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME']
      if (userHome === undefined) {
        throw Error('not env user home path')
      }

      const readedKeybindingsJsonFile = await fs
        .readFile(
          `${userHome}\\AppData\\Roaming\\Code\\User\\keybindings.json`,
          {
            encoding: 'utf-8',
          }
        )
        .catch(() => {
          throw Error('error not found keybinds.json')
        })

      const myKeybindings = await parseKeybindingsJson(
        readedKeybindingsJsonFile
      )

      const items = (await settingskeybindings()).map(
        (myCommand): QuickPickItem => {
          const description = myKeybindings.find(
            (myKeybinding) => myKeybinding.command === myCommand
          )

          const description2 = defaultKeybindings.find((defaultKeybinding) => {
            return defaultKeybinding.command === myCommand
          })

          if (description === undefined && description2 === undefined) {
            throw Error(`find not ${myCommand} command in Keybindings`)
          }

          const searchedCommand = getAllCommandsOfVSCode.find(
            (it) => it === myCommand
          )

          if (searchedCommand === undefined) {
            throw Error(
              `find not ${myCommand} command in all commands of VSCode`
            )
          }

          return {
            label: myCommand,
            description: `${description?.key ?? description2!.key}`,
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

async function parseKeybindingsJson(readedKeybindingsJsonFile: string) {
  const lineString = readedKeybindingsJsonFile.split('\n')

  const processedJsonString = lineString.filter((it) => {
    return it.slice(0, 2) !== '//'
  })

  const preProcessedJsonString = processedJsonString.join('')

  vscode.env.clipboard.writeText(preProcessedJsonString)

  const keybindingsJson = (
    JSON.parse(preProcessedJsonString) as KeybindingsJson[]
  )
    .filter((it) => it.command.slice(0, 1) !== '-')
    .map((it) => new KeybindingsJson(it.command, it.key, it.when))

  return keybindingsJson
}
