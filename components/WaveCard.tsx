'use client';

import { motion } from 'framer-motion';
import { WaveEvent } from '@/lib/simulator';
import { formatDistanceToNow } from 'date-fns';
import { useEffect, useState } from 'react';

interface WaveCardProps {
  wave: WaveEvent;
  onHover?: (wave: WaveEvent | null) => void;
  isHovered?: boolean;
}

export default function WaveCard({ wave, onHover, isHovered }: WaveCardProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (wave.status === 'transmission') {
      const startTime = Date.now();
      const duration = 3000;
      
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);
        
        if (newProgress >= 100) {
          clearInterval(interval);
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [wave.status]);

  const getStatusColor = () => {
    switch (wave.status) {
      case 'sent':
        return 'text-gray-400';
      case 'transmission':
        return 'text-yellow-400';
      case 'resonated':
        return 'text-green-400';
      case 'retry':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusLabel = () => {
    switch (wave.status) {
      case 'sent':
        return 'Wave Sent';
      case 'transmission':
        return 'In Transmission';
      case 'resonated':
        return 'Wave Resonated';
      case 'retry':
        return 'Retry';
      default:
        return 'Unknown';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)' }}
      onHoverStart={() => onHover?.(wave)}
      onHoverEnd={() => onHover?.(null)}
      className={`bg-black/40 backdrop-blur-sm border rounded-lg p-4 transition-all ${
        wave.status === 'resonated'
          ? 'border-green-500/40 glow-cyan'
          : isHovered
          ? 'border-cyan-500/60'
          : 'border-cyan-500/20'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <img
            src={wave.userAvatar}
            alt={wave.userName}
            className="w-10 h-10 rounded-full border border-cyan-500/30"
          />
          <div>
            <div className="font-medium text-cyan-300">{wave.userName}</div>
            <div className="text-xs text-gray-500">#{wave.tweetHash}</div>
          </div>
        </div>
        <div className={`text-xs font-semibold ${getStatusColor()}`}>
          {getStatusLabel()}
        </div>
      </div>

      {wave.status === 'transmission' && (
        <div className="mt-3">
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>
      )}

      {wave.status === 'resonated' && wave.reward && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-3 text-sm text-green-400 font-semibold"
        >
          +{wave.reward.toFixed(3)} SOL
        </motion.div>
      )}

      <div className="mt-2 text-xs text-gray-500">
        {formatDistanceToNow(new Date(wave.timestamp), { addSuffix: true })}
      </div>
    </motion.div>
  );
}

