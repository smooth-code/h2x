class JSXComment {
  constructor(node) {
    this.node = node
    this.children = []
    this.type = 'Comment'
    this.text = node.textContent.trim()
  }
}

export default JSXComment
