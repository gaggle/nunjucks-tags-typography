'use strict'

exports.paragraphWrap = function (content) {
  if (content.startsWith('<')) {
    return content
  }
  return '<p>' + content + '</p>'
}
