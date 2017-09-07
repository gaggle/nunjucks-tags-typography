'use strict'
const Url = require('domurl')

const ROOT_URL = 'https://gist-it.appspot.com'

/**
 * gistit tag
 *
 * Syntax:
 *
 *     {% gistit account repo path [start:end] %}
 */
module.exports = function () {
  return function (args) {
    const account = args.shift()
    const repo = args.shift()
    const path = args.shift()

    if (!account || !repo || !path) throw new Error('foo')

    let slice = args.shift()
    const url = new Url(ROOT_URL)
    url.paths(['github', account, repo, path])

    if (slice) {
      url.query.slice = slice
    }

    const cleanedUrl = url.toString().replace(/%3A/g, ':').replace(/%2F/g, '/')
    return '<script src="' + cleanedUrl + '"></script>'
  }
}
