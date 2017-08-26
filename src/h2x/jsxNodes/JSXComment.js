import { NODE_TYPE, VISITOR_KEYS } from '../types'

class JSXComment {
  static [NODE_TYPE] = 'JSXComment';
  static [VISITOR_KEYS] = null

  text = null
}

export default JSXComment
