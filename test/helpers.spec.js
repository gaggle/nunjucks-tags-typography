/* global describe, it, beforeEach, afterEach */
'use strict'
const assert = require('assert')
const mock = require('mock-fs')
const path = require('path')
const helpers = require('./helpers')

describe('test.helpers', function () {
  describe('#extractConfig', function () {
    it('returns empty from attributes-less object', function () {
      const result = helpers.extractConfig({})
      assert.deepEqual(result, {})
    })

    it('returns empty if attributes are empty', function () {
      const result = helpers.extractConfig(element())
      assert.deepEqual(result, {})
    })

    it('identifies data-config- attributes', function () {
      const result = helpers.extractConfig(element(
        'data-config-foo="true"',
        'data-config-bar="false"',
        'data-config-baz="ham"'
      ))
      assert.deepEqual(result, {foo: true, bar: false, baz: 'ham'})
    })

    it('removes only data-config- attributes', function () {
      let el = element(
        'id="foo"',
        'data-custom="bar"'
      )
      const result = helpers.extractConfig(el)
      assert.deepEqual(result, {})
      let attributesObject = helpers.nodeListToArr(el.attributes)
        .map(attr => [attr.name, attr.value])
        .reduce((o, [key, value]) => {
          o[key] = value
          return o
        }, {})
      assert.deepEqual(attributesObject,
        {id: 'foo', 'data-custom': 'bar'}
      )
    })
  })

  describe('#generateTestcaseName', function () {
    it('includes id in generated name', function () {
      assert.deepEqual(
        helpers.generateTestcaseName(element('id="foo"')),
        'converts foo'
      )
    })

    it('returns default if id is missing', function () {
      assert.deepEqual(
        helpers.generateTestcaseName(element()),
        'converts'
      )
    })

    it('returns default for attributes-less object', function () {
      assert.deepEqual(
        helpers.generateTestcaseName({}),
        'converts'
      )
    })
  })

  describe('#initCustomAsserts', function () {
    beforeEach(() => delete require.cache['assert'])

    it('modifies assert to include xmlEqual', function () {
      let obj = {}
      helpers.initCustomAsserts(obj)
      assert(Object.keys(obj).indexOf('xmlEqual') !== -1)
    })

    it('exposes function to compare alike xml objects', function () {
      const module = require('assert')
      helpers.initCustomAsserts(module)
      module.xmlEqual(element(), element())
    })

    it('exposes function that asserts on disalike objects', function () {
      const module = require('assert')
      helpers.initCustomAsserts(module)
      const fn = () => module.xmlEqual(element('foo="bar"'), element())
      assert.throws(fn, Error, 'xmlEqual should throw')
    })
  })

  describe('#nodeListToArr', function () {
    it("converts element's nodeList to real array", function () {
      const el = element('id="foo"', 'class="bar baz"')
      const result = helpers.nodeListToArr(el.attributes)
      assert(Array.isArray(result), 'Result must be of type array')
    })
  })

  describe('#readFile', function () {
    it('resolves with content of file', function () {
      return helpers.readFile(__filename)
        .then(result => {
          assert(Buffer.isBuffer(result), 'Result must be of type buffer')
        })
    })

    it('rejects on error', function () {
      return helpers.readFile('foo')
        .catch(err => {
          assert.equal(typeof err, typeof Error(), 'Promise must reject with error')
        })
    })
  })

  describe('#strToXml', function () {
    it('converts string to xml object', function () {
      const el = helpers.strToXML('<div></div>')
      assert.equal(el.constructor.name, 'Document')
    })
  })

  describe('#walkChildNodePairs', function () {
    it('returns generator of arrays', function () {
      const paired = helpers.walkChildNodePairs('<div/>', '<div/>')
      let actual = next(paired)
      assert(Array.isArray(actual), 'Elements of generator must be arrays')
    })

    it('zips elements', function () {
      const letters = '<div id="a"/><div id="b"/>'
      const numbers = '<div id="1"/><div id="2"/>'
      const paired = helpers.walkChildNodePairs(letters, numbers)

      assert.deepEqual(
        next(paired).map(e => e.toString()),
        ['<div id="a"/>', '<div id="1"/>'])
      assert.deepEqual(
        next(paired).map(e => e.toString()),
        ['<div id="b"/>', '<div id="2"/>'])
    })
  })

  describe('#walkFixtures', function () {
    beforeEach(() => mockDir({'dir': {'first': '', 'second': ''}}))
    afterEach(() => mock.restore())

    it('returns generator of arrays', function () {
      assert(Array.isArray(next(callWalkFixtures())))
    })

    it('has data with folder name first', function () {
      let result = next(callWalkFixtures())
      assert.deepEqual(result.shift(), 'dir')
    })

    it('has data with remaining content being file paths', function () {
      let result = next(callWalkFixtures())
      result.shift() // Get rid of first element
      assert.deepEqual(result, [
        path.join(__dirname, 'dir', 'first'),
        path.join(__dirname, 'dir', 'second')
      ])
    })

    it('allows prioritising of a filename', function () {
      const result = callWalkFixtures({prioritise: 'second'})
      assert.deepEqual(next(result), [
        'dir',
        path.join(__dirname, 'dir', 'second'),
        path.join(__dirname, 'dir', 'first')
      ])
    })

    it('allows prioritising of multiple filenames', function () {
      const result = callWalkFixtures({prioritise: ['second']})
      assert.deepEqual(next(result), [
        'dir',
        path.join(__dirname, 'dir', 'second'),
        path.join(__dirname, 'dir', 'first')
      ])
    })

    it('allows use of American prioritize', function () {
      const result = callWalkFixtures({prioritize: 'second'})
      assert.deepEqual(next(result), [
        'dir',
        path.join(__dirname, 'dir', 'second'),
        path.join(__dirname, 'dir', 'first')
      ])
    })

    const mockDir = function (config) {
      const data = {}
      data[__dirname] = config
      mock(data)
    }

    const callWalkFixtures = function (opts = undefined) {
      return helpers.walkFixtures(path.join(__dirname, 'dir'), opts)
    }
  })

  describe('#zip', function () {
    it('combines 1 array', function () {
      const result = helpers.zip(['a'])
      assert.equal(result.length, 1)
      assert.deepEqual(result[0], ['a'])
    })

    it('combines 2 arrays', function () {
      const result = helpers.zip(['a'], [1])
      assert.equal(result.length, 1)
      assert.deepEqual(result[0], ['a', 1])
    })

    it('combines 3 arrays', function () {
      const result = helpers.zip(['a'], [1], ['x'])
      assert.equal(result.length, 1)
      assert.deepEqual(result[0], ['a', 1, 'x'])
    })

    it('combines multiple items', function () {
      const result = helpers.zip(['a', 'b'], [1, 2])
      assert.equal(result.length, 2)
      assert.deepEqual(result[0], ['a', 1])
      assert.deepEqual(result[1], ['b', 2])
    })
  })
})

const element = function (...attrs) {
  let document = helpers.strToXML(`<div ${attrs.join(' ')}></div>`)
  return document.childNodes[0]
}

const next = function (iterable) {
  return iterable.next().value
}
