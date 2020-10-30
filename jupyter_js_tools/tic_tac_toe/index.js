const { abs, sqrt, floor, sign, random } = Math

const CONTAINER = 'container'
const GRID = 'grid'

function reverseDict(dict) {
  return Object.fromEntries(Object.entries(dict).map((v) => v.reverse()))
}

function waitToDraw() {
  return new Promise((resolve) => setTimeout(resolve, 100))
}

function parseSide(value) {
  const number = Number(value)
  if (isNaN(number) || number < 2) return 3
  return number
}

function getFunctionName(player) {
  return `tic_tac_toe.player_${player.toLowerCase()}_fn`
}

const HUMAN_ACTION = 'human'
const FN_ACTION = 'function'

class Match {
  currentPlayer = 'X'
  playerValue = {
    X: 1,
    O: -1,
  }
  playerActions = {
    X: HUMAN_ACTION,
    O: HUMAN_ACTION,
  }

  constructor() {
    this.container = document.getElementById(CONTAINER)
    this.setSide()
      .then(this.setPlayers)
      .then(this.setFirstPlayer)
      .then(this.generateTitle)
      .then(this.generateGrid)
      .then(this.generateButton)
      .then(this.start)
  }

  get currentPlayerAction() {
    return this.playerActions[this.currentPlayer]
  }

  get currentPlayerValue() {
    return this.playerValue[this.currentPlayer]
  }

  get valuePlayer() {
    return { ...reverseDict(this.playerValue), 0: 0 }
  }

  get gridForPython() {
    return this.grid.map((value) => this.valuePlayer[value])
  }

  setPlayers = async () => {
    const promises = Object.keys(this.playerValue).map(this.setPlayer)
    return Promise.all(promises)
  }

  setPlayer = async (player) => {
    const fnName = getFunctionName(player)
    return executePython(fnName).then((fn) => {
      this.playerActions[player] = fn === 'human' || fn === 'None' ? HUMAN_ACTION : FN_ACTION
    })
  }

  setFirstPlayer = () => {
    this.currentPlayer = random() > 0.5 ? 'X' : 'O'
  }

  generateTitle = () => {
    this.title = document.createElement('div')
    this.title.id = 'title'
    this.setTitle()
    this.container.appendChild(this.title)
  }

  generateButton = () => {
    this.button = document.createElement('button')
    this.button.id = 'button'
    this.button.onclick = () => this.restart()
    this.button.innerText = 'RESTART'
    this.container.appendChild(this.button)
  }

  setTitle = () => {
    this.title.innerText = `Current player turn: ${this.currentPlayer}`
  }

  generateGrid = () => {
    this.grid = Array(this.side ** 2).fill(0)
    this.gridContainer = document.createElement('div')
    this.gridContainer.id = 'grid'
    this.container.appendChild(this.gridContainer)
    this.gridContainer.style.width = `${this.side * 100}px`
    this.gridDom = this.grid.map((_, idx) => {
      const cell = document.createElement('div')
      cell.className = 'ttt-cell'
      cell.innerText = '-'
      cell.onclick = this.handleClick(idx)
      return cell
    })
    for (const cell of this.gridDom) {
      this.gridContainer.appendChild(cell)
    }
  }

  start = () => {
    this.reset(true)
    this.runTurn()
  }

  restart = () => {
    this.reset()
    this.runTurn()
  }

  setSide = () => {
    return executePython('tic_tac_toe.grid_size').then((side) => {
      this.side = parseSide(side)
    })
  }

  updateCurrentPlayer = () => {
    this.currentPlayer = Object.keys(this.playerValue).filter((v) => v !== this.currentPlayer)[0]
  }

  nextTurn = () => {
    const someoneHasWon = this.checkWin()
    if (someoneHasWon) return
    this.updateCurrentPlayer()
    this.setTitle()
    this.runTurn()
  }

  runTurn = () => {
    if (this.currentPlayerAction === HUMAN_ACTION) return
    const functionName = getFunctionName(this.currentPlayer)
    const pythonCode = `${functionName}(${JSON.stringify(this.gridForPython)}, ${
      this.currentPlayer
    })`
    executePython(pythonCode)
      .then((idx) => {
        const parsedIdx = Number(idx)
        if (parsedIdx < 0) return this.reset()
        return this.setGridCell(parsedIdx)
      })
      .then(this.nextTurn)
  }

  reset = (firstTime = false) => {
    for (const idx in this.grid) {
      this.grid[idx] = 0
      this.gridDom[idx].innerText = '-'
    }
    if (!firstTime) this.setFirstPlayer()
  }

  handleClick = (idx) => () => {
    if (this.currentPlayerAction !== HUMAN_ACTION) return
    if (this.grid[idx] !== 0) return
    this.setGridCell(idx).then(this.nextTurn)
  }

  setGridCell = (idx) => {
    this.grid[idx] = this.currentPlayerValue
    this.gridDom[idx].innerText = this.currentPlayer
    return waitToDraw()
  }

  checkForWinner = (group) => {
    const sum = group.reduce((a, v) => a + v, 0)
    const winner = floor(abs(sum) / group.length) * sign(sum)
    if (winner === 1) return 'X'
    if (winner === -1) return '0'
    return null
  }

  closeGame = (winner) => {
    this.title.innerText = `${winner} is the winner!`
    return true
  }

  checkWin = () => {
    // check rows
    for (let idx = 0; idx < this.side; idx++) {
      const row = this.grid.slice(idx * this.side, idx * this.side + this.side)
      const winner = this.checkForWinner(row)
      if (winner) return this.closeGame(winner)
    }
    // check columns
    for (let idx = 0; idx < this.side; idx++) {
      const column = this.grid.filter((_, jdx) => jdx % this.side === idx)
      const winner = this.checkForWinner(column)
      if (winner) return this.closeGame(winner)
    }
    // check diagonals
    {
      const firstDiagonal = Array(this.side)
        .fill(0)
        .map((_, idx) => {
          const gridIdx = idx * this.side + idx
          return this.grid[gridIdx]
        })
      const winner = this.checkForWinner(firstDiagonal)
      if (winner) return this.closeGame(winner)
    }
    {
      const secondDiagonal = Array(this.side)
        .fill(0)
        .map((_, idx) => {
          const gridIdx = (idx + 1) * (this.side - 1)
          return this.grid[gridIdx]
        })
      const winner = this.checkForWinner(secondDiagonal)
      if (winner) return this.closeGame(winner)
    }
  }
}

function executePython(python) {
  return new Promise((resolve, reject) => {
    const cb = {
      iopub: {
        output: (data) => {
          if (data.content.text) return resolve(data.content.text.trim())
          reject(data)
        },
      },
    }
    Jupyter.notebook.kernel.execute(`print(${python})`, cb)
  })
}

new Match()
