#! /usr/bin/env python3

import json
from bs4 import BeautifulSoup as bs
from pathlib import Path

s = bs(open(str(Path(__file__).resolve().parent) +
            '/button.html', 'r').read(), 'html.parser')

heading1 = heading4 = None
as_json = {}
properties = []
for r in s.find_all('tr'):
    if not heading1:
        h = r.find_all('th')
        heading1, heading4 = h[0], h[3]
        continue
    d = r.find_all('td')
    as_json[d[0].get_text()] = '' if d[3].get_text(
    ) == 'n/a' else d[3].get_text()
    properties.append(d[0].get_text())

print(json.dumps(as_json))
print(properties)
