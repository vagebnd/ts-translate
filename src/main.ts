import { existsSync } from 'fs'
import inquirer from 'inquirer'
import { join } from 'path'
import Config from '/@/classes/config'
import Translator from '/@/classes/translator'

class Main {
  private config!: Config

  private constructor() {
    this.loadConfig()
  }

  private loadConfig() {
    const configPath = join(process.cwd(), '.vue-translations.js')

    if (!existsSync(configPath)) {
      this.config = new Config()
      console.log('No config file found, using defaults')
      console.table(this.config.defaultOptions)
    } else {
      this.config = new Config(require(configPath))
    }
  }

  public static async run() {
    const instance = new this()
    let language = instance.config.defaultLanguage

    if (instance.config.supportedLanguages.length > 1) {
      const choice = await inquirer.prompt([
        {
          type: 'list',
          name: 'language',
          message: 'Please select a language',
          choices: instance.config.supportedLanguages,
          default: instance.config.defaultLanguage,
        },
      ])

      language = choice.language
    }

    const translator = new Translator(instance.config, language)
    await translator.translate()

    console.log(`Done translating the language: "${language}"`)
  }
}

Main.run()
