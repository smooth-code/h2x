import JSXElement from './JSXElement'
import JSXAttribute from './JSXAttribute'
import JSXComment from './JSXComment'
import JSXText from './JSXText'

const ATTRIBUTE_MAPPING = {
  for: 'htmlFor',
  class: 'className',
}

const ELEMENT_ATTRIBUTE_MAPPING = {
  input: {
    checked: 'defaultChecked',
    value: 'defaultValue',
    maxlength: 'maxLength',
  },
  form: {
    enctype: 'encType',
  },
}

function isNumeric(input) {
  return (
    input !== undefined &&
    input !== null &&
    (typeof input === 'number' || parseInt(input, 10) == input) // eslint-disable-line eqeqeq
  )
}

function hyphenToCamelCase(string) {
  return string.replace(/-(.)/g, (match, chr) => chr.toUpperCase())
}

function getAttributeName(attribute, node) {
  if (
    !attribute.name.startsWith('aria-') &&
    !attribute.name.startsWith('data-') &&
    !attribute.name.includes(':')
  ) {
    return (
      (ELEMENT_ATTRIBUTE_MAPPING[node.name] &&
        ELEMENT_ATTRIBUTE_MAPPING[node.name][attribute.name]) ||
      ATTRIBUTE_MAPPING[attribute.name] ||
      hyphenToCamelCase(attribute.name)
    )
  }

  return attribute.name
}

function getAttributeValue(attribute) {
  return attribute.value
}

function listToArray(list) {
  const array = []
  for (let i = 0; i < list.length; i += 1) {
    array.push(list[i])
  }
  return array
}

export default {
  HTMLElement: {
    enter(path) {
      const jsxElement = new JSXElement()
      jsxElement.name = path.node.tagName.toLowerCase()
      jsxElement.attributes = listToArray(path.node.attributes)
      jsxElement.children = listToArray(path.node.childNodes)
      path.replace(jsxElement)
    },
  },
  HTMLAttribute: {
    enter(path) {
      const jsxAttribute = new JSXAttribute()
      jsxAttribute.name = getAttributeName(path.node, path.parent)
      jsxAttribute.value = getAttributeValue(path.node)
      jsxAttribute.litteral = isNumeric(jsxAttribute.value)
      path.replace(jsxAttribute)
    },
  },
  HTMLComment: {
    enter(path) {
      const jsxComment = new JSXComment()
      jsxComment.text = path.node.textContent.trim()
      path.replace(jsxComment)
    },
  },
  HTMLText: {
    enter(path) {
      const jsxText = new JSXText()
      jsxText.text = path.node.textContent.trim()
      path.replace(jsxText)
    },
  },
}
