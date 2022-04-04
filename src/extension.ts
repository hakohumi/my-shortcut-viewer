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

  const getCommands = vscode.commands.getCommands().then((v) => {
    const row = v.filter((it) => it.indexOf('keybindings') !== -1)

    //   row.map((it, index) => `${index}: ${it}`).join('\n')
    // )
    // vscode.window.showInformationMessage(row.length.toString())

    row.forEach((it) => console.log(it))
    return row
  })

  const keybindings = await parseKeybindingsJson()

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'myshortcutviewer.helloWorld',
    () => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user

      // const items = getCommands.then((it) =>
      //   it.map((it): QuickPickItem => {
      //     return { label: it, description: '' }
      //   })
      // )
      const items = keybindings.map((it): QuickPickItem => {
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

          const command = keybindings
            .map((it) => it.command)
            .find((it) => it === item.label)

          console.log(`find command => ${command}`)

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
    readonly key: string,
    readonly command: string,
    readonly when?: string
  ) {}

  toString() {
    return `key: ${this.key} command: ${this.command} when: ${this.when}\n`
  }
}

async function parseKeybindingsJson() {
  const readedKeybindingsJsonFile = await fs.readFile(
    // '%userprofile%\\AppData\\Roaming\\Code\\User\\keybindings.json',
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
