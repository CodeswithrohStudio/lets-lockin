import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface SubmitProofModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (proofUrl: string) => void;
}

export default function SubmitProofModal({ isOpen, onClose, onConfirm }: SubmitProofModalProps) {
    const [proofUrl, setProofUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(proofUrl);
    };

    if (!isOpen) return null;

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
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />

                    <h2 className="text-2xl font-bold text-white mb-2">SUBMIT PROOF</h2>
                    <p className="text-slate-400 text-sm mb-6">
                        Provide a link to your proof (Tweet, GitHub PR, Strava, etc.). This will be verified on-chain.
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-xs uppercase text-slate-500 mb-2 tracking-wider">Proof URL</label>
                            <input
                                type="url"
                                required
                                placeholder="https://x.com/username/status/..."
                                value={proofUrl}
                                onChange={(e) => setProofUrl(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-sm font-mono text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                                autoFocus
                            />
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
                                className="flex-1 py-3 bg-blue-600 text-white font-bold uppercase rounded-lg hover:bg-blue-500 transition-colors shadow-[0_0_20px_-5px_#2563eb]"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}
