'use strict'
const url = require('url')
const path = require('path')

/**
 * Asset image tag
 *
 * Syntax:
 *   {% asset_img slug [title]%}
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

  return function assetImgTag (args) {
    let slug = args.shift()
    if (!slug) return

    const asset = config.asset(slug)
    if (!asset) return

    const src = url.resolve(config.root, asset)
    const title = args.length ? args.join(' ') : ''
    return `<img src="${src}" alt="${(title || path.basename(asset))}" title="${title}"/>`
  }
}
