jest.mock('inquirer')

const { prompt, expectPrompts } = require('inquirer')

import Translator from '/@/classes/translator'
import Config from '/@/classes/config'
import Finder from '/@/classes/finder'

import { join } from 'path'

const settings = require(join(process.cwd(), 'tests/data/.vue-translations.js'))
const config = new Config(settings)
const finder = new Finder(config)

test('it translates all keys per language', () => {
  config.supportedLanguages.forEach(async (language) => {
    const translator = new Translator(config, language)
    const previousTranslations = config.adapter.read(language)

    const untranslatedKeys = translator.listUntranslatedKeys()
    const expectedPrompts = untranslatedKeys.map((key) => {
      return {
        message: `Please translate: "${key}"`,
        input: key,
      }
    })

    expectPrompts(expectedPrompts)

    const answers = await translator.translate()
    const expectedAnswers: Record<string, string> = {}

    untranslatedKeys.forEach((key) => {
      if (key) {
        expectedAnswers[key] = key
      }
    })

    expect(answers).toEqual(expectedAnswers)
    expect(Object.keys(config.adapter.read(language)).sort()).toEqual(finder.getTranslatableStrings().sort())

    config.adapter.write(language, previousTranslations, true)
  })
})
