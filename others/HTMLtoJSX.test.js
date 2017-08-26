import HTMLtoJSX from './HTMLtoJSX'

describe('HTMLtoJSX', () => {
  it('should handle basic HTML', () => {
    const converter = new HTMLtoJSX()
    expect(converter.convert('<div>Hello world!</div>').trim()).toBe(
      '<div>Hello world!</div>',
    )
  })

  it('should handle HTML comments', () => {
    const converter = new HTMLtoJSX()
    expect(converter.convert('<!-- Hello World -->').trim()).toBe(
      '{/* Hello World */}',
    )
  })

  describe('"stripComments"', () => {
    it('should ignore html comments', () => {
      const converter = new HTMLtoJSX({ stripComments: true })
      expect(converter.convert('<!-- Hello World -->').trim()).toBe('')
    })
  })

  it('should convert tags to lowercase', () => {
    const converter = new HTMLtoJSX()
    expect(converter.convert('<DIV>Hello world!</DIV>').trim()).toBe(
      '<div>Hello world!</div>',
    )
  })

  it('should strip single-line script tag', () => {
    const converter = new HTMLtoJSX()
    expect(
      converter.convert('<div>foo<script>lol</script>bar</div>').trim(),
    ).toBe('<div>foobar</div>')
  })

  it('should strip multi-line script tag', () => {
    const converter = new HTMLtoJSX()
    expect(
      converter
        .convert(`<div>foo<script>\nlol\nlolz\n</script>bar</div>`)
        .trim(),
    ).toBe('<div>foobar</div>')
  })

  describe('escaped characters', () => {
    it('should handle escaped < symbols', () => {
      const converter = new HTMLtoJSX()
      expect(converter.convert('<div>&lt;</div>').trim()).toBe(
        '<div>&lt;</div>',
      )
    })

    it('should handle unescaped copyright symbols', () => {
      const converter = new HTMLtoJSX()
      expect(converter.convert('<div>©</div>').trim()).toBe('<div>©</div>')
    })
  })

  describe('Attribute transformations', () => {
    it('should convert basic "style" attributes', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter.convert('<div style="color: red">Test</div>').trim(),
      ).toBe("<div style={{color: 'red'}}>Test</div>")
    })

    it('should convert CSS shorthand "style" values', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter
          .convert('<div style="padding: 10px 15px 20px 25px;">Test</div>')
          .trim(),
      ).toBe("<div style={{padding: '10px 15px 20px 25px'}}>Test</div>")
    })

    it('should convert numeric "style" attributes', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter.convert('<div style="width: 100px">Test</div>').trim(),
      ).toBe('<div style={{width: 100}}>Test</div>')
    })

    it('should convert dashed "style" attributes', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter.convert('<div style="font-size: 12pt">Test</div>').trim(),
      ).toBe("<div style={{fontSize: '12pt'}}>Test</div>")
    })

    it('should convert vendor-prefix "style" attributes', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter
          .convert(
            '<div style="-moz-hyphens: auto; -webkit-hyphens: auto">Test</div>',
          )
          .trim(),
      ).toBe(
        "<div style={{MozHyphens: 'auto', WebkitHyphens: 'auto'}}>Test</div>",
      )
    })

    it('should convert uppercase vendor-prefix "style" attributes', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter
          .convert(
            '<div style="-MOZ-HYPHENS: auto; -WEBKIT-HYPHENS: auto">Test</div>',
          )
          .trim(),
      ).toBe(
        "<div style={{MozHyphens: 'auto', WebkitHyphens: 'auto'}}>Test</div>",
      )
    })

    it('should convert "style" attributes with vendor prefix-like strings in the middle and mixed case', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter
          .convert(
            '<div style="myclass-MOZ-HYPHENS: auto; myclass-WEBKIT-HYPHENS: auto">Test</div>',
          )
          .trim(),
      ).toBe(
        "<div style={{myclassMozHyphens: 'auto', myclassWebkitHyphens: 'auto'}}>Test</div>",
      )
    })

    it('should convert -ms- prefix "style" attributes', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter.convert('<div style="-ms-hyphens: auto">Test</div>').trim(),
      ).toBe("<div style={{msHyphens: 'auto'}}>Test</div>")
    })

    it('should convert "style" attributes with -ms- in the middle', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter
          .convert('<div style="myclass-ms-hyphens: auto">Test</div>')
          .trim(),
      ).toBe("<div style={{myclassMsHyphens: 'auto'}}>Test</div>")
    })

    it('should convert uppercase "style" attributes', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter.convert('<div style="TEXT-ALIGN: center">Test</div>').trim(),
      ).toBe("<div style={{textAlign: 'center'}}>Test</div>")
    })

    it('should convert "class" attribute', () => {
      const converter = new HTMLtoJSX()
      expect(converter.convert('<div class="awesome">Test</div>').trim()).toBe(
        '<div className="awesome">Test</div>',
      )
    })

    it('should convert "for" attribute', () => {
      const converter = new HTMLtoJSX()
      expect(converter.convert('<label for="potato">Test</label>').trim()).toBe(
        '<label htmlFor="potato">Test</label>',
      )
    })

    it('should convert "maxlength" attribute to "maxLength"', () => {
      const converter = new HTMLtoJSX()
      expect(converter.convert('<input maxlength=2></input>').trim()).toBe(
        '<input maxLength={2} />',
      )
    })

    it('should convert "http-equiv" attribute to "httpEquiv"', () => {
      const converter = new HTMLtoJSX()
      expect(converter.convert('<meta http-equiv="refresh">').trim()).toBe(
        '<meta httpEquiv="refresh" />',
      )
    })

    it('should convert "accept-charset" attribute to "acceptCharset"', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter.convert('<form accept-charset="UTF-8">Test</form>').trim(),
      ).toBe('<form acceptCharset="UTF-8">Test</form>')
    })

    it('should convert "enctype" attribute to "encType"', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter
          .convert(
            '<form method="post" enctype="application/x-www-form-urlencoded">Test</form>',
          )
          .trim(),
      ).toBe(
        '<form method="post" encType="application/x-www-form-urlencoded">Test</form>',
      )
    })

    it('should not camelCasify attributes containing ":"', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter
          .convert('<svg xmlns:xlink="http://www.w3.org/1999/xlink" />')
          .trim(),
      ).toBe('<svg xmlns:xlink="http://www.w3.org/1999/xlink" />')
    })

    it('should maintain value-less attributes', () => {
      const converter = new HTMLtoJSX()
      expect(converter.convert('<input disabled>').trim()).toBe(
        '<input disabled />',
      )
    })

    it('should set <input> "value" to "defaultValue" to allow input editing', () => {
      const converter = new HTMLtoJSX()
      expect(converter.convert('<input value="Darth Vader">').trim()).toBe(
        '<input defaultValue="Darth Vader" />',
      )
    })

    it('should not set "value" to "defaultValue" for non-<input> elements', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter.convert('<select><option value="Hans"></select>').trim(),
      ).toBe('<select><option value="Hans" /></select>')
    })

    it('should set <input> "checked" to "defaultChecked" to allow box checking', () => {
      const converter = new HTMLtoJSX()
      expect(converter.convert('<input type="checkbox" checked>').trim()).toBe(
        '<input type="checkbox" defaultChecked />',
      )
    })

    it('should convert SVG attributes', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter
          .convert(
            '<svg height="100" width="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" fill-rule="evenodd"/></svg>',
          )
          .trim(),
      ).toBe(
        '<svg height={100} width={100}><circle cx={50} cy={50} r={40} stroke="black" strokeWidth={3} fill="red" fillRule="evenodd" /></svg>',
      )
    })
  })

  describe('special tags', () => {
    it('should use "defaultValue" for textareas', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter.convert('<textarea>hello\nworld</textarea>').trim(),
      ).toBe('<textarea defaultValue={"hello\\nworld"} />')
    })

    it('should do magic voodoo for <pre>', () => {
      const converter = new HTMLtoJSX()
      expect(converter.convert('<pre>hello\nworld{foo}</pre>').trim()).toBe(
        '<pre>hello{"\\n"}world{"{"}foo{"}"}</pre>',
      )
    })

    it('should handle <pre> tags with children', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter
          .convert(
            '<pre><b>Hello world  yo</b>this   is   a<i>   test</i></pre>',
          )
          .trim(),
      ).toBe(
        '<pre><b>Hello world{"  "}yo</b>this{"   "}is{"   "}a<i>{"   "}test</i></pre>',
      )
    })

    it('should dangerously set <style> tag contents', () => {
      const converter = new HTMLtoJSX()
      expect(
        converter
          .convert(
            "<style>\nh1 {\n    background: url('http://foo.bar/img.jpg';\n}\n</style>",
          )
          .trim(),
      ).toBe(
        '<style dangerouslySetInnerHTML={{__html: "\\nh1 {\\n    background: url(\'http://foo.bar/img.jpg\';\\n}\\n" }} />',
      )
    })
  })

  describe('"transformAttribute"', () => {
    it('should be possible to change value of an attribute', () => {
      const converter = new HTMLtoJSX({
        transformAttribute(attribute, node) {
          const newAttribute = attribute

          if (node.tagName === 'P' && attribute.name === 'class')
            newAttribute.value = 'foobar'

          if (node.tagName === 'DIV' && attribute.name === 'class') return null

          return newAttribute
        },
      })

      expect(
        converter
          .convert('<div><p class="foo"></p><div class="foo"></div></div>')
          .trim(),
      ).toBe('<div><p className="foobar" /><div /></div>')
    })
  })
})
