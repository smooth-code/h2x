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
      (ELEMENT_ATTRIBUTE_MAPPING[node.tagName] &&
        ELEMENT_ATTRIBUTE_MAPPING[node.tagName][attribute.name]) ||
      ATTRIBUTE_MAPPING[attribute.name] ||
      hyphenToCamelCase(attribute.name)
    )
  }

  return attribute.name
}

function getAttributeValue(attribute) {
  return attribute.value
}

class JSXAttribute {
  constructor(attribute, node) {
    this.node = node
    this.attribute = attribute
    this.type = 'Attribute'
    this.name = getAttributeName(attribute, node)
    this.value = getAttributeValue(attribute, node)
    this.litteral = isNumeric(attribute.value)
    this.spread = false
  }
}

export default JSXAttribute
