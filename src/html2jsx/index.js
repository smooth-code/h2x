import TraversalContext from './TraversalContext'

export const traverse = (node, state) => {
  const context = new TraversalContext(state)
  context.visit(node)
}
