import fastGlob from 'fast-glob'
import { join } from 'path'
import { ConfigOptions } from '../types/config'
import { AdapterInterface } from '/@/types/adapter'
import { JsonAdapter } from './json-adapter'

class Config {
  private extensions: string[]
  private languages: string[]

  public adapter: AdapterInterface
  public sourceFolder: string
  public functions: string[]

  public constructor(options: ConfigOptions = {}) {
    const defaults = Object.assign(this.defaultOptions, options)

    this.extensions = defaults.extensions
    this.languages = defaults.languages
    this.sourceFolder = defaults.sourceFolder
    this.functions = defaults.functions
    this.adapter = defaults.adapter
  }

  public get defaultOptions() {
    return {
      extensions: ['ts', 'vue', 'js', 'html'],
      languages: ['en'],
      sourceFolder: join(process.cwd(), 'src'),
      functions: ['$t', '$tc', '$i18n.t'],
      adapter: new JsonAdapter({ path: join(process.cwd(), 'src/locales') }),
    }
  }

  public get glob() {
    return join(
      this.sourceFolder,
      `**/*.{${this.extensions.map((extension) => extension.replace(/^\./, '')).join(',')}}`,
    )
  }

  public get supportedLanguages() {
    return this.languages
  }

  public get defaultLanguage() {
    return this.languages?.[0]
  }

  public listTranslatableFiles() {
    return fastGlob.sync(this.glob)
  }
}

export default Config
