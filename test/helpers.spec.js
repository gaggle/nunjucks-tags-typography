const assert = require("assert")
const helpers = require("./helpers")

describe("test.helpers", function () {
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
