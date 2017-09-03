/* global describe, it, beforeEach */
'use strict'
const assert = require('assert')
const fs = require('fs')
const Nunjucks = require('nunjucks-tags')

const helpers = require('./helpers')
const tags = require('..')

helpers.initCustomAsserts(assert)

describe('nunjucks-tags-typography', function () {
  let nunjucks
  beforeEach(() => {
    nunjucks = new Nunjucks()
  })

  it('can initialise without specifying config', function () {
    tags(nunjucks)
  })

  for (let [name, ...filePaths] of helpers.walkFixtures('./fixtures', {prioritise: ['expected.html']})) {
    describe(name, function () {
      const content = filePaths.map(fp => fs.readFileSync(fp).toString())
      for (let [expected, src] of helpers.walkChildNodePairs(...content)) {
        if (!src || src.toString() === '\n') continue

        it(helpers.generateTestcaseName(src), function () {
          let conf = helpers.extractConfig(src)
          tags(nunjucks, conf)
          return nunjucks.render(src.toString())
            .then(helpers.strToXML)
            .then(e => e.childNodes[0]) // We need the element itself, not top-level document
            .then(actual => assert.xmlEqual(expected, actual))
        })
      }
    })
  }
})
