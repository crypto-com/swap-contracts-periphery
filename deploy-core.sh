#!/bin/sh
cd swap-contracts-core
yarn install
yarn compile # Waffle
yarn truffle-compile
./node_modules/.bin/truffle migrate --reset --network $1
