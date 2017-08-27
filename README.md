# h2x

[![Build Status](https://travis-ci.org/smooth-code/h2x.svg?branch=master)](https://travis-ci.org/smooth-code/h2x)
[![codecov](https://codecov.io/gh/smooth-code/h2x/branch/master/graph/badge.svg)](https://codecov.io/gh/smooth-code/h2x)

**H2X** is a compiler to configurable compiler to transform HTML into JSX or another language.

It is inspired by babel and configurable using plugins.

## Usage

```js
import { transform } from 'h2x-core'
import jsx from 'h2x-plugin-jsx'

const result = transform(`<div class="foo"></div>`, { plugins: [jsx] })
console.log(result) // <div className="foo" />
```

## Why

Transform HTML into JSX is not simple. It's a compilation operation. To do it properly we need to have a compiler like process.

Make it extensible with plugins give us the ability to create awesome utilities.

## License

MIT
