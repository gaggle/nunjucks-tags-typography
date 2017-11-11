/* global describe, it */
'use strict'
const assert = require('assert')
const fs = require('fs')
const isStr = require('lodash.isstring')
const path = require('path')
const recursiveReaddirSync = require('recursive-readdir-sync')
const xmldom = require('xmldom')

let DATA_CONFIG_SEARCHSTRING = 'data-config-'

/**
 * @param {str} topic Name of top-level describe block
 * @param {Object} module Rewired module
 * @param {Object.__get__} module.__get__
 * @param {str|array|Object} data
 */
exports.createRegexTestSuite = function (topic, module, data) {
  const normaliseValue = function (value) {
    if (!value || (!value.match && !value.fail)) value = {match: value}
    if (isStr(value)) value = {match: [value]}
    if (isStr(value.match)) value.match = [value.match]
    if (value.match && !value.match.forEach) value.match = [value.match]
    if (value.fail && !value.fail.forEach) value.fail = [value.fail]
    return value
  }

  exports.initCustomAsserts(assert)

  describe(topic, function () {
    Object.keys(data).forEach(function (key) {
      if (!module.hasOwnProperty('__get__')) throw new Error(`Module must support '__get__', e.g. use rewire to require the module'`)
      let value = normaliseValue(data[key])

      describe(key, function () {
        let matches = value.match || []
        matches.forEach(function (matchElement) {
          let str, expectedElements

          let regex
          try {
            regex = module.__get__(key)
          } catch (ex) {
            throw new ReferenceError(`'${key}' not found in module for regex test suite '${topic}'`)
          }

          if (matchElement.hasOwnProperty('str') && matchElement.hasOwnProperty('elements')) {
            str = matchElement.str
            expectedElements = matchElement.elements
          } else {
            str = matchElement
          }

          it(`matches '${str}'`, function () {
            assert.regexMatches(regex, str)
          })

          if (expectedElements) {
            it(`identifies elements of '${str}'`, function () {
              let actualElements = exports.getMatches(str, regex)
              assert.deepEqual(Array.from(actualElements), expectedElements)
            })
          }
        })

        let fails = value.fail || []
        fails.forEach(function (str) {
          it(`does not matches '${str}'`, function () {
            assert.notRegexMatches(module.__get__(key), str)
          })
        })
      })
    })
  })
}

/**
 *
 * @param {Element} xml
 * @returns {Object.<string, string|Boolean>}
 */
exports.extractConfig = function (xml) {
  let conf = {}
  exports.nodeListToArr(xml.attributes || [])
    .filter(attr => attr.name.startsWith(DATA_CONFIG_SEARCHSTRING))
    .forEach(attr => {
      let key = attr.name.replace(DATA_CONFIG_SEARCHSTRING, '')
      conf[key] = toValue(attr.value)
      xml.removeAttribute(attr.name)
    })
  return conf
}

/**
 * @param {Element} xml
 * @returns {Object}
 */
exports.extractTestcaseData = function (xml) {
  let id
  let only
  let skip

  if (xml.hasAttribute) {
    id = xml.getAttribute('id').toLowerCase()

    only = xml.getAttribute('data-only')
    xml.removeAttribute('data-only')

    skip = xml.getAttribute('data-skip')
    xml.removeAttribute('data-skip')
  }

  return {name: id, only: !!only, skip: !!skip}
}

exports.getMatches = function (str, regex) {
  const res = []
  const ind = regex.lastIndex
  let m
  try {
    if (regex.global) {
      while (m = regex.exec(str)) {  // eslint-disable-line no-cond-assign
        res.push(m[1] || m[0])
      }
    } else {
      m = regex.exec(str)
      Array.prototype.push.apply(res, m)
    }
  } finally {
    regex.lastIndex = ind
  }
  return res
}

/**
 * @param {Module} assert
 */
exports.initCustomAsserts = function (assert) {
  if (!assert.regexMatches) {
    assert.regexMatches = function (regex, str) {
      let typemsg = `'${regex}' is not a RegEx

Expected type:
RegExp

Actual type:
${typeof regex}`
      assert(regex instanceof RegExp, typemsg)

      let matchmsg = `Regex does not match

Regex:
${regex}

String:
${str}`
      const ind = regex.lastIndex
      try {
        assert(regex.test(str), matchmsg)
      } finally {
        regex.lastIndex = ind
      }
    }
  }

  if (!assert.notRegexMatches) {
    assert.notRegexMatches = function (regex, str) {
      let typemsg = `'${regex}' is not a RegEx

Expected type:
RegExp

Actual type:
${typeof regex}`
      assert(regex instanceof RegExp, typemsg)

      let matchmsg = `Regex does match

Regex:
${regex}

String:
${str}`
      assert(!regex.test(str), matchmsg)
    }
  }
}

/**
 * @param {NodeList|Array} nodeList
 * @returns {Element[]}
 */
exports.nodeListToArr = function (nodeList) {
  let array = []
  for (let i = nodeList.length >>> 0; i--;) {
    array[i] = nodeList[i]
  }
  return array
}

/**
 * @param {string} path
 * @param {{}} [options]
 * @returns {Promise}
 */
exports.readFile = function (path, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, data) => {
      return err ? reject(err) : resolve(data)
    })
  })
}

/**
 * @param str
 * @param {{}} [opts]
 * @param {Function} [opts.warning]
 * @param {Function} [opts.error]
 * @param {Function} [opts.fatalError]
 * @returns {Document}
 */
exports.strToXML = function (str, opts) {
  opts = opts || {}

  const domOptions = {
    locator: {},
    errorHandler: {
      warning: opts.warning || function (w) {},
      error: opts.error || function (w) { throw new Error(w) },
      fatalError: opts.fatalError || function (w) { throw new Error(w) }
    }
  }

  const parser = new xmldom.DOMParser(domOptions)
  return parser.parseFromString(str, 'text/xml')
}

/**
 * @param {...Document|...Element} documents
 * @yields {Element[]}
 */
exports.walkChildNodePairs = function * (...documents) {
  const XMLs = documents.map(d => [exports.strToXML(d)])
  for (let item of exports.zip(...XMLs)) {
    let childNodes = item.map(e => exports.nodeListToArr(e.childNodes))
    for (let children of exports.zip(...childNodes)) {
      yield children
    }
  }
}

/**
 * @param {string} dir
 * @param {Object} [opts]
 * @param {string|Array} [opts.prioritise]
 * @param {string|Array} [opts.prioritize]
 */
exports.walkFixtures = function * (dir, opts = {}) {
  opts.prioritise = opts.prioritise || opts.prioritize || []
  dir = path.resolve(__dirname, dir)

  const data = {}

  for (let filepath of recursiveReaddirSync(dir)) {
    let parentDirname = path.basename(path.dirname(filepath))
    if (!data[parentDirname]) data[parentDirname] = []

    let filename = path.basename(filepath)

    if (contains(filename, opts.prioritise)) {
      data[parentDirname].unshift(filepath)
    } else {
      data[parentDirname].push(filepath)
    }
  }

  for (let name of Object.keys(data)) {
    yield [name, ...data[name]]
  }
}

/**
 * @param {...} rows
 * @returns {Array}
 */
exports.zip = function (...rows) {
  return rows[0].map((_, i) => rows.map(row => row[i]))
}

const contains = function (needle, haystack) {
  return haystack.indexOf(needle) !== -1
}

const toValue = function (str) {
  if (str === 'true') return true
  if (str === 'false') return false
  if (str.indexOf('=>') !== -1) {
    return eval(str).bind(this)  // eslint-disable-line no-eval
  }
  if (str.startsWith('function ')) {
    str = `(${str})`
    return eval(str)  // eslint-disable-line no-eval
  }
  if (str.startsWith('{') && str.endsWith('}')) {
    return JSON.parse(str)
  }
  return str
}
