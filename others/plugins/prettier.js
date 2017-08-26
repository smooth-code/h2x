import prettier from 'prettier'

export default (svgstr, opts) => prettier.format(svgstr, opts)
