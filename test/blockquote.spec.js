/* global describe, it */
'use strict'
const assert = require('assert')
const rewire = require('rewire')

const blockquote = rewire('../lib/blockquote')
const helpers = require('./helpers')

helpers.initCustomAsserts(assert)

const ideals = {
  'rAuthor': [
    'author'
  ],
  'rAuthorTitle': [
    'author, title'
  ],
  'rFullCite': [
    'author https://source'
  ],
  'rFullCiteWithTitle': [
    'author https://source link_text',
    'author, title https://source link_text'
  ]
}

describe('blockquote', function () {
  Object.keys(ideals).forEach(function (key) {
    let value = ideals[key]
    describe(key, function () {
      value.forEach(function (str) {
        it(`matches '${str}'`, function () {
          assert.regexMatches(blockquote.__get__(key), str)
        })
      })
    })
  })
})
