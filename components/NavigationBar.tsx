'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';
import Image from 'next/image';
import { useAppStore } from '@/lib/store';

export default function NavigationBar() {
  const { publicKey, disconnect } = useWallet();
  const walletModal = useWalletModal();
  const { setWalletAddress } = useAppStore();

  useEffect(() => {
    if (publicKey) {
      setWalletAddress(publicKey.toBase58());
    } else {
      setWalletAddress(null);
    }
  }, [publicKey, setWalletAddress]);

  const handleConnect = () => {
    walletModal?.setVisible(true);
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      setWalletAddress(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-cyan-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="LYRIN402"
              width={156}
              height={52}
              className="h-[41.6px] w-auto"
              priority
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              LYRIN402
            </h1>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* X Icon */}
            <a
              href="https://x.com/lyrin402"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors relative group"
              aria-label="X (Twitter)"
            >
              <svg
                className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors"
                fill="currentColor"
                viewBox="0 0 24 24"
                style={{ filter: 'drop-shadow(0 0 4px rgba(0, 255, 255, 0.3))' }}
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Connect Wallet Button */}
            {publicKey ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-cyan-400 font-mono">
                  {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
                </span>
                <button
                  onClick={handleDisconnect}
                  className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg transition-colors border border-cyan-500/30"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={handleConnect}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all font-medium text-base neon-breathe gradient-animate relative overflow-hidden"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #00ffff, #0080ff, #00ffff)',
                  backgroundSize: '200% 100%',
                }}
              >
                <span className="relative z-10">Connect Resonance</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

