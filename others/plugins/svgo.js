import SVGO from 'svgo'

export default async (svgstr, config) => {
  const svgo = new SVGO(config)

  return new Promise((resolve, reject) => {
    svgo.optimize(svgstr, result => {
      if (result.error) reject(result.error)
      else resolve(result.data)
    })
  })
}
