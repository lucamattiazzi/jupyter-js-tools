from IPython.display import display, HTML, Javascript
import os
import json

DIR_PATH = os.path.dirname(os.path.realpath(__file__))


html = open(f"{DIR_PATH}/carbon/index.html", "r").read()
js_require = open(f"{DIR_PATH}/carbon/require.js", "r").read()
js = open(f"{DIR_PATH}/carbon/index.js", "r").read()


def _plot(data, chart):
    display(HTML(html))
    display(Javascript(js_require))
    js_with_data = js % (json.dumps(data), chart)
    display(Javascript(js_with_data))


def pie(data):
    _plot(data, 'PieChart')
