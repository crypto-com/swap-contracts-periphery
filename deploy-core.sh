#!/bin/sh
cd swap-contracts-core
yarn install
yarn clean
./node_modules/.bin/truffle migrate --reset --network $1
