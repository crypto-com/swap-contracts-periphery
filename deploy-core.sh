#!/bin/sh
cd swap-contracts-core
yarn
yarn compile
yarn truffle-compile
yarn replace-factory
./node_modules/.bin/truffle migrate --reset --network $1
