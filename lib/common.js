'use strict'

/**
 * Extract matching value group from str if regex matches.
 *
 * Note: Regex should probably end with `(\w+)` to grab the next word,
 * e.g. `/\s*foo:(\w+)/i`
 *
 * @param {RegExp} regex
 * @param {string} str
 * @returns {string, string}
 */
exports.extract = function (regex, str) {
  /**
   * @type {string}
   */
  let extracted

  if (regex.test(str)) {
    str = str.replace(regex, function () {
      extracted = arguments[1]
      return ''
    })
  }
  if (extracted === 'true') extracted = true
  if (extracted === 'false') extracted = false
  return [extracted, str]
}

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
