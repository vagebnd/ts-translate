import { ConfigOptions } from '../types/config'
import Config from '/@/classes/config'
import { readFileSync } from 'fs'

class Finder {
  public config: Config

  public constructor(config: Config) {
    this.config = config
  }

  private get pattern() {
    const functions = this.config.functions.map((func) => '\\' + func).join('|')
    let pattern = `([FUNCTIONS])\\([\\'"](.+)[\\'"][\\),]`
    return new RegExp(pattern.replace('[FUNCTIONS]', functions), 'g')
  }

  public getTranslatableStrings() {
    const files = this.config.listTranslatableFiles()

    const translatableStrings = files
      .map((file) => readFileSync(file, 'utf-8'))
      .map((contents) => {
        const matches = [...contents.matchAll(this.pattern)]
        return matches.map((match) => match[2])
      })
      .filter((value) => value.length)
      .flat(1)

    return [...new Set(translatableStrings)]
  }
}

export default Finder
