'use strict'
// Based on: https://raw.github.com/imathis/octopress/master/plugins/code_block.rb

const merge = require('lodash.merge')
const stripIndent = require('strip-indent')

const highlight = require('./highlight-wrapper.js')

const rAutoDetect = /\s*auto_detect:(\w+)/i
const rCaption = /(\S[\S\s]*)/
const rCaptionUrl = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)/i
const rCaptionUrlTitle = /(\S[\S\s]*)\s+(https?:\/\/)(\S+)\s+(.+)/i
const rFirstLine = /\s*first_line:(\d+)/i
const rLang = /\s*lang:(\w+)/i
const rLineNumber = /\s*line_number:(\w+)/i
const rMark = /\s*mark:([0-9,-]+)/i
const rTabReplace = /\s*tab_replace:([0-9,-,true,false]+)/i

/**
 * Code block tag
 *
 * Syntax:
 *
 *     {% code [title] [lang:language] [url] [link text] [line_number:(true|false)] [first_line:number] [mark:#,#-#] %}
 *     code snippet
 *     {% endcode %}
 *
 * @param {Object} [config]
 * @param {Object} [config.highlight]
 * @param {Boolean|Int} [config.highlight.tabReplace]
 */
module.exports = function (config) {
  config = merge({
    highlight: {
      autoDetect: undefined,
      tabReplace: undefined,
      tabReplaceChar: undefined
    }
  }, config)

  return function codeTag (rawArgs, content) {
    const args = parseArgs(rawArgs)

    content = stripIndent(content)

    const options = {
      autoDetect: args.autoDetect || config.highlight.autoDetect || false,
      caption: args.caption,
      firstLine: parseInt(args.firstLine, 10) || 1,
      gutter: args.lineNumber || !!args.firstLine || false,
      lang: args.lang,
      mark: args.mark || [],
      tab: args.tabReplace || config.highlight.tabReplace || false,
      tabChar: config.highlight.tabReplaceChar || ' '
    }
    if (options.tab === true) {
      options.tab = 2
    }

    const data = highlight(content, options)

    const lines = data.value.split('\n')
    let numbers = ''
    let tempContent = ''
    let result = ''

    let i = 0
    const len = lines.length
    for (; i < len; i++) {
      let line = lines[i]
      if (options.tab) {
        line = replaceTabs(lines[i], options.tabChar.repeat(options.tab))
      }

      numbers += '<span class="line">' + (options.firstLine + i) + '</span><br>'
      tempContent += '<span class="line'
      tempContent += (options.mark.indexOf(options.firstLine + i) !== -1) ? ' marked' : ''
      tempContent += '">' + line + '</span><br>'
    }

    result += '<figure class="highlight ' + data.language + '">'

    if (options.caption) {
      result += '<figcaption>' + options.caption + '</figcaption>'
    }

    result += '<table><tr>'

    if (options.gutter) {
      result += '<td class="gutter"><pre>' + numbers + '</pre></td>'
    }

    result += '<td class="code"><pre>' + tempContent + '</pre></td>'
    result += '</tr></table></figure>'

    result = result
      .replace(/{/g, '&#123;')
      .replace(/}/g, '&#125;')

    return result
  }
}

const getMarkedLines = function (prev, cur) {
  if (/-/.test(cur)) {
    let [a, b] = minBeforeMax(...sliceString(cur, cur.indexOf('-')))
    for (; a <= b; a++) prev.push(a)
    return prev
  }
  prev.push(Number(cur))
  return prev
}

const minBeforeMax = function (num1, num2) {
  let a, b
  a = Number(num1)
  b = Number(num2)
  if (b < a) { // switch a & b
    let temp = a
    a = b
    b = temp
  }
  return [a, b]
}

const parseArgs = function (rawArgs) {
  let arg = rawArgs.join(' ')

  const args = {
    autoDetect: undefined,
    caption: undefined,
    firstLine: undefined,
    lang: undefined,
    lineNumber: undefined,
    mark: undefined,
    tabReplace: undefined,
    match: undefined
  }

  if (rAutoDetect.test(arg)) {
    arg = arg.replace(rAutoDetect, function () {
      args.autoDetect = arguments[1] === 'true'
      return ''
    })
  }

  if (rFirstLine.test(arg)) {
    arg = arg.replace(rFirstLine, function () {
      args.firstLine = arguments[1]
      return ''
    })
  }

  if (rLang.test(arg)) {
    arg = arg.replace(rLang, function () {
      args.lang = arguments[1]
      return ''
    })
  }

  if (rLineNumber.test(arg)) {
    arg = arg.replace(rLineNumber, function () {
      args.lineNumber = arguments[1] === 'true'
      return ''
    })
  }

  if (rMark.test(arg)) {
    arg = arg.replace(rMark, function () {
      args.mark = arguments[1]
        .split(',')
        .reduce(getMarkedLines, [])
      return ''
    })
  }

  if (rTabReplace.test(arg)) {
    arg = arg.replace(rTabReplace, function () {
      let val = arguments[1]
      args.tabReplace = parseInt(val, 10) || val === 'true'
      return ''
    })
  }

  if (rCaptionUrlTitle.test(arg)) {
    args.match = arg.match(rCaptionUrlTitle)
    args.caption = '<span>' + args.match[1] + '</span><a href="' + args.match[2] + args.match[3] + '">' + args.match[4] + '</a>'
  } else if (rCaptionUrl.test(arg)) {
    args.match = arg.match(rCaptionUrl)
    args.caption = '<span>' + args.match[1] + '</span><a href="' + args.match[2] + args.match[3] + '">link</a>'
  } else if (rCaption.test(arg)) {
    args.match = arg.match(rCaption)
    args.caption = '<span>' + args.match[1] + '</span>'
  }
  return args
}

const sliceString = function (str, index) {
  return [str.substr(0, index), str.substr(index + 1)]
}

function replaceTabs (str, tab) {
  return str.replace(/^\t+/, function (match) {
    let result = ''

    let i = 0
    const len = match.length
    for (; i < len; i++) {
      result += tab
    }

    return result
  })
}
