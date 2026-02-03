export const REGISTRY_ADDRESS = '0xE5585AC3723BD31Bf529fDa9BE008309a4a9Aab0';
export const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';

export const REGISTRY_ABI = [
    "function joinChallenge(uint256 challengeId, uint256 stakeAmount) external",
    "function submitProof(uint256 challengeId, string proofURI) external",
    "function userStakes(uint256 challengeId, address user) external view returns (uint256)",
    "function hasJoined(uint256 challengeId, address user) external view returns (bool)",
    "function hasSubmitted(uint256 challengeId, address user) external view returns (bool)",
    "event UserJoined(uint256 indexed challengeId, address indexed user, uint256 stakeAmount)"
];

export const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function allowance(address owner, address spender) external view returns (uint256)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)"
];
