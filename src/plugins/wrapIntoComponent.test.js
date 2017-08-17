import wrapIntoComponent from './wrapIntoComponent'

describe('wrapIntoComponent', () => {
  it('should wrap it into component', () => {
    const result = wrapIntoComponent(
      `<div />`,
      {},
      { filePath: '/test/foo.js' },
    )

    expect(result).toBe(
      `import React from 'react'

const Foo = (props) => <div />

export default Foo`,
    )
  })
})
