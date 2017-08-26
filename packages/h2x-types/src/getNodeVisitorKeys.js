import { VISITOR_KEYS } from './symbols'

const getHTMLVisitorKeys = node => {
  if (node.constructor.name === 'Attr') return null
  return ['children', 'attributes']
}

function getNodeVisitorKeys(node) {
  if (node.constructor[VISITOR_KEYS]) return node.constructor[VISITOR_KEYS]
  return getHTMLVisitorKeys(node)
}

export default getNodeVisitorKeys
