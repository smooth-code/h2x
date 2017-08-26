/* eslint-disable no-restricted-syntax */
import { JSDOM } from 'jsdom'
import { getVisitorKeys } from './types'
import TraversalContext from './TraversalContext'
import Generator from './Generator'

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

export const traverse = (ast, opts = {}, state = {}) => {
  const keys = getVisitorKeys(ast)
  if (!keys) return

  const context = new TraversalContext({ opts, state })
  for (const key of keys) {
    if (context.visit(ast, key)) return
  }
}

export const generate = ast => {
  const generator = new Generator()
  return generator.generate(ast)
}

export const parse = code => {
  const { window } = new JSDOM()
  const div = window.document.createElement('div')
  div.innerHTML = code
  return div
}

export const transform = (code, { plugins = [] } = {}) => {
  const ast = parse(code)
  traverse(ast, mergePlugins(plugins))
  return generate(ast)
}
