/* global describe, it */
'use strict'
const assert = require('assert')

const common = require('../lib/common')

describe('extract', function () {
  it('returns value and new string', function () {
    const result = common.extract(/\s*foo:(\w+)/i, 'foo:bar')
    assert.deepEqual(result, ['bar', ''])
  })

  it('leaves unmatched alone', function () {
    assert.deepEqual(
      common.extract(/\s*foo:(\w+)/i, 'ham:spam'),
      [undefined, 'ham:spam'])

    assert.deepEqual(
      common.extract(/\s*foo:(\w+)/i, 'ham:spam foo:bar'),
      ['bar', 'ham:spam'])
  })

  it('casts to boolean', function () {
    assert.deepEqual(
      common.extract(/\s*foo:(\w+)/i, 'foo:true'),
      [true, ''])

    assert.deepEqual(
      common.extract(/\s*foo:(\w+)/i, 'foo:false'),
      [false, ''])
  })

  it('can chunk up a string into variable assignments', function () {
    let arg = 'foo:bar ham:spam'
    let foo
    let ham
    [foo, arg] = common.extract(/\s*foo:(\w+)/i, arg);
    [ham, arg] = common.extract(/\s*ham:(\w+)/i, arg)
    assert.equal(foo, 'bar')
    assert.equal(ham, 'spam')
    assert.equal(arg, '')
  })
})

describe('paragraphWrap', function () {
  it('wraps content in paragraph-tags', function () {
    assert.equal(common.paragraphWrap('foo'), '<p>foo</p>')
  })

  it('ignores no content', function () {
    assert.equal(common.paragraphWrap(''), '')
    assert.equal(common.paragraphWrap(undefined), undefined)
  })

  it('ignores content that already starts with a tag', function () {
    assert.equal(common.paragraphWrap('<img/>'), '<img/>')
  })
})
