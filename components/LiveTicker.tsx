'use client';

import { motion } from 'framer-motion';

interface LiveTickerProps {
  messages: string[];
}

export default function LiveTicker({ messages }: LiveTickerProps) {
  return (
    <div className="relative overflow-hidden bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-cyan-400 rounded-full live-blink" />
        <span className="text-xs text-cyan-400 font-semibold">LIVE Resonance detected</span>
      </div>
      <div className="overflow-hidden h-6">
        {messages.length > 0 ? (
          <motion.div
            key={messages[0]}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-gray-300 whitespace-nowrap"
          >
            {messages[0]}
          </motion.div>
        ) : (
          <div className="text-sm text-gray-500">Waiting for signals...</div>
        )}
      </div>
    </div>
  );
}

