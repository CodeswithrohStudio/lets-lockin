import React, { useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { REGISTRY_ADDRESS, USDC_ADDRESS, REGISTRY_ABI, ERC20_ABI } from '../constants';
import { motion } from 'framer-motion';

interface JoinButtonProps {
    challengeId: string;
    minStake: string; // "50" USDC
    refetch: () => void;
}

import StakeModal from './StakeModal';

export default function JoinButton({ challengeId, minStake, refetch }: JoinButtonProps) {
    const { login, authenticated } = usePrivy();
    const { wallets } = useWallets();
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'approving' | 'joining' | 'success'>('idle');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        if (!authenticated) {
            login();
            return;
        }
        setIsModalOpen(true);
    };

    const handleConfirm = async (amount: string) => {
        setIsModalOpen(false);
        const wallet = wallets[0];
        if (!wallet) return;

        // Switch to Base Sepolia (84532) if needed
        const chainId = '0x14a34'; // 84532
        if (wallet.chainId !== chainId) {
            await wallet.switchChain(parseInt(chainId, 16));
        }

        setLoading(true);
        try {
            const ethProvider = await wallet.getEthereumProvider();
            const provider = new ethers.BrowserProvider(ethProvider);
            const signer = await provider.getSigner();

            const stakeAmount = ethers.parseUnits(amount, 6); // USDC has 6 decimals

            const encryptionToken = new ethers.Contract(USDC_ADDRESS, ERC20_ABI, signer);
            const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, signer);

            // 1. Check Allowance
            setStatus('approving');
            const userAddress = await signer.getAddress();
            const allowance = await encryptionToken.allowance(userAddress, REGISTRY_ADDRESS);

            if (allowance < stakeAmount) {
                console.log("Approving...");
                const tx = await encryptionToken.approve(REGISTRY_ADDRESS, stakeAmount);
                await tx.wait();
            }

            // 2. Join
            setStatus('joining');
            console.log("Joining with stake:", amount);
            // Updated to pass stakeAmount as second argument
            const joinTx = await registry.joinChallenge(challengeId, stakeAmount);
            await joinTx.wait();

            setStatus('success');
            setTimeout(() => {
                setStatus('idle');
                refetch();
            }, 3000);

        } catch (error) {
            console.error(error);
            alert("Transaction failed. " + (error as any).message);
            setStatus('idle');
        } finally {
            setLoading(false);
        }
    };

    const getLabel = () => {
        if (!authenticated) return "Connect Wallet to Join";
        if (status === 'approving') return "Approving USDC...";
        if (status === 'joining') return "Staking & Joining...";
        if (status === 'success') return "Protocol Locked In!";
        return `Stake & Join`; // Simplified label as amount is chosen later
    }

    return (
        <>
            <button
                onClick={handleClick}
                disabled={loading || status === 'success'}
                className={`w-full py-4 font-bold uppercase tracking-wider transition-all duration-300 rounded-lg border 
                    ${status === 'success'
                        ? 'bg-emerald-500 text-black border-emerald-500'
                        : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-black border-emerald-500/20'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {getLabel()}
            </button>

            <StakeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirm}
                minStake={minStake}
            />
        </>
    );
}
