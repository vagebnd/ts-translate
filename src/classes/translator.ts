import Config from './config'
import Finder from '/@/classes/finder'
import inquirer from 'inquirer'

class Translator {
  private readonly dotReplacer: string = '__DOT__'
  private config: Config
  private language: string

  public constructor(config: Config, language: string) {
    this.config = config
    this.language = language
  }

  public listUntranslatedKeys() {
    const finder = new Finder(this.config)
    const currentTranslations = this.config.adapter.read(this.language)

    return finder
      .getTranslatableStrings()
      .filter((key) => {
        return !Object.keys(currentTranslations).includes(key as string)
      })
      .sort()
  }

  public async translate() {
    const prompts = this.listUntranslatedKeys().map((key) => {
      return {
        type: 'input',
        name: this.replaceTailingDot(key), // make sure that tailing dot isn't converted to object
        message: `Please translate: "${key}"`,
        default: key,
      }
    })

    const answers: Record<string, any> = await inquirer.prompt(prompts)
    this.config.adapter.write(this.language, this.restoreTailingDots(answers))
    return answers
  }

  private replaceTailingDot(key: string) {
    if (key.endsWith('.')) {
      return key.replace('.', this.dotReplacer)
    }

    return key
  }

  private restoreTailingDots(answers: Record<string, any>) {
    Object.entries(answers).forEach(([key, value]) => {
      if (key.endsWith(this.dotReplacer)) {
        const newKey = key.replace(this.dotReplacer, '.')
        delete Object.assign(answers, { [newKey]: value })[key]
      }
    })

    return answers
  }
}

export default Translator
