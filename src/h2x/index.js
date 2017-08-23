import TraversalContext from './TraversalContext'

const getVisitorKeys = node => {
  if (node.constructor.name === 'Attr') return null
  return ['children', 'attributes']
}

export const traverse = (node, opts = {}, state = {}) => {
  const keys = getVisitorKeys(node)
  if (!keys) return

  keys.forEach(key => {
    const context = new TraversalContext({ opts, state })
    context.visit(node, key)
  })
}
