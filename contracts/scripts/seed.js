const hre = require("hardhat");

async function main() {
    const REGISTRY_ADDRESS = '0xE5585AC3723BD31Bf529fDa9BE008309a4a9Aab0'; // New deployed address

    const [deployer] = await hre.ethers.getSigners();
    console.log("Seeding challenges with account:", deployer.address);

    const ChallengeRegistry = await hre.ethers.getContractFactory("ChallengeRegistry");
    const registry = ChallengeRegistry.attach(REGISTRY_ADDRESS);

    const challenges = [
        {
            title: '30 Days of Code',
            description: 'Commit code every day for 30 days. No excuses.',
            reward: 100,
            minStake: 1, // 1 USDC global min
            duration: 30
        },
        {
            title: 'Morning Run Streak',
            description: 'Run 5km every morning before 8 AM for 2 weeks.',
            reward: 50,
            minStake: 1,
            duration: 14
        },
        {
            title: 'Design Daily',
            description: 'Create one UI component every day for 3 weeks.',
            reward: 75,
            minStake: 1,
            duration: 21
        }
    ];

    for (const c of challenges) {
        const metadata = JSON.stringify({
            title: c.title,
            description: c.description
        });

        // Create a data URI or just raw JSON string if we handle it
        // Let's use raw JSON string for simplicity of parsing for now, or data:application/json
        // Using raw JSON string
        const metadataURI = metadata;

        // Reward is 0 for now as we aren't funding the treasury in this seed script yet (requires approving USDC to contract)
        // We set rewardAmount parameter, but actual funding happens separately.
        // NOTE: registry.createChallenge emits event but doesn't require funding transfer IN THIS VERSION of contract?
        // Let's check contract. createChallenge(uri, reward, minStake). It DOES NOT transfer funds.
        // So we can set any reward amount.

        console.log(`Creating challenge: ${c.title}...`);
        const tx = await registry.createChallenge(metadataURI, c.reward, c.minStake);
        await tx.wait();
        console.log(`Created!`);
    }

    console.log("Seeding complete.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
