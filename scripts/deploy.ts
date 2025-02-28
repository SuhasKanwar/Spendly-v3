import { ethers } from '@nomiclabs/hardhat-ethers/internal/ethers';
import { PriceUpdateService } from './priceUpdateService';
import fs from 'fs';
import fetch from 'node-fetch';

async function main() {
    console.log("Starting deployment...");

    // Get the contract factories
    const PriceFeedOracle = await ethers.getContractFactory("PriceFeedOracle");
    const ReactiveBuySell = await ethers.getContractFactory("ReactiveBuySell");

    // Deploy PriceFeedOracle
    const priceFeedOracle = await PriceFeedOracle.deploy();
    await priceFeedOracle.deployed();
    console.log("PriceFeedOracle deployed to:", priceFeedOracle.address);

    // Known contract addresses
    const UNISWAP_ROUTER = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap V3 Router
    const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // Mainnet WETH
    
    // Get token address based on cryptocurrency
    const TOKEN_ADDRESSES: { [key: string]: string } = {
        'bitcoin': "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", // WBTC
        'ethereum': "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
        // Add more tokens as needed
    };

    // Deploy a ReactiveBuySell contract for each supported cryptocurrency
    const deployedContracts: { [key: string]: string } = {};
    
    for (const [crypto, tokenAddress] of Object.entries(TOKEN_ADDRESSES)) {
        // Get initial thresholds from API
        const response = await fetch(`http://localhost:8000/threshold/${crypto}`);
        const data = await response.json();
        
        const buyThreshold = ethers.utils.parseUnits(data.threshold.buy.toString(), 18);
        const sellThreshold = ethers.utils.parseUnits(data.threshold.sell.toString(), 18);

        const reactiveBuySell = await ReactiveBuySell.deploy(
            UNISWAP_ROUTER,
            priceFeedOracle.address,
            WETH_ADDRESS,
            tokenAddress,
            buyThreshold,
            sellThreshold
        );
        await reactiveBuySell.deployed();
        
        deployedContracts[crypto] = reactiveBuySell.address;
        console.log(`ReactiveBuySell for ${crypto} deployed to:`, reactiveBuySell.address);
    }

    // Initialize price update services
    const provider = ethers.provider;
    const [deployer] = await ethers.getSigners();

    console.log("\nDeployment complete!");
    console.log("\n=== Contract Addresses ===");
    console.log("PriceFeedOracle:", priceFeedOracle.address);
    console.log("\nReactiveBuySell Contracts:");
    for (const [crypto, address] of Object.entries(deployedContracts)) {
        console.log(`${crypto}:`, address);
    }

    // Save deployment addresses to a file for the frontend
    const deploymentInfo = {
        priceFeedOracle: priceFeedOracle.address,
        reactiveBuySell: deployedContracts
    };

    fs.writeFileSync(
        'src/contracts/deployment.json',
        JSON.stringify(deploymentInfo, null, 2)
    );
    console.log("\nDeployment addresses saved to src/contracts/deployment.json");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
