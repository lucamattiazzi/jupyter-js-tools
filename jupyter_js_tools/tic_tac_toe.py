from IPython.display import display, HTML, Javascript
import random
import os

DIR_PATH = os.path.dirname(os.path.realpath(__file__))


def random_player(match, symbol):
    free_cells = [idx for idx in range(len(match)) if match[idx] == 0]
    if len(free_cells) == 0:
        return -1
    return random.choice(free_cells)


player_x_fn = 'human'
player_o_fn = 'human'
grid_size = None


html = open(f"{DIR_PATH}/tic_tac_toe/index.html", "r").read()
js = open(f"{DIR_PATH}/tic_tac_toe/index.js", "r").read()


def play_game(handler_x=random_player, handler_o='human', size=3):
    global player_x_fn
    global player_o_fn
    global grid_size
    grid_size = size
    if handler_x is not None:
        player_x_fn = handler_x
    if handler_o is not None:
        player_o_fn = handler_o
    display(HTML(html))
    display(Javascript(js))
