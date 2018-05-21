const CONFIG = {
  cols: 5,
  rows: 5
}
const GRID = new Array(CONFIG.cols)
const OPEN_SET = new Set()
const CLOSED_SET = new Set()

class Point {
  constructor (x, y) {
    this.coords = { x, y }
    this.scores = {
      f: 0,
      g: 0,
      h: 0
    }
  }
}

function setup () {
  for (let xPos = 0; xPos < GRID.length; xPos++) {
    const rows = []

    for (let yPos = 0; yPos < CONFIG.rows; yPos++) {
      rows.push(new Point(xPos, yPos))
    }

    GRID[xPos] = rows
  }

  console.log(GRID)
}

setup()
