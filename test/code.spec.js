'use strict'
const assert = require('assert')
const rewire = require('rewire')

const code = rewire('../lib/code')
const helpers = require('./helpers')

helpers.initCustomAsserts(assert)

helpers.createRegexTestSuite('code', code, {
  rCaptionUrlTitle: {
    match: [{
      str: 'title https://url link',
      elements: ['title https://url link', 'title', 'https://', 'url', 'link']
    }]
  },
  rCaptionUrl: {
    match: ['title https://url']
  },
  rCaption: {
    match: ['title']
  },
  rLang: {
    match: ['lang:foo']
  },
  rLineNumber: {
    match: ['line_number:true']
  },
  rHighlight: {
    match: ['highlight:true']
  },
  rFirstLine: {
    match: ['first_line:1']
  },
  rMark: {
    match: ['mark:1']
  }
})
