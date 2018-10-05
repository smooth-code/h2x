import { NODE_TYPE, VISITOR_KEYS } from 'h2x-types'

class JSXInterpolation {
  static [NODE_TYPE] = 'JSXInterpolation';
  static [VISITOR_KEYS] = null

  value = null
}

export default JSXInterpolation
