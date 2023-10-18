require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
const fs = require('fs');
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";

const dotenv = require('dotenv');
dotenv.config(); // Load the environment variables



task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  const PRIVATE_KEY = process.env.PRIVATE_KEY

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/eAl6_gYIHRd_MCMt1jkptwNKqdjXs1eg",
      accounts:[PRIVATE_KEY],
      chainId: 80001, // Chain ID of the Polygon Mumbai testnet
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};