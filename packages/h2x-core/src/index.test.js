import { NODE_TYPE } from 'h2x-types'
import { transform } from '.'

describe('transform', () => {
  it('should transform', () => {
    class JSXNode {
      static [NODE_TYPE] = 'JSXElement'

      constructor(name) {
        this.name = name
      }
    }

    const simpleJsx = () => ({
      visitor: {
        HTMLElement: {
          enter(path) {
            path.replace(new JSXNode('div'))
          },
        },
      },
      generator: {
        JSXElement: {
          enter(path, generator) {
            generator.writeLine(`<${path.node.name} />`)
          },
        },
      },
    })
    const code = `<div></div>`
    const result = transform(code, { plugins: [simpleJsx] })
    expect(result).toBe(`<div />\n`)
  })

  it('should support state', () => {
    class JSXNode {
      static [NODE_TYPE] = 'JSXElement'

      constructor(name) {
        this.name = name
      }
    }

    const simpleJsx = () => ({
      visitor: {
        HTMLElement: {
          enter(path, state) {
            state.tags.push(path.node.tagName)
            path.replace(new JSXNode('div'))
          },
        },
      },
      generator: {
        JSXElement: {
          enter(path, generator) {
            generator.writeLine(`<${path.node.name} />`)
          },
        },
      },
    })
    const state = { tags: [] }
    const code = `<div></div>`
    const result = transform(code, { plugins: [simpleJsx], state })
    expect(result).toBe(`<div />\n`)
    expect(state.tags).toEqual(['DIV'])
  })
})
