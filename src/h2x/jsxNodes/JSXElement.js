import { NODE_TYPE, VISITOR_KEYS } from '../types'

class JSXElement {
  static [NODE_TYPE] = 'JSXElement';
  static [VISITOR_KEYS] = ['children', 'attributes']

  name = null
  children = []
  attributes = []
}

export default JSXElement
