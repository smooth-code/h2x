/* eslint-disable no-restricted-syntax */
import { JSDOM } from 'jsdom'
import { fromHtmlElement } from 'h2x-types'

function parse(code) {
  return fromHtmlElement(JSDOM.fragment(code))
}

export default parse
