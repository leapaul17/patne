#!/bin/sh
# Construit l'app et la publie sur GitHub Pages (branche gh-pages).
set -e
cd "$(dirname "$0")"
npm run build
touch dist/.nojekyll
cd dist
rm -rf .git
git init -q -b gh-pages
git add -A
git commit -q -m "Deploy $(date +%F)"
git push -q -f https://github.com/leapaul17/patne.git gh-pages
rm -rf .git
