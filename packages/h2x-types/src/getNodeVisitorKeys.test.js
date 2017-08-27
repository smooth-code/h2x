import parse from 'h2x-parse'
import { getNodeVisitorKeys, VISITOR_KEYS } from './'

describe('getNodeVisitorKeys', () => {
  it('should use constructor.VISITOR_KEYS if available', () => {
    class MyNode {
      static [VISITOR_KEYS] = ['foo']
    }

    const node = new MyNode()
    expect(getNodeVisitorKeys(node)).toEqual(['foo'])
  })

  it('should support HTML Nodes', () => {
    const ast = parse(`
      <div id="foo"></div>
    `)
    expect(getNodeVisitorKeys(ast)).toEqual(['childNodes', 'attributes'])
    expect(getNodeVisitorKeys(ast.children[0].attributes[0])).toBe(null)
  })
})
