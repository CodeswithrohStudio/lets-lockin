import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface StakeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (amount: string) => void;
    minStake: string; // Kept for interface compatibility but ignored for logic if global min is enforced
    tokenSymbol?: string;
}

export default function StakeModal({ isOpen, onClose, onConfirm, minStake, tokenSymbol = 'USDC' }: StakeModalProps) {
    // User Requirement: "1$ is minimum for all. Not variable amount"
    const GLOBAL_MIN = "1";

    // Default to the global min or a reasonable starting value? 
    // Let's default to the global min so they can just click confirm if they want.
    const [amount, setAmount] = useState(GLOBAL_MIN);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(amount);
    };

    if (!isOpen) return null;

    // Use createPortal to render outside the parent hierarchy (document.body)
    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 max-w-md w-full relative overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />

                    <h2 className="text-2xl font-bold text-white mb-2">COMMIT YOUR STAKE</h2>
                    <p className="text-slate-400 text-sm mb-6">
                        How much are you willing to lock in? The higher the stake, the higher the commitment.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-xs uppercase text-slate-500 mb-2 tracking-wider">Stake Amount ({tokenSymbol})</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    min={GLOBAL_MIN}
                                    step="0.1"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-2xl font-mono text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    autoFocus
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono">
                                    {tokenSymbol}
                                </span>
                            </div>
                            <p className="text-xs text-rose-400 mt-2 font-mono">
                                Minimum Required: {GLOBAL_MIN} {tokenSymbol}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 bg-white/5 text-slate-300 font-bold uppercase rounded-lg hover:bg-white/10 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-emerald-500 text-black font-bold uppercase rounded-lg hover:bg-emerald-400 transition-colors shadow-[0_0_20px_-5px_#10b981]"
                            >
                                Confirm & Join
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}
