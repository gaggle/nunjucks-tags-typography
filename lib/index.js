'use strict'
const assetImgLib = require('./asset_img')
const assetPathLib = require('./asset_path')
const blockquoteLib = require('./blockquote')
const codeLib = require('./code')
const gistitLib = require('./gistit')
const githubGistLib = require('./github_gist')
const pullquoteLib = require('./pullquote')

/**
 * @param {module:nunjucks-tags} nunjucks Nunjucks Tags instance
 * @param {Object} [config]
 * @param {boolean} [config.titlecase]
 * @param {Function} [config.asset] Function to convert slug to path.
 *                                  Default just returns slug.
 * @param {string} [config.root] String to prefix path
 */
module.exports = function (nunjucks, config = {}) {
  const register = (names, fn, options) => {
    names.forEach(name => nunjucks.register(name, fn, options))
  }

  register(['asset_img', 'asset_image', 'assetImg'], assetImgLib(config))
  register(['asset_path', 'assetPath'], assetPathLib(config))
  register(['code', 'codeblock'], codeLib(config), true)
  register(['gistit', 'gist_it', 'gist-it', 'github_gist', 'github-gist'], gistitLib(config))
  register(['github_gist', 'github-gist', 'gist'], githubGistLib(config))
  register(['pullquote'], pullquoteLib(config, true), true)
  register(['quote', 'blockquote'], blockquoteLib(config), true)
}
