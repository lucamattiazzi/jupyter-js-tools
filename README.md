# Jupyter JS Tools

A small collection of useful (?) tools written in js to use in a jupyter notebook.

## TicTacToe

Play tic-tac-toe! The two players can be either both humans, one human and a function or two functions; it will show a tic-tac-toe game grid under the notebook cell.

### How does it work

Import `tic_tac_toe` from `jupyter_js_tools` and call the function `tic_tac_toe.play_game`. This function will accep 3 parameters: the first two must be two `handlers`, the third one defines the side of the grid (default = 3).

An `handler` can be one of two things: `None` if you want to let an human play, or a function that accepts the grid as an array of `['X', 'O', 0]` and the player symbol and returns the index of the next move to be played, or -1 if there is no move to be made.

### Code example

```python
from jupyter_js_tools import tic_tac_toe
import random

def random_player(match, symbol):
    free_cells = [idx for idx in range(len(match)) if match[idx] == 0]
    if len(free_cells) == 0:
        return -1
    return random.choice(free_cells)

tic_tac_toe.play_game('human', random_player)
```