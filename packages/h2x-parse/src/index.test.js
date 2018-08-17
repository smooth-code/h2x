import parse from '.'

describe('parse', () => {
  it('should parse HTML code and return a wrapped node', () => {
    const ast = parse(`<div id="foo"></div>ddd`)
    expect(ast.childNodes[0].originalNode.tagName).toBe('DIV')
    expect(ast.childNodes[1].originalNode.textContent).toBe('ddd')
    expect(ast.childNodes[0].attributes[0].originalNode.name).toBe('id')
    expect(ast.childNodes[0].attributes[0].originalNode.value).toBe('foo')
  })
})
