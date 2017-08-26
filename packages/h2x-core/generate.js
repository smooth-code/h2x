import Generator from './Generator'

function generate(ast) {
  const generator = new Generator()
  return generator.generate(ast)
}

export default generate
