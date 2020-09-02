#!/bin/sh
yarn update-submodules
cd swap-contracts-core
yarn install
./node_modules/.bin/truffle migrate --reset
