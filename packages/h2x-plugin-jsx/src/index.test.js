import { transform } from 'h2x-core'
import transformJsx from '.'

describe('transformJsx', () => {
  it('should transform into jsx', () => {
    const code = `
    <?xml version="1.0" encoding="UTF-8"?>
    <svg width="88px" height="88px" viewBox="0 0 88 88" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch -->
        <style>
          .test {
            fill: red;
          }
        </style>
        <title>Dismiss</title>
        <desc>Created with Sketch.</desc>
        <defs>
          <linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%">
            <stop offset="0%" stop-color="#FAD961" />
            <stop offset="100%" stop-color="#F7955D" />
          </linearGradient>
          <filter
            id="b"
            width="157.1%"
            height="180%"
            x="-28.6%"
            y="-20%"
            filterUnits="objectBoundingBox">
            <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1" />
            <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation=".5" />
            <feColorMatrix
              in="shadowBlurOuter1"
              values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0"
            />
          </filter>
        </defs>
        <g id="Blocks" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square">
            <g id="Dismiss" stroke="#063855" stroke-width="2">
                <path d="M51,37 L37,51" id="Shape"></path>
                <path d="M51,51 L37,37" id="Shape"></path>
                <circle
                  cx="43.5"
                  cy="42.5"
                  r="31.5"
                  fill="url(#a)"
                  opacity=".1"
                />
                <circle
                  fill="#f00"
                  cx="43.5"
                  cy="42.5"
                  r="21.5"
                  filter="url(#b)"
                  opacity="1"
                />
            </g>
        </g>
    </svg>
    `

    expect(transform(code, { plugins: [transformJsx] }).trim())
      .toBe(`{/*?xml version="1.0" encoding="UTF-8"?*/}
<svg width="88px" height="88px" viewBox="0 0 88 88" version={1.1} xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
  {/*Generator: Sketch 46.2 (44496) - http://www.bohemiancoding.com/sketch*/}
  <style>
    {\`.test {
            fill: red;
          }\`}
  </style>
  <title>
    {\`Dismiss\`}
  </title>
  <desc>
    {\`Created with Sketch.\`}
  </desc>
  <defs>
    <linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%">
      <stop offset="0%" stopColor="#FAD961" />
      <stop offset="100%" stopColor="#F7955D" />
    </linearGradient>
    <filter id="b" width="157.1%" height="180%" x="-28.6%" y="-20%" filterUnits="objectBoundingBox">
      <feOffset dy={1} in="SourceAlpha" result="shadowOffsetOuter1" />
      <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation={.5} />
      <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.2 0" />
    </filter>
  </defs>
  <g id="Blocks" stroke="none" strokeWidth={1} fill="none" fillRule="evenodd" strokeLinecap="square">
    <g id="Dismiss" stroke="#063855" strokeWidth={2}>
      <path d="M51,37 L37,51" id="Shape" />
      <path d="M51,51 L37,37" id="Shape" />
      <circle cx={43.5} cy={42.5} r={31.5} fill="url(#a)" opacity={.1} />
      <circle fill="#f00" cx={43.5} cy={42.5} r={21.5} filter="url(#b)" opacity={1} />
    </g>
  </g>
</svg>`)
  })

  it('should handle convert style attribute to object', () => {
    const code = `<div id="foo" style="font-size: 10px; line-height: 1.2;"></div>`
    expect(transform(code, { plugins: [transformJsx] }).trim()).toBe(
      `<div id="foo" style={{"fontSize":10,"lineHeight":1.2}} />`,
    )
  })
})
