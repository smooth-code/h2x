class Traverser {
  constructor(state) {
    this.state = state
  }

  traverse(node) {
    for (let i = 0, count = node.childNodes.length; i < count; i += 1) {
      this.visit(node.childNodes[i])
    }
  }

  visit(node) {
    const jsxNode = this.state.create(node)
    if (!jsxNode) return
    this.state.enter(jsxNode)
    this.traverse(node)
    // this.program.visit(jsxNode, this.state)
    this.state.exit(jsxNode)
  }
}

export default Traverser
