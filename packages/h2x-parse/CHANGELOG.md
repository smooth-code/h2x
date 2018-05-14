# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

<a name="1.0.0"></a>
# [1.0.0](https://github.com/smooth-code/h2x/tree/master/packages/h2x-parse/compare/v0.1.9...v1.0.0) (2018-05-14)


### Features

* upgrade JSDOM ([0fd6741](https://github.com/smooth-code/h2x/tree/master/packages/h2x-parse/commit/0fd6741))


### BREAKING CHANGES

* - An AST is now generate from the JSDOM tree.
- You can still access the originalNode using `node.originalNode`.
- You now have to call `fromHtmlAttribute` and `fromHtmlElement` to replace a node.
