'use strict'

/**
 * Wrap content in paragraph when appropriate
 *
 * If there is no content, or content is a tag, then do nothing.
 *
 * @param {String} content
 * @returns {String}
 */
exports.paragraphWrap = function (content) {
  if (!content) return content
  if (content.startsWith('<')) return content
  return '<p>' + content + '</p>'
}
