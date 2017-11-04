'use strict'
const Entities = require('html-entities').XmlEntities
const hljs = require('highlight.js')
const merge = require('lodash.merge')

const entities = new Entities()

/**
 *
 * @param {string} str
 * @param {Object} [options]
 * @returns {Object}
 */
module.exports = function (str, options) {
  options = merge({
    autoDetect: false,
    lang: undefined
  }, options)

  let lang = options.lang
  if (!lang && options.autoDetect) {
    const result = hljs.highlightAuto(str)
    if (result.relevance > 0 && result.language) {
      lang = result.language
    }
  }
  if (!lang) {
    lang = 'plain'
  }

  const result = {
    value: encodePlainString(str),
    language: lang.toLowerCase()
  }

  if (result.language === 'plain' || !tryLanguage(result.language)) {
    result.language = 'plain'
    return result
  }

  const actualResult = highlight(str, result.language) || result

  return {
    value: actualResult.value,
    language: actualResult.language || result.language
  }
}

function encodePlainString (str) {
  return entities.encode(str)
}

const tryLanguage = function (lang) {
  return !!hljs.getLanguage(lang)
}

const highlight = function (str, lang) {
  const lines = str.split('\n')
  let result = hljs.highlight(lang, lines.shift())

  let html = result.value
  while (lines.length > 0) {
    result = hljs.highlight(lang, lines.shift(), false, result.top)
    html += '\n' + result.value
  }

  result.value = html
  return result
}
