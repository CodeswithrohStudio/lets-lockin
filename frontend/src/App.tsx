import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import Providers from './Providers';
import { motion, AnimatePresence } from 'framer-motion';
import ThreeBackground from './ThreeBackground';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Navbar = ({ onLogin, user, authenticated }: { onLogin: () => void, user: any, authenticated: boolean }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5 bg-black/20">
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]" />
      <span className="font-mono font-bold text-lg tracking-widest text-emerald-500/80">LETS_LOCK_IN</span>
    </div>
    <div>
      {authenticated ? (
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs font-mono text-gray-300">
            {user?.email?.address || user?.wallet?.address?.slice(0, 6) + '...'}
          </span>
        </div>
      ) : (
        <button
          onClick={onLogin}
          className="group relative px-6 py-2 bg-white text-black font-bold font-mono text-sm uppercase tracking-wide overflow-hidden hover:bg-emerald-400 transition-colors duration-300"
        >
          <span className="relative z-10">Connect System</span>
        </button>
      )}
    </div>
  </nav>
);

const Hero = ({ onEnter }: { onEnter: () => void }) => (
  <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
    {/* Background Effects */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#030712] to-[#030712] z-0" />
    <ThreeBackground />
    <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 pointer-events-none" />

    <div className="z-10 text-center px-4 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-6 tracking-tighter leading-[0.9]">
          LOCK IN.
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
      >
        The only competition is the version of you that gives up. <br />
        <span className="text-white font-medium">Commit. Execute. Prove it on-chain.</span>
      </motion.p>

      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ delay: 0.6 }}
        onClick={onEnter}
        className="px-10 py-5 bg-emerald-500 text-black font-bold text-lg rounded-none hover:bg-emerald-400 transition-all shadow-[0_0_40px_-10px_#10b981]"
      >
        ENTER THE ARENA
      </motion.button>
    </div>

    {/* Decorative Grid */}
    <div className="absolute bottom-0 w-full h-[30vh] bg-gradient-to-t from-emerald-900/10 to-transparent pointer-events-none" />
  </div>
);

const ChallengeCard = ({ challenge }: { challenge: any }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-colors duration-500"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    <div className="p-8 relative z-10">
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">{challenge.title}</h3>
        <span className="text-xs font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded bg-black/50">
          ID: {challenge.id.padStart(3, '0')}
        </span>
      </div>

      <p className="text-slate-400 mb-8 min-h-[3rem] line-clamp-2 leading-relaxed">
        {challenge.description}
      </p>

      <div className="grid grid-cols-3 gap-2 mb-8">
        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
          <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Reward</p>
          <p className="text-sm font-mono text-emerald-400 font-bold">{challenge.rewardTokenAmount} USDC</p>
        </div>
        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
          <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Stake</p>
          <p className="text-sm font-mono text-rose-400 font-bold">{challenge.minStake || '0'} USDC</p>
        </div>
        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
          <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">Duration</p>
          <p className="text-sm font-mono text-white">{challenge.durationDays} Days</p>
        </div>
      </div>

      <button className="w-full py-4 bg-emerald-500/10 text-emerald-500 font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-black transition-all duration-300 rounded-lg border border-emerald-500/20">
        Stake & Join Protocol
      </button>
    </div>
  </motion.div>
);

const Catalog = () => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const { login, authenticated, user } = usePrivy();

  useEffect(() => {
    fetch('http://localhost:3000/api/challenges')
      .then(res => res.json())
      .then(data => setChallenges(data))
      .catch(err => console.error("Failed to fetch challenges", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] relative">
      <ThreeBackground className="fixed inset-0 pointer-events-none" />
      <Navbar onLogin={login} user={user} authenticated={authenticated} />

      <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            ACTIVE PROTOCOLS
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="h-1 w-32 bg-emerald-500 origin-left"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {challenges.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3 }}
            >
              <ChallengeCard challenge={c} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

function AppContent() {
  const [view, setView] = useState<'landing' | 'catalog'>('landing');

  return (
    <AnimatePresence mode="wait">
      {view === 'landing' ? (
        <motion.div
          key="landing"
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.5 }}
        >
          <Hero onEnter={() => setView('catalog')} />
        </motion.div>
      ) : (
        <motion.div
          key="catalog"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Catalog />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}
