'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface KPICardProps {
  title: string;
  value: number | string;
  unit?: string;
  sparkline?: number[];
  trend?: 'up' | 'down' | 'neutral';
  color?: 'cyan' | 'purple' | 'green' | 'blue';
}

export default function KPICard({ title, value, unit, sparkline, trend, color = 'cyan' }: KPICardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    if (typeof value === 'number') {
      setIsAnimating(true);
      const start = typeof displayValue === 'number' ? displayValue : 0;
      const end = value;
      const duration = 500;
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = start + (end - start) * progress;
        setDisplayValue(current);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  // Micro-pulse animation every 3-5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseScale(1.01);
      setTimeout(() => setPulseScale(1), 200);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  const formatValue = (val: number | string): string => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(2) + 'M';
      }
      if (val >= 1000) {
        return (val / 1000).toFixed(2) + 'K';
      }
      if (val < 1) {
        return val.toFixed(3);
      }
      return val.toFixed(2);
    }
    return val;
  };

  const colorClasses = {
    cyan: {
      border: 'border-cyan-500/30',
      hoverBorder: 'hover:border-cyan-500/60',
      glow: 'glow-cyan',
      text: 'text-cyan-400',
      bg: 'bg-cyan-500/5',
    },
    purple: {
      border: 'border-purple-500/30',
      hoverBorder: 'hover:border-purple-500/60',
      glow: 'glow-purple',
      text: 'text-purple-400',
      bg: 'bg-purple-500/5',
    },
    green: {
      border: 'border-green-500/30',
      hoverBorder: 'hover:border-green-500/60',
      glow: 'glow-green',
      text: 'text-green-400',
      bg: 'bg-green-500/5',
    },
    blue: {
      border: 'border-blue-500/30',
      hoverBorder: 'hover:border-blue-500/60',
      glow: 'glow-blue',
      text: 'text-blue-400',
      bg: 'bg-blue-500/5',
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative bg-black/40 backdrop-blur-sm border ${colors.border} ${colors.hoverBorder} rounded-lg p-4 transition-all overflow-hidden ${colors.glow}`}
    >
      {/* Aura effect */}
      <div className={`absolute inset-0 ${colors.bg} opacity-0 hover:opacity-100 transition-opacity duration-300`} />
      
      {/* Inner glow */}
      <div className={`absolute inset-0 ${colors.bg} opacity-20`} style={{
        boxShadow: `inset 0 0 20px ${color === 'cyan' ? 'rgba(0, 255, 255, 0.1)' : color === 'purple' ? 'rgba(160, 75, 255, 0.1)' : color === 'green' ? 'rgba(0, 255, 128, 0.1)' : 'rgba(0, 128, 255, 0.1)'}`
      }} />

      <div className="relative z-10">
        <div className="text-xs text-gray-400 mb-2">{title}</div>
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <motion.span
              animate={{ scale: pulseScale }}
              transition={{ duration: 0.2 }}
              className={`text-2xl font-bold ${colors.text} ${isAnimating ? 'ticker-up' : ''} number-pulse`}
            >
              {formatValue(displayValue)}
            </motion.span>
            {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
          </div>
          {sparkline && sparkline.length > 0 && (
            <div className="w-16 h-8 opacity-50">
              <svg viewBox="0 0 64 32" className="w-full h-full">
                <polyline
                  points={sparkline
                    .slice(-20)
                    .map((v, i) => `${(i / 19) * 64},${32 - (v / Math.max(...sparkline)) * 32}`)
                    .join(' ')}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className={colors.text}
                  style={{ filter: `drop-shadow(0 0 2px currentColor)` }}
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
