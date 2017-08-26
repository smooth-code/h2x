import HTMLtoJSX from '../HTMLtoJSX'

export default (svgstr, opts) => {
  const converter = new HTMLtoJSX(opts)
  return converter.convert(svgstr)
}
