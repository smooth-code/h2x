const ELEMENT_NODE = 1
const TEXT_NODE = 3
const COMMENT_NODE = 8

export const ATTRIBUTE = 'ATTRIBUTE'
export const TEXT = 'TEXT'
export const ELEMENT = 'ELEMENT'
export const COMMENT = 'COMMENT'

export const getNodeType = node => {
  if (node.constructor.name === 'Attr') return ATTRIBUTE
  switch (node.nodeType) {
    case TEXT_NODE:
      return TEXT
    case ELEMENT_NODE:
      return ELEMENT
    case COMMENT_NODE:
      return COMMENT
    default:
      throw new Error(`Unknown node ${node}`)
  }
}
