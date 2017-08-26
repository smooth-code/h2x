// HTML node types
const ELEMENT_NODE = 1
const TEXT_NODE = 3
const COMMENT_NODE = 8

const getHTMLNodeType = node => {
  if (node.constructor.name === 'Attr') return 'HTMLAttribute'

  switch (node.nodeType) {
    case TEXT_NODE:
      return 'HTMLText'
    case ELEMENT_NODE:
      return 'HTMLElement'
    case COMMENT_NODE:
      return 'HTMLComment'
    default:
      return null
  }
}

const getHTMLVisitorKeys = node => {
  if (node.constructor.name === 'Attr') return 'HTMLAttribute'
  return ['children', 'attributes']
}

export const NODE_TYPE = Symbol('NODE_TYPE')
export const VISITOR_KEYS = Symbol('VISITOR_KEYS')

export const getNodeType = node => {
  if (node.constructor[NODE_TYPE]) return node.constructor[NODE_TYPE]
  const htmlNodeType = getHTMLNodeType(node)
  if (htmlNodeType) return htmlNodeType
  throw new Error(`Unknown node ${node}`)
}

export const getVisitorKeys = node => {
  if (node.constructor[VISITOR_KEYS]) return node.constructor[VISITOR_KEYS]
  return getHTMLVisitorKeys(node)
}
