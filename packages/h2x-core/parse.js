/* eslint-disable no-restricted-syntax */
import { JSDOM } from 'jsdom'

function parse(code) {
  const { window } = new JSDOM()
  const container = window.document.createElement('div')
  container.innerHTML = code
  return container
}

export default parse
