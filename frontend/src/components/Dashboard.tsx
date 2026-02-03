import React, { useEffect, useState } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';
import { REGISTRY_ADDRESS, REGISTRY_ABI } from '../constants'; // Ensure path is correct
import SubmitProofModal from './SubmitProofModal';

// Reusing Challenge Type? Ideally import shared type.
interface Challenge {
    id: string;
    title: string;
    description: string;
    rewardTokenAmount: string;
    durationDays: number;
    hasSubmitted?: boolean;
}

export default function Dashboard() {
    const { user } = usePrivy();
    const { wallets } = useWallets();
    const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isProofModalOpen, setIsProofModalOpen] = useState(false);
    const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);

    const fetchMyChallenges = async () => {
        if (!wallets[0]) {
            setLoading(false);
            return;
        }

        try {
            // 1. Fetch all challenges (Metadata)
            const res = await fetch('http://localhost:3000/api/challenges');
            const allChallenges: Challenge[] = await res.json();

            // 2. Check "hasJoined" and "hasSubmitted" on-chain
            const provider = await wallets[0].getEthereumProvider();
            const ethProvider = new ethers.BrowserProvider(provider);
            const signer = await ethProvider.getSigner();
            const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, signer);
            const userAddress = await signer.getAddress();

            const joinedChallenges: Challenge[] = [];

            // Parallelize checks
            await Promise.all(allChallenges.map(async (c) => {
                try {
                    const hasJoined = await registry.hasJoined(c.id, userAddress);
                    if (hasJoined) {
                        const hasSubmitted = await registry.hasSubmitted(c.id, userAddress);
                        joinedChallenges.push({ ...c, hasSubmitted });
                    }
                } catch (e) {
                    console.error(`Error checking challenge ${c.id}:`, e);
                }
            }));

            setMyChallenges(joinedChallenges);
        } catch (err) {
            console.error("Failed to load dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyChallenges();
    }, [wallets]);

    const openProofModal = (challengeId: string) => {
        setSelectedChallengeId(challengeId);
        setIsProofModalOpen(true);
    };

    const handleConfirmProof = async (proofUrl: string) => {
        if (!selectedChallengeId || !wallets[0]) return;

        setIsProofModalOpen(false);
        const toastId = "submitting"; // Placeholder for toast

        try {
            const provider = await wallets[0].getEthereumProvider();
            const ethProvider = new ethers.BrowserProvider(provider);
            const signer = await ethProvider.getSigner();
            const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, signer);

            console.log(`Submitting proof for ${selectedChallengeId}: ${proofUrl}`);
            const tx = await registry.submitProof(selectedChallengeId, proofUrl);
            await tx.wait();

            alert("Proof Submitted Successfully! It is now under review.");
            fetchMyChallenges(); // Refresh state

        } catch (err: any) {
            console.error(err);
            alert("Submission failed: " + err.message);
        }
    };

    if (loading) return <div className="text-white pt-32 text-center font-mono animate-pulse">Scanning On-Chain Registry...</div>;

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen">
            <h2 className="text-4xl font-bold text-white mb-8">COMMAND CENTER</h2>

            {myChallenges.length === 0 ? (
                <div className="text-slate-400 font-mono border border-dashed border-slate-800 rounded-2xl p-12 text-center">
                    No active protocols found. <br />
                    <span className="text-emerald-500">Initialize a new challenge in the Catalog.</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myChallenges.map(c => (
                        <div key={c.id} className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
                            <div className={`absolute top-0 left-0 w-1 h-full ${c.hasSubmitted ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                            <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
                            <p className="text-sm text-slate-300/80 mb-4 font-light">{c.description}</p>

                            <div className="flex justify-between items-center bg-white/5 backdrop-blur-sm p-3 rounded mb-6 border border-white/5">
                                <span className="text-xs uppercase text-slate-400">Status</span>
                                <span className={`font-mono font-bold text-sm ${c.hasSubmitted ? 'text-blue-400' : 'text-emerald-400 animate-pulse'}`}>
                                    {c.hasSubmitted ? 'UNDER REVIEW' : 'ACTIVE'}
                                </span>
                            </div>

                            {c.hasSubmitted ? (
                                <button disabled className="w-full py-3 bg-white/5 border border-white/10 text-slate-500 font-bold uppercase cursor-not-allowed rounded">
                                    Proof Pending
                                </button>
                            ) : (
                                <button
                                    onClick={() => openProofModal(c.id)}
                                    className="w-full py-3 bg-white/5 backdrop-blur-sm border border-emerald-500/30 text-emerald-400 font-bold uppercase hover:bg-emerald-500 hover:text-black transition-all rounded shadow-[0_0_15px_-5px_#10b981]"
                                >
                                    Submit Proof
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <SubmitProofModal
                isOpen={isProofModalOpen}
                onClose={() => setIsProofModalOpen(false)}
                onConfirm={handleConfirmProof}
            />
        </div>
    );
}
