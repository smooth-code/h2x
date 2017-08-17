import convertToJsx from './convertToJsx'

describe('convertToJsx', () => {
  it('should take svg and convert it to jsx', () => {
    const result = convertToJsx(
      `<svg><g stroke="#063855" stroke-width="2"><path d="M51,37 L37,51" id="Shape"></path></g></svg>`,
    )

    expect(result.trim()).toBe(
      '<svg><g stroke="#063855" strokeWidth={2}><path d="M51,37 L37,51" id="Shape" /></g></svg>',
    )
  })

  it('should support options', () => {
    const result = convertToJsx(
      `<svg><g stroke="#063855" stroke-width="2"><path d="M51,37 L37,51" id="Shape"></path></g></svg>`,
      {
        transformAttribute: attribute => {
          if (attribute.name === 'stroke') attribute.value = 'currentColor'
          return attribute
        },
      },
    )

    expect(result.trim()).toBe(
      '<svg><g stroke="currentColor" strokeWidth={2}><path d="M51,37 L37,51" id="Shape" /></g></svg>',
    )
  })
})
