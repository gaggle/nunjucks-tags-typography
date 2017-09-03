# Nunjucks Tags Typography
[![Build Status](https://travis-ci.org/gaggle/nunjucks-tags-typography.svg?branch=master)](https://travis-ci.org/gaggle/nunjucks-tags-typography)
[![Code Climate GPA](https://codeclimate.com/github/gaggle/nunjucks-tags-typography/badges/gpa.svg)](https://codeclimate.com/github/gaggle/nunjucks-tags-typography)
[![Code Coverage](https://codecov.io/gh/gaggle/nunjucks-tags-typography/branch/master/graph/badge.svg)](https://codecov.io/gh/gaggle/nunjucks-tags-typography)
[![Known Vulnerabilities](https://snyk.io/test/github/gaggle/nunjucks-tags-typography/badge.svg)](https://snyk.io/test/github/gaggle/nunjucks-tags-typography)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Collection of custom tags for [Nunjucks] 
suited for various typographical needs.

## How to use
To access the collection of custom tags 
pass an instance of [nunjucks-tags] into the top-level function: 
```javascript
const Nunjucks = require("nunjucks-tags")
const tags = require("nunjucks-tags-typography")

const nunjucks = new Nunjucks()
tags(nunjucks)

nunjucks.render("{% blockquote %} Quote! {% endblockquote %}")
  .then(res => console.log(res))
> <div>
    <blockquote>
      <p>Quote!</p>
    </blockquote>
  </div>
```

## Installation
```bash
$ npm install https://github.com/gaggle/nunjucks-tags-typography --save
```

This package peer-depends on [nunjucks-tags] so you need to install that too:
```bash
$ npm install https://github.com/gaggle/nunjucks-tags --save
```

## Development
![Graph of coverage/commits]

## Credits
Lifted from the excellent [Hexo] project by [Tommy Chen].

[Graph of coverage/commits]: https://codecov.io/gh/gaggle/nunjucks-tags-typography/branch/master/graphs/commits.svg
[Hexo]: https://hexo.io
[nunjucks-tags]: https://github.com/gaggle/nunjucks-tags
[Nunjucks]: https://github.com/mozilla/nunjucks
[Tommy Chen]: https://github.com/tommy351
