"use strict";
const assert = require("assert")
const compare = require('dom-compare').compare
const Nunjucks = require("nunjucks-tags")
const path = require("path")
const recursiveReaddirSync = require('recursive-readdir-sync')
const reporter = require('dom-compare').GroupingReporter
const xmldom = require("xmldom")

const helpers = require("./helpers")
const tags = require("..")

const parser = new xmldom.DOMParser()

function* yieldFixtures(p) {
  p = path.resolve(__dirname, p)

  const data = {}

  for (let fn of recursiveReaddirSync(p)) {
    let shortDirname = path.basename(path.dirname(fn))
    if (!data[shortDirname]) data[shortDirname] = []
    fn.indexOf('expected.html') !== 0 ?
      data[shortDirname].push(fn) :
      data[shortDirname].unshift(fn)
  }

  for (let name of Object.keys(data)) {
    let files = data[name]
    yield {name, expected: files[0], src: files[1]}
  }
}

describe("nunjucks-tags-typography", function () {
  let nunjucks

  beforeEach(() => {
    nunjucks = new Nunjucks();
    tags(nunjucks)
  })

  for (let {name, expected, src} of yieldFixtures("./fixtures")) {
    describe(name, function () {
      it("converts to expected output", function () {
        return Promise.all([helpers.readFile(expected), helpers.readFile(src)])
          .then(buffers => {
            let [expected, src] = buffers
            return Promise.all([expected.toString(), nunjucks.render(src.toString())])
          })
          .then(strings => strings.map(s => parser.parseFromString(s, "test/xml")))
          .then(DOMs => DOMs.map(d => helpers.nodeListToArr(d.childNodes)))
          .then(children => {
            helpers.zip(...children).forEach(item => {
              const [expected, actual] = item
              let comp = compare(expected, actual, {stripSpaces: true})
              let message = `${reporter.report(comp)}
Expected:
${expected}

Got:
${actual}`
              assert(comp.getResult(), message)
            })
          })
      })
    })
  }
})
