import { NODE_TYPE, VISITOR_KEYS } from 'h2x-types'

class JSXText {
  static [NODE_TYPE] = 'JSXText';
  static [VISITOR_KEYS] = null

  text = null
}

export default JSXText
