'use strict'
const assetImgLib = require('./asset_img')
const assetPathLib = require('./asset_path')
const blockquoteLib = require('./blockquote')

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

  register(['asset_img', 'assetImg'], assetImgLib(config), false)
  register(['asset_path', 'assetPath'], assetPathLib(config), false)
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
