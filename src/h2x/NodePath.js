/* eslint-disable no-restricted-syntax, no-continue, no-underscore-dangle */
import debug from 'debug'
import { traverse } from './'
import { getNodeType } from './types'

const h2xDebug = debug('h2x')

class NodePath {
  static get({ parent, container, listKey, key, context }) {
    const node = container[key]
    return new NodePath({ parentKey: listKey, containerKey: key, parent, container, node, context })
  }

  constructor({ container, parent, parentKey, containerKey, node, context }) {
    this.container = container
    this.parent = parent
    this.parentKey = parentKey
    this.containerKey = containerKey
    this.node = node
    this.context = context
    this.state = context.state
    this.opts = context.opts
    this.type = getNodeType(node)
  }

  debug(value) {
    h2xDebug(value)
  }

  visit() {
    let shouldStop = false

    if (this.call('enter')) shouldStop = true

    traverse(this.node, this.opts, this.state)

    if (this.call('exit')) shouldStop = true

    return shouldStop
  }

  call(key) {
    const opts = this.opts

    this.debug(key)

    if (this.node) {
      if (this._call(opts[key])) return true
    }

    if (this.node) {
      return this._call(opts[this.type] && opts[this.type][key])
    }

    return false
  }

  _call(fns) {
    if (!fns) return false
    if (!Array.isArray(fns)) fns = [fns]

    for (const fn of fns) {
      if (!fn) continue

      const node = this.node
      if (!node) return true

      const ret = fn(this)
      if (ret)
        throw new Error(`Unexpected return value from visitor method ${fn}`)

      // node has been replaced, it will have been requeued
      if (this.node !== node) return true
    }

    return false
  }
}

export default NodePath
