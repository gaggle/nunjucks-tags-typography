"use strict";
// Based on: https://raw.github.com/imathis/octopress/master/plugins/blockquote.rb

const titlecase = require("titlecase")

const rFullCiteWithTitle = /(\S.*)\s+(https?:\/\/)(\S+)\s+(.+)/i
const rFullCite = /(\S.*)\s+(https?:\/\/)(\S+)/i
const rAuthorTitle = /([^,]+),\s*([^,]+)/
const rAuthor = /(.+)/

/**
 * Blockquote tag
 *
 * Syntax:
 *   {% blockquote [author[, source]] [link] [source_link_title] %}
 *   Quote string
 *   {% endblockquote %}
 *
 * @param {Object} [config]
 * @param {boolean} [config.titlecase]
 * @returns {nunjucksCustomTag}
 */
module.exports = function (config) {
  return function blockquoteTag(args, content) {
    let str = args.join(" ")
    let author = ""
    let source = ""
    let title = ""
    let footer = ""
    let result = ""
    let match

    if (str) {
      if (rFullCiteWithTitle.test(str)) {
        match = str.match(rFullCiteWithTitle)
        author = match[1]
        source = match[2] + match[3]
        title = config.titlecase ? titlecase(match[4]) : match[4]
      } else if (rFullCite.test(str)) {
        match = str.match(rFullCite)
        author = match[1]
        source = match[2] + match[3]
      } else if (rAuthorTitle.test(str)) {
        match = str.match(rAuthorTitle)
        author = match[1]
        title = config.titlecase ? titlecase(match[2]) : match[2]
      } else {
        match = str.match(rAuthor)
        author = match[1]
      }

      footer += "<strong>" + author + "</strong>"

      if (source) {
        let link = source.replace(/^https?:\/\/|\/(index.html?)?$/g, "")
        footer += "<cite><a href=\"" + source + "\">" + (title ? title : link) + "</a></cite>"
      } else if (title) {
        footer += "<cite>" + title + "</cite>"
      }
    }

    result += "<blockquote>"
    result += "<p>" + content + "</p>"
    if (footer) result += "<footer>" + footer + "</footer>"
    result += "</blockquote>"

    return result
  }
}
