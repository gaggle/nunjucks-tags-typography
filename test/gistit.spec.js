'use strict'
const assert = require('assert')
const rewire = require('rewire')

const gistit = rewire('../lib/gistit')
const helpers = require('./helpers')

helpers.initCustomAsserts(assert)

helpers.createRegexTestSuite('gistit', gistit, {
  rSlice: {
    match: [
      {str: '1:10', elements: ['1:10', '1', '10']},
      {str: '1:10 footer=no', elements: ['1:10', '1', '10']}
    ]
  },
  rOpts: {
    match: [
      {str: 'footer=no', elements: ['footer=no', 'footer', 'no']},
      {str: '1:10 footer=no', elements: ['footer=no', 'footer', 'no']}
    ]
  }
})
