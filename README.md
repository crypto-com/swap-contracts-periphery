# DeFi Swap

## Local Development

The following assumes the use of `node@>=10`.

## Install Dependencies

`yarn install-all`

## Compile Contracts

`yarn compile`

## Run Tests

`yarn test`

## Deploy to different environments

locally if you've changed some code (e.g. ganache)
`yarn deploy-preparation-ganache`
`yarn update-init-code`
`yarn truffle-migrate-ganache`

CI (e.g. ropsten)
`yarn deploy-preparation-ropsten`
`yarn verify-init-code`
`yarn truffle-migrate-ropsten`
