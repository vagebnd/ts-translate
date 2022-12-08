import { existsSync } from 'fs'
import { join } from 'path'
import Config from '/@/classes/config'
import Translator from '/@/classes/translator'
import promps from 'prompts'

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

      const displayOutput = Object.entries(this.config).map(([key, value]) => {
        return { key, value }
      })

      console.table(displayOutput)
    } else {
      this.config = new Config(require(configPath))
    }
  }

  public static async run() {
    const instance = new this()

    let language = instance.config.defaultLanguage

    if (instance.config.supportedLanguages.length > 1) {
      const selectedLanguage = await promps({
        type: 'select',
        name: 'value',
        message: 'Please select a language',
        choices: instance.config.supportedLanguages.map((lang) => {
          return {
            title: lang,
            value: lang,
          }
        }),
      })

      language = selectedLanguage.value
    }

    const translator = new Translator(instance.config, language)
    await translator.translate()

    console.log(`Finished translating language: "${language}"`)
  }
}

Main.run()
