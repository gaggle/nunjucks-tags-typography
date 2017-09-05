'use strict'
const compare = require('dom-compare').compare
const fs = require('fs')
const path = require('path')
const recursiveReaddirSync = require('recursive-readdir-sync')
const reporter = require('dom-compare').GroupingReporter
const xmldom = require('xmldom')

const parser = new xmldom.DOMParser()

let DATA_CONFIG_SEARCHSTRING = 'data-config-'

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

const toValue = function (str) {
  if (str === 'true') return true
  if (str === 'false') return false
  if (str.indexOf('=>') !== -1) {
    return eval(str).bind(this)  // eslint-disable-line no-eval
  }
  if (str.startsWith('{') && str.endsWith('}')) {
    return JSON.parse(str)
  }
  return str
}

/**
 * @param {Element} xml
 * @returns {string}
 */
exports.generateTestcaseName = function (xml) {
  if (xml.hasAttribute && xml.hasAttribute('id')) {
    let id = xml.getAttribute('id')
    return `converts ${id.toLowerCase()}`.trim()
  }
  return 'converts'
}

/**
 * @param {Module} assert
 */
exports.initCustomAsserts = function (assert) {
  assert.xmlEqual = function (expected, actual) {
    let comp = compare(expected, actual, {stripSpaces: true})
    let message = `Documents are not equal
${reporter.report(comp)}

Expected document:
${expected}

Actual document:
${actual}`
    assert(comp.getResult(), message)
  }

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
    assert(regex.test(str), matchmsg)
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
 * @param {string} str
 * @returns {Document|Element}
 */
exports.strToXML = function (str) {
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

const contains = function (needle, haystack) {
  return haystack.indexOf(needle) !== -1
}

/**
 * @param {...} rows
 * @returns {Array}
 */
exports.zip = function (...rows) {
  return rows[0].map((_, i) => rows.map(row => row[i]))
}
