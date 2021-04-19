import requests
from bs4 import BeautifulSoup


def load_table(url: str, title: str):
    html = requests.get(url).text
    parsed = BeautifulSoup(html, 'html.parser')
    print(len(parsed.find_all('table')))


load_table(
    'https://en.wikipedia.org/wiki/United_States_Electoral_College', 'ciaone')
