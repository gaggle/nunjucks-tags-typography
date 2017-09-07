'use strict'

/**
 * Github gist tag
 *
 * Syntax:
 *
 *     {% github_gist gist_id [filename] %}
 */
module.exports = function () {
  return function (args) {
    const id = args.shift()
    const file = args.length ? '?file=' + args[0] : ''

    return '<script src="//gist.github.com/' + id + '.js' + file + '"></script>'
  }
}
