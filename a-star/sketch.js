const CONFIG = {
  cols: 50,
  rows: 50
}
const GRID = new Array(CONFIG.cols)
const OPEN_SET = new Set()
const CLOSED_SET = new Set()
let CELL_HEIGHT, CELL_WIDTH
let START, END

function randBool (probability) {
  return Math.random() < probability
}

class Point {
  constructor (x, y) {
    this.cameFrom = null
    this.coords = { x, y }
    this.isWall = randBool(.3)
    this.scores = {
      f: 0,
      g: 0
    }
  }

  get neighbors () {
    const { x, y } = this.coords
    const result = new Set()

    if (x > 0)
      result.add(GRID[x - 1][y])
    if (x < CONFIG.cols - 1)
      result.add(GRID[x + 1][y])
    if (y > 0)
      result.add(GRID[x][y - 1])
    if (y < CONFIG.rows - 1)
      result.add(GRID[x][y + 1])
    // diags
    if (x > 0 && y > 0)
      result.add(GRID[x - 1][y - 1])
    if (x < CONFIG.cols - 1 && y < CONFIG.rows - 1)
      result.add(GRID[x + 1][y + 1])
    if (x > 0 && y < CONFIG.rows - 1)
      result.add(GRID[x - 1][y + 1])
    if (x < CONFIG.cols - 1 && y > 0)
      result.add(GRID[x + 1][y - 1])

    return result
  }

  get path () {
    let current = this
    const result = [ current ]

    while (current.cameFrom) {
      result.push(current.cameFrom)
      current = current.cameFrom
    }

    return result
  }

  show (color) {
    fill(this.isWall ? 0 : color)
    noStroke()
    rect(
      this.coords.x * CELL_WIDTH,
      this.coords.y * CELL_HEIGHT,
      CELL_WIDTH - 1,
      CELL_HEIGHT - 1
    )
  }
}

function setup () {
  createCanvas(
    document.body.offsetWidth,
    document.body.offsetHeight
  )

  for (let x = 0; x < GRID.length; x++) {
    const rows = []

    for (let y = 0; y < CONFIG.rows; y++) {
      rows.push(new Point(x, y))
    }

    GRID[x] = rows
  }

  START = GRID[0][0]
  OPEN_SET.add(START)
  END = GRID[CONFIG.cols - 1][CONFIG.rows - 1]

  CELL_HEIGHT = height / CONFIG.rows
  CELL_WIDTH = width / CONFIG.cols

  START.isWall = false
  END.isWall = false
}

function heuristic (a, b) {
  return dist(
    a.coords.x,
    a.coords.y,
    b.coords.x,
    b.coords.y
  )
}

function draw () {
  let current

  if (OPEN_SET.size) {
    current = OPEN_SET.values().next().value

    OPEN_SET.forEach(item => {
      if (item.scores.f < current.scores.f) {
        current = item
      }
    })

    if (current === END) {
      noLoop()
      console.log('DONE!')
    }

    OPEN_SET.delete(current)
    CLOSED_SET.add(current)

    current.neighbors.forEach(neighbor => {
      if (!CLOSED_SET.has(neighbor) && !neighbor.isWall) {
        const possibleG = current.scores.g + 1
        let isNewPath = false

        if (OPEN_SET.has(neighbor)) {
          if (possibleG < neighbor.scores.g) {
            neighbor.scores.g = possibleG
            isNewPath = true
          }
        } else {
          neighbor.scores.g = possibleG
          isNewPath = true
          OPEN_SET.add(neighbor)
        }

        if (isNewPath) {
          neighbor.scores.f = neighbor.scores.g + heuristic(neighbor, END)
          neighbor.cameFrom = current
        }
      }
    })
  } else {
    noLoop()
    console.log('failure :(')
    return
  }

  background(0)

  GRID.forEach(col => {
    col.forEach(item => {
      let bgColor

      if (OPEN_SET.has(item)) {
        bgColor = color(0, 255, 0)
      } else if (CLOSED_SET.has(item)) {
        bgColor = color(255, 0, 0)
      } else {
        bgColor = color(255)
      }

      item.show(bgColor)
    })
  })

  current.path.forEach(item => {
    item.show(color(0, 0, 255))
  })
}
