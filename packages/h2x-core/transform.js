/* eslint-disable no-restricted-syntax */
import parse from './parse'
import traverse from './traverse'
import generate from './generate'

const mergePlugins = plugins => {
  const visitors = {}

  return plugins.reduce((opts, plugin) => {
    const result = plugin()
    if (!result.visitor) return opts
    Object.entries(result.visitor).forEach(([key, visitor]) => {
      visitors[key] = visitors[key] || []
      visitors[key].push(visitor)

      if (!opts[key]) {
        if (key === 'enter' || key === 'exit') {
          opts[key] = (path, state) => {
            for (const v of visitors[key]) {
              if (v && v(path, state)) return true
            }
            return false
          }
        } else {
          opts[key] = {
            enter(path, state) {
              for (const v of visitors[key]) {
                if (v.enter && v.enter(path, state)) return true
              }
              return false
            },
            exit(path, state) {
              for (const v of visitors[key]) {
                if (v.exit && v.exit(path, state)) return true
              }
              return false
            },
          }
        }
      }
    })

    return opts
  }, {})
}

function transform(code, { plugins = [] } = {}) {
  const ast = parse(code)
  traverse(ast, mergePlugins(plugins))
  return generate(ast)
}

export default transform
