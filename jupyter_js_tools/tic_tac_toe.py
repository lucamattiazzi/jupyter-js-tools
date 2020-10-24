from IPython.display import display, HTML, Javascript
from typing import List
import random
import os

DIR_PATH = os.path.dirname(os.path.realpath(__file__))


def player_fn(match: List[int]) -> str:
    free_cells = [idx for idx in range(len(match)) if match[idx] == 0]
    return random.choice(free_cells)


html = open(f"{DIR_PATH}/tic_tac_toe/index.html", "r").read()
js = open(f"{DIR_PATH}/tic_tac_toe/index.js", "r").read()


def play_game(handler=player_fn):
    global player_fn
    player_fn = handler
    display(HTML(html), update=True)
    display(Javascript(js), update=True)
