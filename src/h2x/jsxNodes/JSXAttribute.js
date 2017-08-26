import { NODE_TYPE, VISITOR_KEYS } from '../types'

class JSXAttribute {
  static [NODE_TYPE] = 'JSXAttribute';
  static [VISITOR_KEYS] = null

  name = null
  value = null
  litteral = false
  spread = false
}

export default JSXAttribute
