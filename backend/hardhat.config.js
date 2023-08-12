require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-ethers");

module.exports = {
  solidity: {
    version: "0.8.19",
    // settings: { optimizer: { enabled: true, runs: 200 } },
  },
  networks: {
    hardhat: {},
  },
  paths: {
    tests: "./test",
  },
  mocha: {
    timeout: 40000,
  },
};
