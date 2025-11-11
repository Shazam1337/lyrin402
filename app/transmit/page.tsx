'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useAppStore } from '@/lib/store';
import { simulator, WaveEvent } from '@/lib/simulator';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function TransmitPage() {
  const { publicKey } = useWallet();
  const { walletAddress } = useAppStore();
  const router = useRouter();
  
  const [url, setUrl] = useState('');
  const [comment, setComment] = useState('');
  const [walletInput, setWalletInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    if (!url && !publicKey && !walletInput) {
      setError('Please provide a URL or connect a wallet');
      setIsSubmitting(false);
      return;
    }

    // Simulate 5% error rate
    if (Math.random() < 0.05) {
      setTimeout(() => {
        setError('Retry: Network error. Please try again.');
        setIsSubmitting(false);
      }, 1500);
      return;
    }

    // Generate wave
    const wave: WaveEvent = {
      id: `wave-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: publicKey?.toBase58() || walletInput || 'anonymous',
      userName: publicKey ? `User${publicKey.toBase58().slice(0, 4)}` : 'Anonymous',
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${publicKey?.toBase58() || walletInput || 'anon'}`,
      tweetHash: Math.random().toString(16).substr(2, 6).toUpperCase(),
      status: 'sent',
      timestamp: Date.now(),
      createdAt: Date.now(),
    };

    // Inject wave into simulator
    simulator.injectWaves(1);
    
    // Add to store
    const { addWave, updateWave, updateBalance, incrementSignalsDelivered } = useAppStore.getState();
    addWave(wave);

    // Transition to transmission
    setTimeout(() => {
      const updatedWave: WaveEvent = { ...wave, status: 'transmission' };
      updateWave(updatedWave);
    }, 1500);

    // Transition to resonated
    setTimeout(() => {
      const updatedWave: WaveEvent = {
        ...wave,
        status: 'resonated',
        reward: Math.random() * 0.04 + 0.01,
      };
      updateWave(updatedWave);
      if (publicKey || walletInput) {
        updateBalance(updatedWave.reward!);
        incrementSignalsDelivered();
      }
    }, 4000);

    setIsSubmitting(false);
    setUrl('');
    setComment('');
    setWalletInput('');

    // Navigate to feed
    setTimeout(() => {
      router.push('/feed');
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Transmit Wave
        </h1>
        <p className="text-gray-400">Send a signal to the resonance network</p>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-6 space-y-6"
      >
        {/* URL Input */}
        <div>
          <label className="block text-sm font-medium text-cyan-400 mb-2">
            Post URL
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://x.com/..."
            className="w-full px-4 py-3 bg-black/60 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Comment Input */}
        <div>
          <label className="block text-sm font-medium text-cyan-400 mb-2">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your thoughts..."
            rows={4}
            className="w-full px-4 py-3 bg-black/60 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
          />
        </div>

        {/* Wallet Address (if not connected) */}
        {!publicKey && (
          <div>
            <label className="block text-sm font-medium text-cyan-400 mb-2">
              Wallet Address (optional)
            </label>
            <input
              type="text"
              value={walletInput}
              onChange={(e) => setWalletInput(e.target.value)}
              placeholder="Enter Solana wallet address"
              className="w-full px-4 py-3 bg-black/60 border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono text-sm"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending Wave...' : 'Send Wave'}
        </button>

        {publicKey && (
          <div className="text-center text-sm text-gray-400">
            Connected as: {publicKey.toBase58().slice(0, 8)}...{publicKey.toBase58().slice(-4)}
          </div>
        )}
      </motion.form>
    </div>
  );
}

