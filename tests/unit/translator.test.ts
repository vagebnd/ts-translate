import Translator from '/@/classes/translator'
import Config from '/@/classes/config'

import { join } from 'path'
import prompts from 'prompts'

const settings = require(join(process.cwd(), 'tests/data/.vue-translations.js'))
const config = new Config({ ...settings, saveOutput: false})

test('it lists all untranslated keys', () => {
  const translator = new Translator(config, 'en')

  expect(translator.listUntranslatedKeys()).toEqual([
    'JS test translations string',
    'Second translation',
    'TS test translations string. (which includes dots)..',
    'Third translation',
    'another translation on the same line'
  ])
})

test('it translates all untranslated keys', async () => {
  const translator = new Translator(config, 'en')
  const untranslatedKeys = translator.listUntranslatedKeys()

  prompts.inject(untranslatedKeys)

  const results = await translator.translate()

  expect(Object.values(results)).toEqual(untranslatedKeys)
})
