# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.2.0](https://github.com/smooth-code/h2x/compare/v1.1.1...v1.2.0) (2018-10-05)


### Features

* add new JSXInterpolation node ([1e2c3c7](https://github.com/smooth-code/h2x/commit/1e2c3c7))





## [1.1.1](https://github.com/smooth-code/h2x/compare/v1.1.0...v1.1.1) (2018-10-05)


### Bug Fixes

* handle special SVG attributes ([efc529c](https://github.com/smooth-code/h2x/commit/efc529c))
* handle style attribute ([b1c70ae](https://github.com/smooth-code/h2x/commit/b1c70ae))





<a name="1.1.0"></a>
# [1.1.0](https://github.com/smooth-code/h2x/compare/v1.0.0...v1.1.0) (2018-09-15)


### Bug Fixes

* JSXAttribute generation typo ([#13](https://github.com/smooth-code/h2x/issues/13)) ([cc03a02](https://github.com/smooth-code/h2x/commit/cc03a02))


### Features

* upgrade to JSDOM v12 ([#14](https://github.com/smooth-code/h2x/issues/14)) ([949a80c](https://github.com/smooth-code/h2x/commit/949a80c))





<a name="1.0.0"></a>
# [1.0.0](https://github.com/smooth-code/h2x/compare/v0.1.9...v1.0.0) (2018-05-14)


### Features

* upgrade JSDOM ([0fd6741](https://github.com/smooth-code/h2x/commit/0fd6741))


### BREAKING CHANGES

* - An AST is now generate from the JSDOM tree.
- You can still access the originalNode using `node.originalNode`.
- You now have to call `fromHtmlAttribute` and `fromHtmlElement` to replace a node.
