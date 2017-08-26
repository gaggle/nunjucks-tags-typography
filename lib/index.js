"use strict";

/**
 * @param {module:nunjucks-tags} nunjucks
 * @param {Object} [config]
 * @returns {Object.<string, nunjucksTag>}
 */
module.exports = function (nunjucks, config) {
  let blockquoteLib = require("./blockquote")(config)

  nunjucks.register("quote", blockquoteLib, true)
  nunjucks.register("blockquote", blockquoteLib, true)

  return {
    quote: blockquoteLib,
    blockquote: blockquoteLib,
  }
}

/**
 * @function nunjucksTag
 * @param {string[]} args
 * @param {string} content
 */
