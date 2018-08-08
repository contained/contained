/**
 * Contained.js
 * (c) 2018 Faruk Brbovic
 *
 * @type {module:fs}
 */

const fs = require('fs')
const path = require('path')

if (fs.existsSync(path.resolve(__dirname, '.babelrc'))) {
  module.exports = require('./src/index.js')
} else {
  module.exports = require('./dist/nuxt.js')
}