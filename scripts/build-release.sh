#!/bin/bash

target="node8-linux-x64"

../node_modules/.bin/pkg ../src/index.js --target="$target"
