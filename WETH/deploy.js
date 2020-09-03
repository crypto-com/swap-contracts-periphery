const fs = require("fs");
const Web3 = require("web3");
const config = require("../truffle-config");

(async () => {
	const network = process.env.NETWORK || "development";
	if (network !== "development") {
		console.log(`It's running network ${network}, using existing WETH Contract`);
		return;
	}
	const web3 = new Web3(`http://${config.networks[network].host}:${config.networks[network].port}`)
	const WETH = JSON.parse(fs.readFileSync("./WETH/WETH.json", "utf8"));
	const account = await web3.eth.getAccounts()

	let contract = new web3.eth.Contract(WETH.abi);
	contract = await contract.deploy({
		data: WETH.bytecode,
		arguments: [],
	}).send({
		from: account[0],
		gas: 0x2fffff,
	});
	fs.writeFileSync("./WETH/contract-development.json", JSON.stringify({
		address: contract._address,
		timestamp: new Date().getTime()
	}),"utf8");
	process.exit(0);
})();
