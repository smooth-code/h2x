class Generator {
  output = ''
  level = 0

  indent() {
    this.level += 1
  }

  deindent() {
    this.level -= 1
  }

  writeLine(code) {
    this.output += `${'  '.repeat(this.level)}${code}\n`
  }
}

export default Generator
