'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const phrases = [
  'Resonance is the currency of connection.',
  'Every signal amplifies the network.',
  'Waves propagate through digital space.',
  'Echoes create value in motion.',
  'The network breathes with activity.',
  'Transmission is transformation.',
  'Connect. Transmit. Resonate.',
];

export default function ManifestPage() {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const phrase = phrases[currentPhraseIndex];
    let charIndex = 0;
    setDisplayedText('');
    setIsTyping(true);

    const typeInterval = setInterval(() => {
      if (charIndex < phrase.length) {
        setDisplayedText(phrase.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentPhraseIndex]);

  useEffect(() => {
    if (!isTyping) {
      const timeout = setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isTyping]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        {/* Typing Effect */}
        <motion.div
          key={currentPhraseIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-1 h-12 bg-cyan-400 ml-2 animate-pulse" />
            )}
          </h1>
        </motion.div>

        {/* Links */}
        <div className="flex flex-col items-center gap-6">
          <motion.a
            href="https://x.com/lyrin402"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-black/40 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 rounded-lg transition-all font-semibold"
          >
            Follow on X
          </motion.a>

          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-black/40 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 rounded-lg transition-all font-semibold"
          >
            Documentation
          </motion.a>
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center text-gray-400 text-sm max-w-2xl"
        >
          <p>
            LYRIN402 is a living simulation of network resonance. Every wave sent,
            every signal transmitted, contributes to the collective echo of the network.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

