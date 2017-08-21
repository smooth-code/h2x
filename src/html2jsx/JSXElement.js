import JSXAttribute from './JSXAttribute'

const extractAttributes = node => {
  const attributes = []
  for (let i = 0, count = node.attributes.length; i < count; i += 1) {
    attributes.push(new JSXAttribute(node.attributes[i], node))
  }
  return attributes
}

class JSXElement {
  constructor(node) {
    this.node = node
    this.children = []
    this.type = 'Element'
    this.name = node.tagName
    this.attributes = extractAttributes(node)
  }

  push(element) {
    element.parent = this
    this.children.push(element)
    return element
  }

  isSelfClosing() {
    return this.children.length === 0
  }
}

export default JSXElement
