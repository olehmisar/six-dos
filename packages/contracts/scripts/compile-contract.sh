#!/bin/sh

set -e

cd src/$1 &&
  aztec-nargo compile &&
  aztec-builder codegen ./target/$1-$2.json &&
  jq '.file_map = {}' ./target/$1-$2.json > temp.json && mv temp.json ./target/$1-$2.json &&
  sed -i '' 's/as NoirCompiledContract/as unknown as NoirCompiledContract/g' target/$2.ts &&
  sed -i '' 's/public override methods!/declare public methods/g' target/$2.ts
