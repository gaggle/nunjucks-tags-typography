'use strict'
const rewire = require('rewire')

const blockquote = rewire('../lib/blockquote')
const helpers = require('./helpers')

helpers.createRegexTestSuite('blockquote', blockquote, {
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
})
