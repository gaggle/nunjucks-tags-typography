const assert = require("assert")
const helpers = require("./helpers")

describe("test.helpers", function () {
  describe("#extractConfig", function () {
    it("returns empty from attributes-less object", function () {
      const result = helpers.extractConfig({})
      assert.deepEqual(result, {})
    })

    it("returns empty if attributes are empty", function () {
      const result = helpers.extractConfig(element())
      assert.deepEqual(result, {})
    })

    it("identifies data-config- attributes", function () {
      const result = helpers.extractConfig(element(
        'data-config-foo="true"',
        'data-config-bar="false"',
        'data-config-baz="ham"'
      ))
      assert.deepEqual(result, {foo: true, bar: false, baz: "ham"})
    })

    it("removes only data-config- attributes", function () {
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
        {id: "foo", "data-custom": "bar"}
      )
    })
  })

  describe("#generateTestcaseName", function () {
    it("includes id in generated name", function () {
      assert.deepEqual(
        helpers.generateTestcaseName(element('id="foo"')),
        "converts foo"
      )
    })

    it("returns default if id is missing", function () {
      assert.deepEqual(
        helpers.generateTestcaseName(element()),
        "converts"
      )
    })

    it("returns default for attributes-less object", function () {
      assert.deepEqual(
        helpers.generateTestcaseName({}),
        "converts"
      )
    })
  })

  describe("#zip", function () {
    it("combines 1 array", function () {
      const result = helpers.zip(["a"])
      assert.equal(result.length, 1)
      assert.deepEqual(result[0], ["a"])
    })

    it("combines 2 arrays", function () {
      const result = helpers.zip(["a"], [1])
      assert.equal(result.length, 1)
      assert.deepEqual(result[0], ["a", 1])
    })

    it("combines 3 arrays", function () {
      const result = helpers.zip(["a"], [1], ["x"])
      assert.equal(result.length, 1)
      assert.deepEqual(result[0], ["a", 1, "x"])
    })

    it("combines multiple items", function () {
      const result = helpers.zip(["a", "b"], [1, 2])
      assert.equal(result.length, 2)
      assert.deepEqual(result[0], ["a", 1])
      assert.deepEqual(result[1], ["b", 2])
    })
  })
})

const element = function (...attrs) {
  let document = helpers.strToXML(`<div ${attrs.join(" ")}></div>`);
  return document.childNodes[0]
}
