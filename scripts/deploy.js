const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners(); // Get deployer's wallet address

    const ContractFactory = await ethers.getContractFactory("ReactiveVolatilityTrigger");
    const contract = await ContractFactory.deploy(deployer.address); // Pass only the required argument

    await contract.deployed();

    console.log("Contract deployed to:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
