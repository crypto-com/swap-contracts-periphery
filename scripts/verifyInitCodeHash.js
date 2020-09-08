var Web3 = require('web3')
const fs = require("fs");

const SWAP_PAIR_PATH = "./swap-contracts-core/build/CroDefiSwapPair.json";
const LIBRARY_PATH = "./contracts/libraries/CroDefiSwapLibrary.sol";

const swapPairJSON = JSON.parse(fs.readFileSync(SWAP_PAIR_PATH, "utf8"));
const CroDefiSwapLibrary = fs.readFileSync(LIBRARY_PATH, "utf8");

const initCodeHash = Web3.utils.keccak256("0x" + swapPairJSON.bytecode).split("x")[1];
const initCodeHashInSol = CroDefiSwapLibrary.match(/([a-z0-9]){64}/g);
if (initCodeHashInSol.length === 0 || (initCodeHash !== initCodeHashInSol[0])) {
	throw `[verifyInitCodeHash] initCodeHash not match! ${initCodeHashInSol[0]} !== ${initCodeHash}`;
}
console.log(`[verifyInitCodeHash] initCodeHash matches ${initCodeHash}`);
