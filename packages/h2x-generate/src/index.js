import traverse from 'h2x-traverse'
import Generator from './Generator'

function generate(ast, opts) {
  const generator = new Generator()
  traverse(ast, opts, generator)
  return generator.output
}

export default generate
