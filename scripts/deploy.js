const { ethers } = require("hardhat");
const { writeFileSync } = require('fs');
const { parseUnits } = require('ethers');

async function main() {
    console.log("Starting deployment...");

    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", await deployer.getAddress());

    // Get the contract factories
    const PriceFeedOracle = await ethers.getContractFactory("PriceFeedOracle");
    const ReactiveBuySell = await ethers.getContractFactory("ReactiveBuySell");

    // Chainlink Price Feed addresses on Sepolia
    const PRICE_FEEDS = {
        'bitcoin': '0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43', // BTC/USD
        'ethereum': '0x694AA1769357215DE4FAC081bf1f309aDC325306'  // ETH/USD
    };

    // Known contract addresses for Sepolia
    const UNISWAP_ROUTER = "0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E"; // Sepolia Uniswap V3 Router
    const WETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"; // Sepolia WETH
    
    // Get token address based on cryptocurrency
    const TOKEN_ADDRESSES = {
        'bitcoin': "0x922A02e221F2762261Cc6E51f5317397B1FE0acb", // Sepolia WBTC
        'ethereum': "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9", // Sepolia WETH
    };

    // Deploy price feed oracles
    const priceFeedOracles = {};
    
    for (const [crypto, feedAddress] of Object.entries(PRICE_FEEDS)) {
        console.log(`Deploying PriceFeedOracle for ${crypto}...`);
        const oracle = await PriceFeedOracle.deploy(feedAddress);
        await oracle.deploymentTransaction().wait();
        priceFeedOracles[crypto] = await oracle.getAddress();
        console.log(`PriceFeedOracle for ${crypto} deployed to:`, await oracle.getAddress());
    }

    // Deploy a ReactiveBuySell contract for each supported cryptocurrency
    const deployedContracts = {};
    
    for (const [crypto, tokenAddress] of Object.entries(TOKEN_ADDRESSES)) {
        console.log(`Deploying ReactiveBuySell for ${crypto}...`);
        try {
            // Default thresholds (since API might not be available during deployment)
            const buyThreshold = parseUnits("0.95", 18); // 5% below current price
            const sellThreshold = parseUnits("1.05", 18); // 5% above current price

            const reactiveBuySell = await ReactiveBuySell.deploy(
                UNISWAP_ROUTER,
                priceFeedOracles[crypto],
                WETH_ADDRESS,
                tokenAddress,
                buyThreshold,
                sellThreshold
            );
            await reactiveBuySell.deploymentTransaction().wait();
            
            deployedContracts[crypto] = await reactiveBuySell.getAddress();
            console.log(`ReactiveBuySell for ${crypto} deployed to:`, await reactiveBuySell.getAddress());
        } catch (error) {
            console.error(`Error deploying ReactiveBuySell for ${crypto}:`, error);
        }
    }

    console.log("\nDeployment complete!");
    console.log("\n=== Contract Addresses ===");
    console.log("Price Feed Oracles:");
    for (const [crypto, address] of Object.entries(priceFeedOracles)) {
        console.log(`${crypto}:`, address);
    }
    console.log("\nReactiveBuySell Contracts:");
    for (const [crypto, address] of Object.entries(deployedContracts)) {
        console.log(`${crypto}:`, address);
    }

    // Save deployment addresses to a file for the frontend
    const deploymentInfo = {
        priceFeedOracle: priceFeedOracles,
        reactiveBuySell: deployedContracts
    };

    writeFileSync(
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
