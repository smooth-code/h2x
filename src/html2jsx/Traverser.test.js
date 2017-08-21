import { JSDOM } from 'jsdom'
import JSXElement from './JSXElement'
import Traverser from './Traverser'
import State from './State'
import Generator from './Generator'

describe('Traverser', () => {
  it('should traverse', () => {
    const { window } = new JSDOM()
    const containerEl = window.document.createElement('div')

    containerEl.innerHTML = `
    <?xml version="1.0" encoding="UTF-8"?>
    <svg width="88px" height="88px" viewBox="0 0 88 88" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
        <title>Dismiss</title>
        <desc>Created with Sketch.</desc>
        <defs></defs>
        <g id="Blocks" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">
            <g id="Dismiss" stroke="#063855" stroke-width="2">
                <path d="M51,37 L37,51" id="Shape"></path>
                <path d="M51,51 L37,37" id="Shape"></path>
            </g>
        </g>
    </svg>
    `

    const visit = (jsxNode, state) => {
      // if (jsxNode.name === 'svg') {
      //   const newNode = new JSXElement({ tagName: 'foo' })
      //   newNode.children = jsxNode.children
      //   state.replace(newNode)
      // }
    }

    const state = new State(new JSXElement(containerEl))

    const traverser = new Traverser(state)
    traverser.traverse(containerEl)

    const generator = new Generator(state)
    console.log(generator.generate())
  })
})
