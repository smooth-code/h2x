import parse from 'h2x-parse'
import generate from '.'

describe('generate', () => {
  it('should generate code from AST', () => {
    const ast = parse(`
      <div><header></header></div>
    `)

    const opts = {
      HTMLElement: {
        enter(path, generator) {
          generator.writeLine(`<${path.node.tagName.toLowerCase()}>`)
          generator.indent()
        },

        exit(path, generator) {
          generator.deindent()
          generator.writeLine(`</${path.node.tagName.toLowerCase()}>`)
        },
      },
    }

    expect(generate(ast, opts)).toBe(
      `<div>
  <header>
  </header>
</div>
`,
    )
  })
})
