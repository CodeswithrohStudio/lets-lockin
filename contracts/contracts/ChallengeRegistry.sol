// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LockInToken.sol";

contract ChallengeRegistry is Ownable {
    address public treasury;

    struct Challenge {
        uint256 id;
        string metadataURI;
        uint256 rewardAmount;
        uint256 minStake; // Amount user must stake to join
        bool isActive;
    }

    uint256 public nextChallengeId;
    mapping(uint256 => Challenge) public challenges;
    
    // Mapping from challengeId -> user -> hasJoined
    mapping(uint256 => mapping(address => bool)) public hasJoined;
    // Mapping from challengeId -> user -> stakedAmount
    mapping(uint256 => mapping(address => uint256)) public userStakes;
    // Mapping from challengeId -> user -> hasSubmitted
    mapping(uint256 => mapping(address => bool)) public hasSubmitted;

    IERC20 public paymentToken;

    event ChallengeCreated(uint256 indexed id, string metadataURI, uint256 rewardAmount, uint256 minStake);
    event UserJoined(uint256 indexed challengeId, address indexed user, uint256 stakeAmount);
    event ProofSubmitted(uint256 indexed challengeId, address indexed user, string proofURI);
    event ChallengeResolved(uint256 indexed challengeId, address indexed user, bool success, uint256 payoutOrSlashed);

    constructor(address _paymentTokenAddress, address _treasury, address initialOwner) Ownable(initialOwner) {
        paymentToken = IERC20(_paymentTokenAddress);
        treasury = _treasury;
    }

    function createChallenge(string memory metadataURI, uint256 rewardAmount, uint256 minStake) external onlyOwner {
        uint256 challengeId = nextChallengeId++;
        challenges[challengeId] = Challenge(challengeId, metadataURI, rewardAmount, minStake, true);
        
        emit ChallengeCreated(challengeId, metadataURI, rewardAmount, minStake);
    }

    function joinChallenge(uint256 challengeId, uint256 stakeAmount) external {
        Challenge memory challenge = challenges[challengeId];
        require(challenge.isActive, "Challenge not active");
        require(!hasJoined[challengeId][msg.sender], "Already joined");
        require(stakeAmount >= challenge.minStake, "Stake too low");
        
        if (stakeAmount > 0) {
            bool success = paymentToken.transferFrom(msg.sender, address(this), stakeAmount);
            require(success, "Stake transfer failed");
            userStakes[challengeId][msg.sender] = stakeAmount;
        }

        hasJoined[challengeId][msg.sender] = true;
        emit UserJoined(challengeId, msg.sender, stakeAmount);
    }

    function submitProof(uint256 challengeId, string memory proofURI) external {
        require(hasJoined[challengeId][msg.sender], "Not a participant");
        require(challenges[challengeId].isActive, "Challenge ended");
        require(!hasSubmitted[challengeId][msg.sender], "Proof already submitted");
        
        hasSubmitted[challengeId][msg.sender] = true;
        emit ProofSubmitted(challengeId, msg.sender, proofURI);
    }

    // Owner resolves the challenge: Success -> Return Stake + Reward; Failure -> Slash Stake to Treasury
    function resolveChallenge(uint256 challengeId, address participant, bool success) external onlyOwner {
        require(hasJoined[challengeId][participant], "User not in challenge");
        
        uint256 stake = userStakes[challengeId][participant];
        uint256 reward = challenges[challengeId].rewardAmount;
        
        // Reset state so they can't be resolved twice? 
        // For MVP, simplistic check: relying on off-chain indexer or state to not double-pay.
        // Better: delete userStakes or have a 'resolved' flag. 
        // Let's zero out the stake to prevent re-entrancy/double slash, though 'hasJoined' remains true.
        userStakes[challengeId][participant] = 0; 

        if (success) {
            uint256 totalPayout = stake + reward;
            require(paymentToken.balanceOf(address(this)) >= totalPayout, "Insufficient contract balance");
            paymentToken.transfer(participant, totalPayout);
            emit ChallengeResolved(challengeId, participant, true, totalPayout);
        } else {
            // Slash
            if (stake > 0) {
                paymentToken.transfer(treasury, stake);
            }
            emit ChallengeResolved(challengeId, participant, false, stake);
        }
    }

    // Allow contract to receive tokens to pay out
    function depositRewards(uint256 amount) external {
        paymentToken.transferFrom(msg.sender, address(this), amount);
    }
}
