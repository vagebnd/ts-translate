import Finder from '/@/classes/finder'
import Config from '/@/classes/config'

import { join } from 'path'

const settings = require(join(process.cwd(), 'tests/data/.vue-translations.js'))
const config = new Config(settings)
const finder = new Finder(config)

test('it has loaded the config file', () => {
  expect(finder.config.glob).toContain('**/*.{vue,ts,js}')
  expect(finder.config.sourceFolder).toContain('/vue-translations-helper/tests/data')
  expect(finder.config.supportedLanguages).toEqual(['en', 'ru'])
})

test('it returns an array of translatable strings', () => {
  expect(finder.getTranslatableStrings()).toEqual([
    'Vue test translations string',
    'Second translation',
    'Third translation',
    'JS test translations string',
    'TS test translations string.',
  ])
})
