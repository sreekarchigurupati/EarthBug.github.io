#!/bin/sh
python3 taggenerator.py
bundle exec jekyll build
git add .
