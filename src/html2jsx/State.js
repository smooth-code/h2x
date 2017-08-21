import JSXElement from './JSXElement'
import JSXComment from './JSXComment'
import JSXText from './JSXText'
import * as NodeTypes from './NodeTypes'

class State {
  constructor(root) {
    this.root = root
    this.current = this.root
  }

  create(node) {
    switch (node.nodeType) {
      case NodeTypes.ELEMENT:
        return new JSXElement(node)
      case NodeTypes.COMMENT:
        return new JSXComment(node)
      case NodeTypes.TEXT:
        return new JSXText(node)
      default:
        return null
    }
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
