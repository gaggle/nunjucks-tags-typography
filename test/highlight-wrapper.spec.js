/* global describe, it */
'use strict'
const assert = require('assert')
const highlight = require('../lib/highlight-wrapper.js')

describe('highlight-wrapper', function () {
  it('converts simple text', function () {
    const res = highlight('foo')
    assert.deepEqual(res, {value: 'foo', language: 'plain'})
  })

  it('can autodetect language', function () {
    const res = highlight('{"foo":"bar"}', {autoDetect: true})
    assert.deepEqual(res, {
      value: '{<span class="hljs-attr">"foo"</span>:<span class="hljs-string">"bar"</span>}',
      language: 'json'
    })
  })
})
