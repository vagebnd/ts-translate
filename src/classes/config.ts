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

  public saveOutput: boolean

  public constructor(options: ConfigOptions = {}) {
    const settings = Object.assign(this.defaultOptions, options)

    this.extensions = settings.extensions
    this.languages = settings.languages
    this.sourceFolder = settings.sourceFolder
    this.functions = settings.functions
    this.adapter = settings.adapter
    this.saveOutput = settings.saveOutput
  }

  public get defaultOptions() {
    return {
      extensions: ['ts', 'vue', 'js', 'html'],
      languages: ['en'],
      sourceFolder: join(process.cwd(), 'src'),
      functions: ['$t', '$tc', '$i18n.t'],
      adapter: new JsonAdapter({ path: join(process.cwd(), 'src/locales') }),
      saveOutput: true,
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
