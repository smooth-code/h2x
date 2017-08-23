/* eslint-disable default-case */
const formatAttribute = jsxAttribute => {
  if (jsxAttribute.spread) return `{...${jsxAttribute.name}}`
  if (jsxAttribute.litteral)
    return `${jsxAttribute.name}={${jsxAttribute.value}}`
  return `${jsxAttribute.name}="${jsxAttribute.value}"`
}

const formatElementOpen = jsxElement => {
  const attributes = jsxElement.attributes.map(formatAttribute).join(' ')
  const end = jsxElement.isSelfClosing() ? ' />' : '>'
  return `<${jsxElement.name}${attributes.length ? ` ${attributes}` : ''}${end}`
}

const formatElementClose = jsxElement => `</${jsxElement.name}>`

const formatComment = jsxComment =>
  `{/*${jsxComment.text.replace('*/', '* /')}*/}`

const formatText = jsxText => jsxText.text

class Generator {
  constructor(state) {
    this.state = state
    this.level = 0
    this.output = ''
  }

  traverse(jsxNode) {
    jsxNode.children.forEach(child => this.visit(child))
  }

  visit(jsxNode) {
    this.beginVisit(jsxNode)
    this.level += 1
    this.traverse(jsxNode)
    this.level -= 1
    this.endVisit(jsxNode)
  }

  generate() {
    this.traverse(this.state.root)
    return this.output
  }

  beginVisit(jsxNode) {
    switch (jsxNode.type) {
      case 'Element':
        this.output += `${this.indent()}${formatElementOpen(jsxNode)}\n`
        break
      case 'Comment':
        this.output += `${this.indent()}${formatComment(jsxNode)}\n`
        break
      case 'Text': {
        const trimmedText = jsxNode.text.trim()
        if (trimmedText)
          this.output += `${this.indent()}${formatText(jsxNode)}\n`
        break
      }
    }
  }

  endVisit(jsxNode) {
    switch (jsxNode.type) {
      case 'Element':
        if (!jsxNode.isSelfClosing())
          this.output += `${this.indent()}${formatElementClose(jsxNode)}\n`
        break
    }
  }

  indent() {
    return '  '.repeat(this.level)
  }
}

export default Generator
