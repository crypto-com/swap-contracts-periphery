const UniswapV2Router02 = artifacts.require("UniswapV2Router02");
const fs = require("fs");

module.exports = (deployer, network, account) => {
	const WETH = JSON.parse(fs.readFileSync(`./WETH/contract-${network}.json`, "utf8"));
	const coreFactoryJSON = JSON.parse(fs.readFileSync("./swap-contracts-core/build/contracts/CroDefiSwapFactory.json", "utf8"));
	const coreFactoryNetwork = Object.keys(coreFactoryJSON.networks)[0];
	const coreFactoryAddress = coreFactoryJSON.networks[coreFactoryNetwork].address;

	deployer.deploy(UniswapV2Router02, coreFactoryAddress, WETH.address);
};
