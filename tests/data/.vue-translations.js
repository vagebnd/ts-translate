const { resolve, join } = require('path')
const { JsonAdapter } = require('/@/classes/json-adapter')

module.exports = {
  extensions: ['vue', '.ts', 'js'],
  sourceFolder: resolve(__dirname),
  languages: ['en', 'ru'],
  functions: ['$t', '$tc'],
  adapter: new JsonAdapter({ path: join(__dirname, './translations') }),
}
