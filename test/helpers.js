"use strict";
const fs = require("fs")


/**
 * @returns {Promise}
 */
exports.readFile = function (path, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (err, data) => {
      return err ? reject(err) : resolve(data)
    })
  })
}

/**
 * @returns {Array}
 */
exports.nodeListToArr = function (obj) {
  let array = []
  for (let i = obj.length >>> 0; i--;) {
    array[i] = obj[i]
  }
  return array
}

/**
 * @returns {Array}
 */
exports.zip = function (...rows) {
  return rows[0].map((_, i) => rows.map(row => row[i]))
}

