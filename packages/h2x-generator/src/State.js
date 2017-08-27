class State {
  output = ''
  level = 0

  up() {
    this.level += 1
  }

  down() {
    this.level -= 1
  }

  writeLine(code) {
    return `${'  '.repeat(this.level)}${code}\n`
  }
}

export default State
