import NodePath from './NodePath'

class TraversalContext {
  constructor({ state, opts }) {
    this.state = state
    this.opts = opts
  }

  visit(node, key) {
    const nodes = node[key]
    if (!nodes) return false

    if (typeof nodes.length === 'number')
      return this.visitMultiple(nodes, node, key)

    return this.visitSingle(node, key)
  }

  visitMultiple(container, parent, listKey) {
    if (container.length === 0) return false
    let shouldStop = false
    for (let key = 0; key < container.length; key += 1) {
      const nodePath = this.create(parent, container, key, listKey)
      if (nodePath && nodePath.visit()) shouldStop = true
    }

    return shouldStop
  }

  visitSingle(node, key) {
    const nodePath = this.create(node, node, key)
    if (!nodePath) return false
    return nodePath.visit()
  }

  create(parent, container, key, listKey) {
    return NodePath.get({
      parent,
      container,
      key,
      listKey,
      context: this,
    })
  }
}

export default TraversalContext
