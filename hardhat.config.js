/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-ethers");
module.exports = {
  solidity: "0.8.0",
  paths: {
    // Include both the contracts folder and the reactive-lib sources for dependency resolution
    sources: "./src/contracts"
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/0b628bfdb1bf4499ab42192408b20ea0`, // Replace with your Alchemy or Infura API URL
      accounts: ['de0c6e26df050935c8291465eaf07f6635401c6132b39de33bc961b33c163f0f'] // Replace with your private key
    }
  }
};
