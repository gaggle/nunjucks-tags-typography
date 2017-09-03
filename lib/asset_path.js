'use strict'
/**
 * @module asset_path
 */
const url = require('url')

/**
 * Asset path tag
 *
 * Syntax:
 *
 *     {% asset_path slug %}
 *
 * @param {Object} [config]
 * @param {Function} [config.asset] Function to convert slug to path.
 *                                  Default just returns slug.
 * @param {string} [config.root] String to prefix path
 * @returns {nunjucksCustomTag}
 */
module.exports = function (config) {
  config.asset = config.asset || function (p) {
    return p
  }
  config.root = config.root || ''

  return function assetPathTag (args) {
    const slug = args.shift()
    if (!slug) return

    const asset = config.asset(slug)
    if (!asset) return

    return url.resolve(config.root, asset)
  }
}
