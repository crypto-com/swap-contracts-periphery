const HDWalletProvider = require("@truffle/hdwallet-provider");

const dotenv = require('dotenv');
dotenv.config();

const infuraProvider = (network, networkId, gasPrice = 5000000000) => {
  if (network === "development") {
    return {}
  }
  return {
    provider: new HDWalletProvider(
     process.env.MNEMONIC,
     `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    ),
    network_id: networkId,
    gasPrice
  }
}

module.exports = {
  // Uncommenting the defaults below
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
   development: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "*"
   },
   ropsten: infuraProvider("ropsten", "3")
  },
  //
  compilers: {
    solc: {
      version: "0.6.6",
      settings: {
        optimizer: {
          enabled: true,
          runs: 999999
        }
      }
    }
  }
};
