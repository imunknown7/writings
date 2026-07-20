#!/bin/bash

set -e

echo "Syncing posts..."
rsync -av --delete "/Users/sanjiithsridhar/Desktop/me./posts/" "./posts/"

echo "Building site..."
node js/build.js

echo "Committing changes..."
git add .
git commit -m "Update writings" || true

echo "Pushing..."
git push

echo "Done."