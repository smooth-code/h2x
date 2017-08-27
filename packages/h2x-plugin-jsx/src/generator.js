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

export default {
  JSXElement: {
    enter(path, generator) {
      generator.writeLine(formatElementOpen(path.node))
      generator.indent()
    },
    exit(path, generator) {
      generator.deindent()
      if (path.node.children.length !== 0)
        generator.writeLine(formatElementClose(path.node))
    },
  },
  JSXComment: {
    enter(path, generator) {
      generator.writeLine(formatComment(path.node))
    },
  },
  JSXText: {
    enter(path, generator) {
      const trimmedText = path.node.text.trim()
      if (trimmedText) generator.writeLine(formatText(path.node))
    },
  },
}
