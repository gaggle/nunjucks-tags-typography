'use strict'
const blockquoteLib = require('./blockquote')

/**
 * @param {module:nunjucks-tags} nunjucks Nunjucks Tags instance
 * @param {Object} [config]
 * @param {boolean} [config.titlecase]
 * @returns {Object.<string, nunjucksTag>}
 */
module.exports = function (nunjucks, config = {}) {
  const register = (names, fn, options) => {
    names.forEach(name => nunjucks.register(name, fn, options))
  }

  register(['quote', 'blockquote'], blockquoteLib(config), true)

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
