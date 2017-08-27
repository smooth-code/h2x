import parse from 'h2x-parse'
import traverse from './'

describe('traverse', () => {
  it('should call enter and exit', () => {
    const enter = jest.fn()
    const exit = jest.fn()
    const ast = parse(`<div id="foo"></div>`)
    const opts = {
      enter,
      exit,
    }
    const state = { foo: 'bar' }
    traverse(ast, opts, state)

    expect(enter).toHaveBeenCalledTimes(2)
    expect(exit).toHaveBeenCalledTimes(2)

    // State should be second argument
    expect(enter.mock.calls[0][1]).toBe(state)
    expect(exit.mock.calls[0][1]).toBe(state)

    // Enter and exit path must be correct
    const enterPath1 = enter.mock.calls[0][0]
    expect(enterPath1.type).toBe('HTMLElement')
    expect(enterPath1.node.tagName).toBe('DIV')
    expect(enterPath1.container[enterPath1.key]).toBe(enterPath1.node)
    expect(enterPath1.parent[enterPath1.listKey]).toBe(enterPath1.container)

    const enterPath2 = enter.mock.calls[1][0]
    expect(enterPath2.type).toBe('HTMLAttribute')
    expect(enterPath2.node.name).toBe('id')
    expect(enterPath2.node.value).toBe('foo')
    expect(enterPath2.container[enterPath2.key]).toBe(enterPath2.node)
    expect(enterPath2.parent[enterPath2.listKey]).toBe(enterPath2.container)
    expect(enterPath2.parent).toBe(enterPath1.node)

    const exitPath1 = enter.mock.calls[0][0]
    expect(exitPath1.type).toBe('HTMLElement')
    expect(exitPath1.node.tagName).toBe('DIV')
    expect(exitPath1.container[exitPath1.key]).toBe(exitPath1.node)
    expect(exitPath1.parent[exitPath1.listKey]).toBe(exitPath1.container)

    const exitPath2 = enter.mock.calls[1][0]
    expect(exitPath2.type).toBe('HTMLAttribute')
    expect(exitPath2.node.name).toBe('id')
    expect(exitPath2.node.value).toBe('foo')
    expect(exitPath2.container[exitPath2.key]).toBe(exitPath2.node)
    expect(exitPath2.parent[exitPath2.listKey]).toBe(exitPath2.container)
    expect(exitPath2.parent).toBe(enterPath1.node)
  })

  it('should call enter and exit on a specific visitor', () => {
    const enter = jest.fn()
    const exit = jest.fn()
    const ast = parse(`<div id="foo"></div>`)
    const opts = {
      HTMLElement: {
        enter,
        exit,
      },
    }
    const state = { foo: 'bar' }
    traverse(ast, opts, state)

    expect(enter).toHaveBeenCalledTimes(1)
    expect(exit).toHaveBeenCalledTimes(1)

    // State should be second argument
    expect(enter.mock.calls[0][1]).toBe(state)
    expect(exit.mock.calls[0][1]).toBe(state)

    // Enter and exit path must be correct
    const enterPath1 = enter.mock.calls[0][0]
    expect(enterPath1.type).toBe('HTMLElement')
    expect(enterPath1.node.tagName).toBe('DIV')
    expect(enterPath1.container[enterPath1.key]).toBe(enterPath1.node)
    expect(enterPath1.parent[enterPath1.listKey]).toBe(enterPath1.container)

    const exitPath1 = enter.mock.calls[0][0]
    expect(exitPath1.type).toBe('HTMLElement')
    expect(exitPath1.node.tagName).toBe('DIV')
    expect(exitPath1.container[exitPath1.key]).toBe(exitPath1.node)
    expect(exitPath1.parent[exitPath1.listKey]).toBe(exitPath1.container)
  })

  it('should be possible to specify an array of visitor methods', () => {
    const a = jest.fn()
    const b = jest.fn()
    const ast = parse(`<div id="foo"></div>`)
    traverse(ast, {
      enter: [a, b],
    })

    expect(a).toHaveBeenCalledTimes(2)
    expect(b).toHaveBeenCalledTimes(2)
  })

  it('should throw an error if a visitor method return a value', () => {
    const ast = parse(`<div id="foo"></div>`)
    expect(() =>
      traverse(ast, {
        enter() {
          return true
        },
      }),
    ).toThrow(/Unexpected return value from visitor method/)
  })

  it('should be possible to replace', () => {
    const enter = jest.fn(path => {
      if (path.node.tagName === 'DIV') {
        path.replace(path.node.ownerDocument.createElement('header'))
      }
    })
    const ast = parse(`<div foo bar></div>`)
    traverse(ast, {
      enter,
    })

    expect(enter).toHaveBeenCalledTimes(2)
    expect(enter.mock.calls[0][0].type).toBe('HTMLElement')
    expect(enter.mock.calls[1][0].type).toBe('HTMLElement')
  })

  it('should be possible to remove elements', () => {
    const enter = jest.fn(path => {
      if (path.node.tagName === 'DIV') {
        path.remove()
      }
    })

    const ast = parse(`<header><div></div><span></span></header>`)

    traverse(ast, { enter })
    expect(enter).toHaveBeenCalledTimes(3)

    traverse(ast, { enter })
    expect(enter).toHaveBeenCalledTimes(5)
  })

  it('should be possible to remove attribute', () => {
    const enter = jest.fn(path => {
      if (path.node.name === 'foo') {
        path.remove()
      }
    })

    const ast = parse(`<div foo bar x></div>`)

    traverse(ast, { HTMLAttribute: { enter } })
    expect(enter).toHaveBeenCalledTimes(3)

    traverse(ast, { HTMLAttribute: { enter } })
    expect(enter).toHaveBeenCalledTimes(5)
  })
})
