'use strict'
const blockquoteLib = require('./blockquote')
const assetImgLib = require('./asset_img')

/**
 * @param {module:nunjucks-tags} nunjucks Nunjucks Tags instance
 * @param {Object} [config]
 * @param {boolean} [config.titlecase]
 * @param {Function} [config.asset] Function to convert slug to path.
 *                                  Default just returns slug.
 * @param {string} [config.root] String to prefix path
 * @returns {Object.<string, nunjucksTag>}
 */
module.exports = function (nunjucks, config = {}) {
  const register = (names, fn, options) => {
    names.forEach(name => nunjucks.register(name, fn, options))
  }

  register(['quote', 'blockquote'], blockquoteLib(config), true)
  register(['asset_img', 'assetImg'], assetImgLib(config), false)

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
