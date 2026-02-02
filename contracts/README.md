# Smart Contracts

This directory contains the smart contracts for "Let's Lock In".

## Deployed Contracts (Base Sepolia)

| Contract | Address | Payment Token (USDC) |
|----------|---------|----------------------|
| **ChallengeRegistry** | `0x4CAD277e1c152E114Ce5C62788C0BD9660535124` | `0x036CbD53842c5426634e7929541eC2318f3dCF7e` |

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Compile:
   ```bash
   npx hardhat compile
   ```
3. Test:
   ```bash
   npx hardhat test
   ```

## Deploy

```bash
PRIVATE_KEY=your_key npx hardhat run scripts/deploy.js --network baseSepolia
```
