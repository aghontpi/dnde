#! /usr/bin/env python3

import json
from bs4 import BeautifulSoup as bs
from pathlib import Path


s = bs(open(str(Path(__file__).resolve().parent) +
            '/socialelement.html', 'r').read(), 'html.parser')

heading1 = heading4 = None
as_json = {}
properties = []
as_json_only_default = {}
for r in s.find_all('tr'):
    if not heading1:
        h = r.find_all('th')
        heading1, heading4 = h[0], h[3]
        continue
    d = r.find_all('td')
    attribute = d[0].get_text()
    value = d[3].get_text()
    as_json[attribute] = '' if value == 'n/a' else value
    if value != 'n/a' and value != '':
        as_json_only_default[attribute] = value
    properties.append(attribute)

print('// prettier-ignore\nconst properties = ' + json.dumps(properties))
print('\n// prettier-ignore\nconst properties_with_default_values = ' +
      json.dumps(as_json))
print('\n// prettier-ignore\nconst assigned_default_values = ' +
      json.dumps(as_json_only_default))
