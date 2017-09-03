'use strict'
const blockquoteLib = require('./blockquote')

/**
 * @param {module:nunjucks-tags} nunjucks Nunjucks Tags instance
 * @param {Object} [config]
 * @param {boolean} [config.titlecase]
 * @returns {Object.<string, nunjucksTag>}
 */
module.exports = function (nunjucks, config = {}) {
  nunjucks.register('quote', blockquoteLib(config), true)
  nunjucks.register('blockquote', blockquoteLib(config), true)

  return {
    quote: blockquoteLib,
    blockquote: blockquoteLib
  }
}

/**
 * @function nunjucksTag
 * @param {string[]} args
 * @param {string} content
 */
