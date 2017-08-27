import traverse from 'h2x-traverse'
import State from './State'

const defaultOpts = {
  HTMLElement: {
    enter(path, state) {
      state.output = path.node.outerHMTL
    },
  },
}

function generate(ast, opts) {
  const state = new State()
  traverse(ast, { ...defaultOpts, ...opts }, state)
  return state.output
}

export default generate
