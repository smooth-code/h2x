import svgo from './plugins/svgo'
import convertToJsx from './plugins/convertToJsx'
import prettier from './plugins/prettier'
import wrapIntoComponent from './plugins/wrapIntoComponent'

async function convert(svgstr, config) {
  let result = svgstr
  const state = { filePath: 'foo' }
  result = await svgo(result, config, state)
  result = await convertToJsx(result, config, state)
  result = await wrapIntoComponent(result, config, state)
  result = await prettier(result, config, state)
  return result
}

export default convert
