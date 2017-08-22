class State {
  constructor(root) {
    this.root = root
    this.current = this.root
  }

  enter(jsxNode) {
    this.current.push(jsxNode)
    this.current = jsxNode
  }

  exit(jsxNode) {
    this.current = jsxNode.parent
  }

  replace(jsxNode) {
    this.current.parent.children.pop()
    this.current.parent.push(jsxNode)
    this.current = jsxNode
  }
}

export default State
