import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    ]
  },
  paths: {
    sources: "./src/contracts"
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/0b628bfdb1bf4499ab42192408b20ea0`,
      accounts: ['de0c6e26df050935c8291465eaf07f6635401c6132b39de33bc961b33c163f0f']
    }
  }
};

export default config;
