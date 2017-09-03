'use strict'
// Based on: https://raw.github.com/imathis/octopress/master/plugins/blockquote.rb

const titlecase = require('titlecase')

const rFullCiteWithTitle = /(\S.*)\s+(https?:\/\/)(\S+)\s+(.+)/i
const rFullCite = /(\S.*)\s+(https?:\/\/)(\S+)/i
const rAuthorTitle = /([^,]+),\s*([^,]+)/
const rAuthor = /(.+)/

/**
 * Blockquote tag
 *
 * Syntax:
 *
 *     {% blockquote [author[, source]] [link] [source_link_title] %}
 *     Quote string
 *     {% endblockquote %}
 *
 * @param {Object} [config]
 * @param {boolean} [config.titlecase]
 * @returns {nunjucksCustomTag}
 */
module.exports = function (config) {
  return function blockquoteTag (args, content) {
    let footer = ''
    let result = ''

    const [author, source, title] = parseArgs(args, config)

    if (author) {
      footer += '<strong>' + author + '</strong>'
    }

    if (source) {
      const link = source.replace(/^https?:\/\/|\/(index.html?)?$/g, '')
      footer += '<cite><a href="' + source + '">' + (title || link) + '</a></cite>'
    } else if (title) {
      footer += '<cite>' + title + '</cite>'
    }

    result += '<blockquote>'
    result += '<p>' + content + '</p>'
    if (footer) {
      result += '<footer>' + footer + '</footer>'
    }
    result += '</blockquote>'

    return result
  }
}

const parseArgs = function (args, config) {
  let str = args.join(' ')

  let author
  let source
  let title

  if (str) {
    if (rFullCiteWithTitle.test(str)) {
      const match = str.match(rFullCiteWithTitle)
      author = match[1]
      source = match[2] + match[3]
      title = config.titlecase ? titlecase(match[4]) : match[4]
    } else if (rFullCite.test(str)) {
      const match = str.match(rFullCite)
      author = match[1]
      source = match[2] + match[3]
    } else if (rAuthorTitle.test(str)) {
      const match = str.match(rAuthorTitle)
      author = match[1]
      title = config.titlecase ? titlecase(match[2]) : match[2]
    } else {
      const match = str.match(rAuthor)
      author = match[1]
    }
  }
  return [author, source, title]
}
