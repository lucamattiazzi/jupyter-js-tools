from IPython.display import display, HTML, Javascript
from typing import List
import os

DIR_PATH = os.path.dirname(os.path.realpath(__file__))


def player_fn(match: List[int]) -> str:
    for jdx in range(len(match)):
        if match[jdx] == 0:
            match[jdx] = -1
            return str(jdx)
    return str(-1)


html = open(f"{DIR_PATH}/index.html", "r").read()
js = open(f"{DIR_PATH}/index.js", "r").read()


def play_game(handler=player_fn):
    global player_fn
    player_fn = handler
    display(HTML(html))
    display(Javascript(js))
