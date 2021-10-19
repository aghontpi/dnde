#! /usr/bin/env python3

base = 'https://fonts.googleapis.com/css2?family=_REPLACE_HERE_&display=swap'

list = [
    'Roboto',
    'Festive',
    'Noto Sans Mono',
    'Open Sans',
    'Andada Pro',
    'Lato',
    'Scheherazade New',
    'Montserrat',
    'Roboto Condensed',
    'Source Sans Pro',
    'Poppins',
    'Oswald',
    'Noto sans',
    'Georama',
    'Roboto Mono',
    'Raleway',
    'Nunito',
    'Roboto Slab',
    'PT Sans',
    'Merriweather',
    'Playfair Display',
    'Lora',
    'Rubix',
    'IM Fell English SC',
    'Open Sans Condensed',
    'Inter',
    'Nunito Sans',
    'Work Sans',
    'Quicksand',
    'Fira Sans',
]

print('export const FONTS_CONFIG = [ ')

for item in list:
    print(" { name: '" + item + "', value: '" +
          base.replace('_REPLACE_HERE_', item.replace(' ', '+')) + "' },")
print('];')
