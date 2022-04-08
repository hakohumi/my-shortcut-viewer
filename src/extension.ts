// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { promises as fs } from 'fs'
import * as vscode from 'vscode'
import { QuickPickItem } from 'vscode'

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "myshortcutviewer" is now active!'
  )

  const getCommands = await vscode.commands.getCommands()

  // const keybindings = await parseKeybindingsJson()

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'myshortcutviewer.helloWorld',
    async () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      const settingskeybindings = await parseKeybindingsFromSettingJson()

      const items = settingskeybindings.map((it): QuickPickItem => {
        return {
          label: it.command,
          description: `${it.key}`,
        }
      })

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

          console.log(`pre ${typeof command}`)

          vscode.commands.executeCommand(item.label)
        })

      // callback end
    }
  )

  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
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
  const readedKeybindingsJsonFile = await fs.readFile(
    // '%userprofile%\\AppData\\Roaming\\Code\\User\\keybindings.json',
    // TODO: 個々の環境に依存している
    'C:\\Users\\Filu\\AppData\\Roaming\\Code\\User\\keybindings.json',
    { encoding: 'utf-8' }
  )

  const lineString = readedKeybindingsJsonFile.split('\n')

  const processedJsonString = lineString.filter((it) => {
    return it.indexOf('//') === -1
  })

  const preProcessedJsonString = processedJsonString.join('\n')

  const keybindingsJson = (
    JSON.parse(preProcessedJsonString) as KeybindingsJson[]
  )
    .filter((it) => it.command.slice(0, 1) !== '-')
    .map((it) => new KeybindingsJson(it.key, it.command, it.when))

  return keybindingsJson
}

async function parseKeybindingsFromSettingJson() {
  const config = await vscode.workspace.getConfiguration('myshortcutviewer')
  const shortcuts = config.get('myshortcut') as KeybindingsJson[]

  console.dir(shortcuts)

  return shortcuts
}
