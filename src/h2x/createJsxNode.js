import JSXElement from './JSXElement'
import JSXComment from './JSXComment'
import JSXText from './JSXText'
import * as NodeTypes from './NodeTypes'

const createJsxNode = node => {
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

export default createJsxNode
