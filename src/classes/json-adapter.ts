import { AdapterInterface } from '/@/types/adapter'
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'fs'
import { join } from 'path'

export class JsonAdapter implements AdapterInterface {
  private path: string

  public constructor(config: { path: string }) {
    this.path = config.path
  }

  public read(language: string) {
    if (!existsSync(this.path)) {
      mkdirSync(this.path)
    }

    const languagePath = this.getLanguagePath(language)

    if (!existsSync(languagePath)) {
      writeFileSync(languagePath, '{}', 'utf-8')
    }

    return JSON.parse(readFileSync(languagePath, 'utf-8'))
  }

  public write(language: string, translations: Record<string, string> = {}, override: boolean = false) {
    const currentTranslations = !override //
      ? this.read(language)
      : {}

    writeFileSync(
      this.getLanguagePath(language),
      JSON.stringify(Object.assign(currentTranslations, translations), null, 2),
      'utf-8',
    )
  }

  public getLanguagePath(language: string) {
    return join(this.path, `${language}.json`)
  }
}
