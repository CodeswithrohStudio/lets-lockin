const hre = require("hardhat");

async function main() {
    // Official USDC on Base Sepolia
    const USDC_ADDRESS = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const ChallengeRegistry = await hre.ethers.getContractFactory("ChallengeRegistry");
    // Constructor: paymentToken, treasury (deployer), owner (deployer)
    const registry = await ChallengeRegistry.deploy(USDC_ADDRESS, deployer.address, deployer.address);

    await registry.waitForDeployment(); // Wait for deployment

    const address = await registry.getAddress();
    console.log("ChallengeRegistry deployed to:", address);

    // Verification hint
    console.log(`To verify: npx hardhat verify --network baseSepolia ${address} ${USDC_ADDRESS} ${deployer.address} ${deployer.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
