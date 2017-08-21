class JSXText {
  constructor(node) {
    this.node = node
    this.children = []
    this.type = 'Text'
    this.text = node.textContent.trim()
  }
}

export default JSXText
