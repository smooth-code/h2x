/* eslint-disable no-restricted-syntax, no-continue, no-underscore-dangle */
import { getNodeType } from 'h2x-types'
import traverse from './'

class NodePath {
  static get({ parent, container, listKey, key, context }) {
    const node = container[key]
    if (!node) return null
    return new NodePath({
      listKey,
      key,
      parent,
      container,
      node,
      context,
    })
  }

  constructor({ container, parent, key, listKey, node, context }) {
    this.container = container
    this.parent = parent
    this.listKey = listKey
    this.key = key
    this.node = node
    this.context = context
    this.state = context.state
    this.opts = context.opts
    this.type = getNodeType(node)
    this.shouldStop = false
  }

  visit() {
    if (this.call('enter')) this.shouldStop = true

    traverse(this.node, this.opts, this.state)

    if (this.call('exit')) this.shouldStop = true

    return this.shouldStop
  }

  call(key) {
    const { opts } = this

    if (this.node) {
      if (this._call(opts[key])) return true
      return this._call(opts[this.type] && opts[this.type][key])
    }

    return false
  }

  resyncKey() {
    if (!this.container) return
    for (let i = 0; i < this.container.length; i += 1) {
      if (this.container[i] === this.node) this.key = i
    }
  }

  replace(node) {
    this.shouldStop = true
    this.node = node
    this.container[this.key] = node
    this.requeue()
  }

  remove() {
    this.shouldStop = true
    if (Array.isArray(this.container)) {
      this.container.splice(this.key, 1)
    } else {
      this.container[this.key] = null
    }
    this.node = null
    this.requeue()
  }

  requeue() {
    this.context.visit(this.parent, this.listKey)
  }

  _call(fns) {
    if (!fns) return false
    if (!Array.isArray(fns)) fns = [fns]

    for (const fn of fns) {
      if (!fn) continue

      const { node } = this
      if (!node) return true

      const ret = fn(this, this.state)
      if (ret)
        throw new Error(`Unexpected return value from visitor method ${fn}`)

      // node has been replaced, it will have been requeued
      if (this.node !== node) return true
    }

    return false
  }
}

export default NodePath
