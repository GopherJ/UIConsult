#!/bin/bash

set -e

nodeversion=8
targets=("win" "linux" "osx")
output="uiconsult"

for target in ${targets[@]}
do
    echo "compiling for $target"
    ../node_modules/.bin/pkg ../dist/index.js --target="node$nodeversion-$target-x64" --out-path="../bin/$target-x64" --debug
done
