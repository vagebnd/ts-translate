import Config from '/@/classes/config'
import { join } from 'path'

test('it creates a predefined config instance without a config file', () => {
  const config = new Config()
  expect(config).toBeDefined()
  expect(config.glob).toContain('**/*.{ts,vue,js,html}')
  expect(config.supportedLanguages).toEqual(['en'])
})

test('it correctly removes leading dots from extensions', () => {
  const config = new Config({ extensions: ['.vue'] })
  expect(config.glob).toContain('**/*.{vue}')
})

test('it returns a list of all translatable files', () => {
  const config = new Config(require(join(process.cwd(), 'tests/data/.vue-translations.js')))

  expect(config.listTranslatableFiles()).toBeInstanceOf(Array)
  expect(config.listTranslatableFiles().toString()).toContain('component-without-translations.vue')
  expect(config.listTranslatableFiles().toString()).toContain('component.vue')
  expect(config.listTranslatableFiles().toString()).toContain('test.ts')
  expect(config.listTranslatableFiles().toString()).toContain('test.js')
})
