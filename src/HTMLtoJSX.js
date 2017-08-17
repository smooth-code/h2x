/* eslint-disable no-underscore-dangle, no-plusplus */
import { JSDOM } from 'jsdom'

// https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType
const NODE_TYPE = {
  ELEMENT: 1,
  TEXT: 3,
  COMMENT: 8,
}

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

/**
 * Trim the specified substring off the string. If the string does not end
 * with the specified substring, this is a no-op.
 *
 * @param {string} haystack String to search in
 * @param {string} needle   String to search for
 * @return {string}
 */
function trimEnd(haystack, needle) {
  return haystack.endsWith(needle)
    ? haystack.slice(0, -needle.length)
    : haystack
}

/**
 * Convert a hyphenated string to camelCase.
 */
function hyphenToCamelCase(string) {
  return string.replace(/-(.)/g, (match, chr) => chr.toUpperCase())
}

/**
 * Determines if the specified string consists entirely of whitespace.
 */
function isEmpty(string) {
  return !/[^\s]/.test(string)
}

/**
 * Determines if the CSS value can be converted from a
 * 'px' suffixed string to a numeric value
 *
 * @param {string} value CSS property value
 * @return {boolean}
 */
function isConvertiblePixelValue(value) {
  return /^\d+px$/.test(value)
}

/**
 * Determines if the specified string consists entirely of numeric characters.
 */
function isNumeric(input) {
  return (
    input !== undefined &&
    input !== null &&
    (typeof input === 'number' || parseInt(input, 10) == input) // eslint-disable-line eqeqeq
  )
}

const { window } = new JSDOM()

function createElement(tag) {
  return window.document.createElement(tag)
}

const tempEl = createElement('div')
/**
 * Escapes special characters by converting them to their escaped equivalent
 * (eg. "<" to "&lt;"). Only escapes characters that absolutely must be escaped.
 *
 * @param {string} value
 * @return {string}
 */
function escapeSpecialChars(value) {
  // Uses this One Weird Trick to escape text - Raw text inserted as textContent
  // will have its escaped version in innerHTML.
  tempEl.textContent = value
  return tempEl.innerHTML
}

class StyleParser {
  /**
   * Handles parsing of inline styles
   *
   * @param {string} rawStyle Raw style attribute
   * @constructor
   */
  constructor(rawStyle) {
    this.parse(rawStyle)
  }

  /**
   * Parse the specified inline style attribute value
   * @param {string} rawStyle Raw style attribute
   */
  parse(rawStyle) {
    this.styles = {}
    rawStyle.split(';').forEach(line => {
      const style = line.trim()
      const firstColon = style.indexOf(':')
      let key = style.substr(0, firstColon)
      const value = style.substr(firstColon + 1).trim()
      if (key !== '') {
        // Style key should be case insensitive
        key = key.toLowerCase()
        this.styles[key] = value
      }
    }, this)
  }

  /**
   * Convert the style information represented by this parser into a JSX
   * string
   *
   * @return {string}
   */
  toJSXString() {
    const output = Object.entries(this.styles).map(
      ([key, value]) => `${this.toJSXKey(key)}: ${this.toJSXValue(value)}`,
    )
    return output.join(', ')
  }

  /**
   * Convert the CSS style key to a JSX style key
   *
   * @param {string} key CSS style key
   * @return {string} JSX style key
   */
  toJSXKey(key) {
    let safeKey = key

    // Don't capitalize -ms- prefix
    if (/^-ms-/.test(key)) {
      safeKey = key.substr(1)
    }

    return hyphenToCamelCase(safeKey)
  }

  /**
   * Convert the CSS style value to a JSX style value
   *
   * @param {string} value CSS style value
   * @return {string} JSX style value
   */
  toJSXValue(value) {
    if (isNumeric(value)) {
      // If numeric, no quotes
      return value
    } else if (isConvertiblePixelValue(value)) {
      // "500px" -> 500
      return trimEnd(value, 'px')
    }
    // Probably a string, wrap it in quotes
    return `'${value.replace(/'/g, '"')}'`
  }
}

const defaultTransformAttribute = attribute => attribute

class HTMLtoJSX {
  constructor(
    {
      indent = '  ',
      stripComments = false,
      transformAttribute = defaultTransformAttribute,
    } = {},
  ) {
    this.config = { indent, stripComments, transformAttribute }
  }

  /**
   * Reset the internal state of the converter
   */
  reset() {
    this.output = ''
    this.level = 0
    this._inPreTag = false
  }

  /**
   * Main entry point to the converter. Given the specified HTML, returns a
   * JSX object representing it.
   * @param {string} html HTML to convert
   * @return {string} JSX
   */
  convert(html) {
    this.reset()

    const containerEl = createElement('div')
    containerEl.innerHTML = `\n${this._cleanInput(html)}\n`

    if (this._onlyOneTopLevel(containerEl)) {
      // Only one top-level element, the component can return it directly
      // No need to actually visit the container element
      this._traverse(containerEl)
    } else {
      // More than one top-level element, need to wrap the whole thing in a
      // container.
      this.output += this.config.indent
      this.level++
      this._visit(containerEl)
    }
    this.output = `${this.output.trim()}\n`
    return this.output
  }

  /**
   * Cleans up the specified HTML so it's in a format acceptable for
   * converting.
   *
   * @param {string} html HTML to clean
   * @return {string} Cleaned HTML
   */
  _cleanInput(html) {
    let cleanHtml = html
    // Remove unnecessary whitespace
    cleanHtml = cleanHtml.trim()
    // Ugly method to strip script tags. They can wreak havoc on the DOM nodes
    // so let's not even put them in the DOM.
    cleanHtml = cleanHtml.replace(/<script([\s\S]*?)<\/script>/g, '')
    return cleanHtml
  }

  /**
   * Determines if there's only one top-level node in the DOM tree. That is,
   * all the HTML is wrapped by a single HTML tag.
   *
   * @param {DOMElement} containerEl Container element
   * @return {boolean}
   */
  _onlyOneTopLevel(containerEl) {
    // Only a single child element
    if (
      containerEl.childNodes.length === 1 &&
      containerEl.childNodes[0].nodeType === NODE_TYPE.ELEMENT
    ) {
      return true
    }
    // Only one element, and all other children are whitespace
    let foundElement = false
    for (let i = 0, count = containerEl.childNodes.length; i < count; i++) {
      const child = containerEl.childNodes[i]
      if (child.nodeType === NODE_TYPE.ELEMENT) {
        if (foundElement) {
          // Encountered an element after already encountering another one
          // Therefore, more than one element at root level
          return false
        }
        foundElement = true
      } else if (
        child.nodeType === NODE_TYPE.TEXT &&
        !isEmpty(child.textContent)
      ) {
        // Contains text content
        return false
      }
    }
    return true
  }

  /**
   * Gets a newline followed by the correct indentation for the current
   * nesting level
   *
   * @return {string}
   */
  _getIndentedNewline() {
    return `\n${this.config.indent.repeat(this.level - 1)}`
  }

  /**
   * Handles processing the specified node
   *
   * @param {Node} node
   */
  _visit(node) {
    this._beginVisit(node)
    this._traverse(node)
    this._endVisit(node)
  }

  /**
   * Traverses all the children of the specified node
   *
   * @param {Node} node
   */
  _traverse(node) {
    this.level++
    for (let i = 0, count = node.childNodes.length; i < count; i++) {
      this._visit(node.childNodes[i])
    }
    this.level--
  }

  /**
   * Handle pre-visit behaviour for the specified node.
   *
   * @param {Node} node
   */
  _beginVisit(node) {
    switch (node.nodeType) {
      case NODE_TYPE.ELEMENT:
        this._beginVisitElement(node)
        break

      case NODE_TYPE.TEXT:
        this._visitText(node)
        break

      case NODE_TYPE.COMMENT:
        if (!this.config.stripComments) this._visitComment(node)
        break

      default:
        console.warn(`Unrecognised node type: ${node.nodeType}`) // eslint-disable-line no-console
    }
  }

  /**
   * Handles post-visit behaviour for the specified node.
   *
   * @param {Node} node
   */
  _endVisit(node) {
    switch (node.nodeType) {
      case NODE_TYPE.ELEMENT:
        this._endVisitElement(node)
        break
      // No ending tags required for these types
      case NODE_TYPE.TEXT:
      case NODE_TYPE.COMMENT:
      default:
        break
    }
  }

  /**
   * Handles pre-visit behaviour for the specified element node
   *
   * @param {DOMElement} node
   */
  _beginVisitElement(node) {
    const tagName = node.tagName.toLowerCase()
    const attributes = []
    for (let i = 0, count = node.attributes.length; i < count; i++) {
      const attribute = this._getElementAttribute(node, node.attributes[i])
      if (attribute) attributes.push(attribute)
    }

    if (tagName === 'textarea') {
      // Hax: textareas need their inner text moved to a "defaultValue" attribute.
      attributes.push(`defaultValue={${JSON.stringify(node.value)}}`)
    }
    if (tagName === 'style') {
      // Hax: style tag contents need to be dangerously set due to liberal curly brace usage
      attributes.push(
        `dangerouslySetInnerHTML={{__html: ${JSON.stringify(
          node.textContent,
        )} }}`,
      )
    }
    if (tagName === 'pre') {
      this._inPreTag = true
    }

    this.output += `<${tagName}`
    if (attributes.length > 0) {
      this.output += ` ${attributes.join(' ')}`
    }
    if (!this._isSelfClosing(node)) {
      this.output += '>'
    }
  }

  /**
   * Handles post-visit behaviour for the specified element node
   *
   * @param {Node} node
   */
  _endVisitElement(node) {
    const tagName = node.tagName.toLowerCase()
    // De-indent a bit
    // TODO: It's inefficient to do it this way :/
    this.output = trimEnd(this.output, this.config.indent)
    if (this._isSelfClosing(node)) {
      this.output += ' />'
    } else {
      this.output += `</${node.tagName.toLowerCase()}>`
    }

    if (tagName === 'pre') {
      this._inPreTag = false
    }
  }

  /**
   * Determines if this element node should be rendered as a self-closing
   * tag.
   *
   * @param {Node} node
   * @return {boolean}
   */
  _isSelfClosing(node) {
    // If it has children, it's not self-closing
    // Exception: All children of a textarea are moved to a "defaultValue" attribute, style attributes are dangerously set.
    return (
      !node.firstChild ||
      node.tagName.toLowerCase() === 'textarea' ||
      node.tagName.toLowerCase() === 'style'
    )
  }

  /**
   * Handles processing of the specified text node
   *
   * @param {TextNode} node
   */
  _visitText(node) {
    const parentTag = node.parentNode && node.parentNode.tagName.toLowerCase()
    if (parentTag === 'textarea' || parentTag === 'style') {
      // Ignore text content of textareas and styles, as it will have already been moved
      // to a "defaultValue" attribute and "dangerouslySetInnerHTML" attribute respectively.
      return
    }

    let text = escapeSpecialChars(node.textContent)

    if (this._inPreTag) {
      // If this text is contained within a <pre>, we need to ensure the JSX
      // whitespace coalescing rules don't eat the whitespace. This means
      // wrapping newlines and sequences of two or more spaces in variables.
      text = text
        .replace(/\r/g, '')
        .replace(
          /( {2,}|\n|\t|\{|\})/g,
          whitespace => `{${JSON.stringify(whitespace)}}`,
        )
    } else {
      // Handle any curly braces.
      text = text.replace(/(\{|\})/g, brace => `{'${brace}'}`)
      // If there's a newline in the text, adjust the indent level
      if (text.indexOf('\n') > -1) {
        text = text.replace(/\n\s*/g, this._getIndentedNewline())
      }
    }
    this.output += text
  }

  /**
   * Handles processing of the specified text node
   *
   * @param {Text} node
   */
  _visitComment(node) {
    this.output += `{/*${node.textContent.replace('*/', '* /')}*/}`
  }

  /**
   * Gets a JSX formatted version of the specified attribute from the node
   *
   * @param {DOMElement} node
   * @param {object}     attribute
   * @return {string}
   */
  _getElementAttribute(node, attribute) {
    switch (attribute.name) {
      case 'style':
        return this._getStyleAttribute(attribute.value)
      default: {
        const tagName = node.tagName.toLowerCase()
        const transformedAttribute = this.config.transformAttribute(
          attribute,
          node,
        )

        if (!transformedAttribute) return null

        let result = transformedAttribute.name

        if (
          !transformedAttribute.name.startsWith('aria-') &&
          !transformedAttribute.name.startsWith('data-') &&
          !transformedAttribute.name.includes(':')
        ) {
          result =
            (ELEMENT_ATTRIBUTE_MAPPING[tagName] &&
              ELEMENT_ATTRIBUTE_MAPPING[tagName][transformedAttribute.name]) ||
            ATTRIBUTE_MAPPING[transformedAttribute.name] ||
            hyphenToCamelCase(transformedAttribute.name)
        }

        // Numeric values should be output as {123} not "123"
        if (isNumeric(transformedAttribute.value)) {
          result += `={${transformedAttribute.value}}`
        } else if (transformedAttribute.value.length > 0) {
          result += `="${transformedAttribute.value.replace(/"/gm, '&quot;')}"`
        }

        return result
      }
    }
  }

  /**
   * Gets a JSX formatted version of the specified element styles
   *
   * @param {string} styles
   * @return {string}
   */
  _getStyleAttribute(styles) {
    const jsxStyles = new StyleParser(styles).toJSXString()
    return `style={{${jsxStyles}}}`
  }
}

export default HTMLtoJSX
