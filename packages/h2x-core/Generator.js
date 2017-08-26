/* eslint-disable default-case */
import { traverse } from './'

const formatAttribute = jsxAttribute => {
  if (jsxAttribute.spread) return `{...${jsxAttribute.name}}`
  if (jsxAttribute.litteral)
    return `${jsxAttribute.name}={${jsxAttribute.value}}`
  return `${jsxAttribute.name}="${jsxAttribute.value}"`
}

const formatElementOpen = jsxElement => {
  const attributes = jsxElement.attributes.map(formatAttribute).join(' ')
  const end = jsxElement.children.length === 0 ? ' />' : '>'
  return `<${jsxElement.name}${attributes.length ? ` ${attributes}` : ''}${end}`
}

const formatElementClose = jsxElement => `</${jsxElement.name}>`

const formatComment = jsxComment =>
  `{/*${jsxComment.text.replace('*/', '* /')}*/}`

const formatText = jsxText => jsxText.text

class Generator {
  enter() {
    this.level += 1
  }

  exit() {
    this.level -= 1
  }

  indent() {
    return '  '.repeat(this.level)
  }

  generate(root) {
    this.output = ''
    this.level = 0

    traverse(
      root,
      {
        JSXElement: {
          enter(path, state) {
            state.output += `${state.indent()}${formatElementOpen(path.node)}\n`
            state.level += 1
          },
          exit(path, state) {
            state.level -= 1
            if (path.node.children.length !== 0)
              state.output += `${state.indent()}${formatElementClose(
                path.node,
              )}\n`
          },
        },
        JSXComment: {
          enter(path, state) {
            state.output += `${state.indent()}${formatComment(path.node)}\n`
          },
        },
        JSXText: {
          enter(path, state) {
            const trimmedText = path.node.text.trim()
            if (trimmedText)
              state.output += `${state.indent()}${formatText(path.node)}\n`
          },
        },
      },
      this,
    )

    return this.output
  }
}

export default Generator
