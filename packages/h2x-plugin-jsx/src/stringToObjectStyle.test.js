import stringToObjectStyle from './stringToObjectStyle'

describe('stringToObjectStyle', () => {
  it('should handle single line', () => {
    expect(stringToObjectStyle('display: none')).toEqual({
      display: 'none',
    })
  })

  it('should handle multi lines', () => {
    expect(
      stringToObjectStyle(`
      display: none;
      margin: 0 0 20px;
    `),
    ).toEqual({
      display: 'none',
      margin: '0 0 20px',
    })
  })

  it('should convert pixel value into number', () => {
    expect(stringToObjectStyle('margin: 20px')).toEqual({ margin: 20 })
  })

  it('should keep numeric values', () => {
    expect(stringToObjectStyle('line-height: 1.2')).toEqual({ lineHeight: 1.2 })
  })

  it('should handle prefixes', () => {
    expect(
      stringToObjectStyle(`
      -webkit-transition: all;
      -mz-transition: all;
      -ms-transition: all;
    `),
    ).toEqual({
      WebkitTransition: 'all',
      MzTransition: 'all',
      msTransition: 'all',
    })
  })
})
