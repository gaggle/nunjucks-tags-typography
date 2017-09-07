'use strict'
const Url = require('domurl')

const ROOT_URL = 'https://gist-it.appspot.com'
const rSlice = /(\w+):(\w+)/i
const rOpts = /(\w+)=(.*)/i

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

    const rest = args.join(' ')

    let slice
    let opts = {}

    if (rSlice.test(rest)) {
      let match = rest.match(rSlice)
      slice = `${match[1]}:${match[2]}`
    }

    if (rOpts.test(rest)) {
      let match = rest.match(rOpts)
      opts[match[1]] = match[2]
    }

    const url = new Url(ROOT_URL)
    url.paths(['github', account, repo, path])

    if (slice) {
      url.query.slice = slice
    }
    if (opts) {
      Object.keys(opts).forEach(key => {
        url.query[key] = opts[key]
      })
    }

    const cleanedUrl = url.toString().replace(/%3A/g, ':').replace(/%2F/g, '/')
    return '<script src="' + cleanedUrl + '"></script>'
  }
}
