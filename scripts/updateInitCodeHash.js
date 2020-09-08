var Web3 = require('web3')
const fs = require("fs");

const LIBRARY_PATH = "./contracts/libraries/UniswapV2Library.sol";

const swapPairJSON = JSON.parse(fs.readFileSync("./swap-contracts-core/build/CroDefiSwapPair.json", "utf8"));
const UniswapV2Library = fs.readFileSync(LIBRARY_PATH, "utf8");

const initCodeHash = Web3.utils.keccak256("0x" + swapPairJSON.bytecode);
UniswapV2Library.replace(/([a-z0-9]){64}/g, initCodeHash.split("x")[1]);
fs.writeFileSync(
	LIBRARY_PATH,
	UniswapV2Library.replace(/([a-z0-9]){64}/g,
		initCodeHash.split("x")[1]), "utf8"
);
console.log(`[updateInitCodeHash] initCodeHash has updated to ${initCodeHash.split("x")[1]}`);
