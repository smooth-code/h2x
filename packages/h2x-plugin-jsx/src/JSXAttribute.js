import { NODE_TYPE, VISITOR_KEYS } from 'h2x-types'

class JSXAttribute {
  static [NODE_TYPE] = 'JSXAttribute';
  static [VISITOR_KEYS] = null

  name = null
  value = null
  literal = false
  spread = false
}

export default JSXAttribute
