import Config from './config'
import Finder from '/@/classes/finder'
import prompts, { PromptObject } from 'prompts'

class Translator {
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
    const questions = this.listUntranslatedKeys().map((key) => {
      return {
        type: 'text',
        name: key,
        message: `Please translate: "${key}"`,
        initial: key,
      } as PromptObject
    })

    const answers: Record<string, string> = await prompts(questions)

    if (this.config.saveOutput) {
      this.config.adapter.write(this.language, answers)
    }

    return answers
  }
}

export default Translator
