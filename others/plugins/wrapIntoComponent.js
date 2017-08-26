import path from 'path'

const template = ({ componentName, svg }) => `import React from 'react'

const ${componentName} = (props) => ${svg}

export default ${componentName}`

const firstUpperCase = str => `${str.charAt(0).toUpperCase()}${str.slice(1)}`

export default (svgstr, opts, state) => {
  const componentName = firstUpperCase(path.parse(state.filePath).name)
  return template({ componentName, svg: svgstr })
}
