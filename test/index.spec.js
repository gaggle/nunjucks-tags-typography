"use strict";
const assert = require("assert")
const Nunjucks = require("nunjucks-tags")

const helpers = require("./helpers")
const tags = require("..")

helpers.initCustomAsserts(assert)

describe("nunjucks-tags-typography", function () {
  let nunjucks
  beforeEach(() => nunjucks = new Nunjucks())

  for (let fixture of helpers.walkFixtures("./fixtures", {prioritise: ["expected.html"]})) {
    describe(fixture.name, function () {
      for (let [expected, src] of helpers.walkElementPairs(fixture.expected, fixture.src)) {
        if (!src || src.toString() === "\n") continue

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
