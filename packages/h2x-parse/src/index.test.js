import parse from './'

describe('parse', () => {
  it('should parse HTML code and return a wrapped node', () => {
    const ast = parse(`<div id="foo"></div>`)
    expect(ast.children[0].tagName).toBe('DIV')
    expect(ast.children[0].attributes[0].name).toBe('id')
    expect(ast.children[0].attributes[0].value).toBe('foo')
  })
})
