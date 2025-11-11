'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import WaveCard from '@/components/WaveCard';
import { WaveEvent } from '@/lib/simulator';
import { useWallet } from '@solana/wallet-adapter-react';

export default function FeedPage() {
  const { waves, feedFilter, setFeedFilter, walletAddress } = useAppStore();
  const { publicKey } = useWallet();
  const [hoveredWave, setHoveredWave] = useState<WaveEvent | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [waves, autoScroll]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;
      setAutoScroll(scrollTop < 100);
    }
  };

  const filteredWaves = waves.filter((wave) => {
    if (feedFilter === 'all') return true;
    if (feedFilter === 'transmission') return wave.status === 'transmission';
    if (feedFilter === 'resonated') return wave.status === 'resonated';
    if (feedFilter === 'my-waves' && walletAddress) {
      return wave.userId === walletAddress;
    }
    return false;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {(['all', 'transmission', 'resonated'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setFeedFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              feedFilter === filter
                ? 'bg-cyan-500 text-white'
                : 'bg-black/40 text-gray-400 hover:bg-black/60'
            }`}
          >
            {filter === 'all' ? 'All' : filter === 'transmission' ? 'In Transmission' : 'Resonated'}
          </button>
        ))}
        {publicKey && (
          <button
            onClick={() => setFeedFilter('my-waves')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              feedFilter === 'my-waves'
                ? 'bg-cyan-500 text-white'
                : 'bg-black/40 text-gray-400 hover:bg-black/60'
            }`}
          >
            My Waves
          </button>
        )}
      </div>

      {/* Feed */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto"
      >
        {filteredWaves.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No waves found. Send your first wave!</p>
          </div>
        ) : (
          filteredWaves.map((wave) => (
            <div key={wave.id} className="relative">
              <WaveCard
                wave={wave}
                onHover={setHoveredWave}
                isHovered={hoveredWave?.id === wave.id}
              />
              {/* Link line effect */}
              {hoveredWave?.id === wave.id && (
                <div className="absolute left-1/2 top-full w-0.5 h-4 bg-cyan-500/30 transform -translate-x-1/2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

