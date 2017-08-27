import parse from 'h2x-parse'
import generate from './'

describe('generate', () => {
  it('should generate code from AST', () => {
    const ast = parse(`<div id="foo"></div>`)
    expect(generate(ast)).toBe(`<div id="foo"></div>`)
  })
})
