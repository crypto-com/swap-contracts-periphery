#!/bin/sh
cd swap-contracts-core
yarn install
./node_modules/.bin/truffle migrate --reset --network $1
