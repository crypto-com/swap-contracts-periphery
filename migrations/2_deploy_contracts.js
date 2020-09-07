const CroDefiSwapRouter02 = artifacts.require("CroDefiSwapRouter02");
const fs = require("fs");

module.exports = (deployer, network, account) => {
	const WETH = JSON.parse(fs.readFileSync(`./WETH/contract-${network}.json`, "utf8"));
	const coreFactoryJSON = JSON.parse(fs.readFileSync("./swap-contracts-core/build/contracts/UniswapV2Factory.json", "utf8"));
	const coreFactoryNetwork = Object.keys(coreFactoryJSON.networks)[0];
	const coreFactoryAddress = coreFactoryJSON.networks[coreFactoryNetwork].address;

	deployer.deploy(CroDefiSwapRouter02, coreFactoryAddress, WETH.address);
};
