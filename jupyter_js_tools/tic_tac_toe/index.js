const { abs, sqrt, floor, sign } = Math

class Match {
  constructor(identifier) {
    this.grid = Array(9).fill(0)
    this.gridDom = this.grid.map((_, idx) => {
      const cell = document.createElement('div')
      cell.className = 'ttt-cell'
      cell.innerText = '-'
      cell.onclick = () => this.handleClick(idx)
      return cell
    })
    this.container = document.getElementById(identifier)
    for (const cell of this.gridDom) {
      this.container.appendChild(cell)
    }
  }

  get side() {
    return sqrt(this.grid.length)
  }

  reset = () => {
    for (const idx in this.grid) {
      this.grid[idx] = 0
      this.gridDom[idx].innerText = '-'
    }
  }

  restartGame = () => {
    alert('Game over!')
    this.reset()
  }

  handleClick = (idx) => {
    if (this.grid[idx] !== 0) return alert('Cell already used!')
    this.grid[idx] = 1
    this.gridDom[idx].innerText = 'X'
    const over = this.checkWin()
    if (over) return
    executePython(`player_fn(${JSON.stringify(this.grid)})`)
      .then((jdx) => {
        if (jdx === '-1') return this.restartGame()
        this.grid[jdx] = -1
        this.gridDom[jdx].innerText = 'O'
        return new Promise((resolve) => setTimeout(resolve, 100))
      })
      .then(this.checkWin)
      .catch((err) => console.log(err))
  }

  checkForWinner = (group) => {
    const sum = group.reduce((a, v) => a + v, 0)
    const winner = floor(abs(sum) / group.length) * sign(sum)
    if (winner === 1) return 'X'
    if (winner === -1) return '0'
    return null
  }

  closeGame = (winner) => {
    alert(`${winner} is the winner!`)
    this.restartGame()
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

new Match('grid')
