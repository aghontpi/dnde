#! /usr/bin/env python3

import os

os.system('rm -rf static/ index.html asset-manifest.json manifest.json robots.txt dnde-*')

os.system('cp -r build/* ./')

os.system('rm -rf static/css/*.map')

os.system('rm -rf static/js/*.map')

os.system('git add static/ index.html *.json dnde-*')

