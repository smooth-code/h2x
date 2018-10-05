import visitor from './visitor'
import generator from './generator'

export { default as JSXElement } from './JSXElement'
export { default as JSXAttribute } from './JSXAttribute'
export { default as JSXComment } from './JSXComment'
export { default as JSXText } from './JSXText'
export { default as JSXInterpolation } from './JSXInterpolation'

export default function transformJsx() {
  return { visitor, generator }
}
