'use strict'
const common = require('./common')

/**
 * Pullquote tag
 *
 * Syntax:
 *
 *     {% pullquote [class] %}
 *     Quote string
 *     {% endpullquote %}
 */
module.exports = function () {
  return function pullquoteTag (args, content) {
    let result = ''

    args.unshift('pullquote')

    result += '<blockquote class="' + args.join(' ') + '">'
    result += common.paragraphWrap(content)
    result += '</blockquote>'

    return result
  }
}
