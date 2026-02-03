export const REGISTRY_ADDRESS = '0xE5585AC3723BD31Bf529fDa9BE008309a4a9Aab0';
export const RPC_URL = 'https://sepolia.base.org';

export const REGISTRY_ABI = [
    "function challenges(uint256) view returns (uint256 id, string metadataURI, uint256 rewardAmount, uint256 minStake, bool isActive)",
    "function nextChallengeId() view returns (uint256)"
];
