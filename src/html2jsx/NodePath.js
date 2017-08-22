/* eslint-disable no-restricted-syntax, no-continue, no-underscore-dangle */
import createJsxNode from './createJsxNode'
import { traverse } from './'

class NodePath {
  static get({ container, key, context }) {
    const jsxNode = createJsxNode(container[key])
    if (!jsxNode) return null
    return new NodePath({ jsxNode, context })
  }

  constructor({ jsxNode, context }) {
    this.jsxNode = jsxNode
    this.context = context
    this.state = context.state
    this.opts = context.opts
  }

  visit() {
    this.call('enter')
    traverse()
    this.call('exit')
  }

  call(key) {
    const opts = this.opts

    this.debug(() => key)

    if (this.jsxNode) {
      if (this._call(opts[key])) return true
    }

    if (this.node) {
      return this._call(opts[this.node.type] && opts[this.node.type][key])
    }

    return false
  }

  _call(fns) {
    if (!fns) return false

    for (const fn of fns) {
      if (!fn) continue

      const node = this.node
      if (!node) return true

      const ret = fn.call(this.state, this, this.state)
      if (ret)
        throw new Error(`Unexpected return value from visitor method ${fn}`)

      // node has been replaced, it will have been requeued
      if (this.node !== node) return true

      if (this.shouldStop || this.shouldSkip || this.removed) return true
    }

    return false
  }
}

export default NodePath
