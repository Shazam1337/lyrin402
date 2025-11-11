'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import KPICard from '@/components/KPICard';

export default function EchoCorePage() {
  const {
    balance,
    signalsDelivered,
    pendingDisbursements,
    updatePendingDisbursements,
    updateBalance,
    incrementSignalsDelivered,
  } = useAppStore();
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    // Update pending disbursements periodically
    const interval = setInterval(() => {
      const current = useAppStore.getState().pendingDisbursements;
      const newValue = Math.max(
        0,
        Math.min(10, current + (Math.random() - 0.5) * 2)
      );
      updatePendingDisbursements(newValue);
    }, 2000);

    return () => clearInterval(interval);
  }, [updatePendingDisbursements]);

  useEffect(() => {
    // Pulse effect based on balance
    const intensity = Math.min(balance / 10, 1);
    setPulseScale(1 + intensity * 0.2);
  }, [balance]);

  const handleSimulatePayout = () => {
    const payout = Math.random() * 0.1 + 0.05;
    updateBalance(payout);
    incrementSignalsDelivered();
    setPulseScale(1.3);
    setTimeout(() => setPulseScale(1 + (balance / 10) * 0.2), 500);
  };

  const handleSendWave = () => {
    // Navigate to transmit page
    window.location.href = '/transmit';
  };

  const glowIntensity = Math.min(balance / 10, 1);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Echo Core
        </h1>
        <p className="text-gray-400">Your resonance balance and activity</p>
      </div>

      {/* Pulsing Core */}
      <div className="flex justify-center mb-12">
        <motion.div
          animate={{
            scale: pulseScale,
            boxShadow: `0 0 ${60 * glowIntensity}px rgba(0, 255, 255, ${0.5 * glowIntensity})`,
          }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          className="relative"
        >
          <div
            className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500"
            style={{
              filter: `blur(${20 * glowIntensity}px)`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-400 mb-2">
                {balance.toFixed(3)}
              </div>
              <div className="text-sm text-gray-400">SOL</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KPICard
          title="Balance (SOL)"
          value={balance}
          unit="SOL"
        />
        <KPICard
          title="Signals Delivered"
          value={signalsDelivered}
        />
        <KPICard
          title="Pending Disbursements"
          value={pendingDisbursements.toFixed(1)}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleSendWave}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all font-semibold"
        >
          Send Wave
        </button>
        <button
          onClick={handleSimulatePayout}
          className="px-8 py-4 bg-black/40 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 rounded-lg transition-all font-semibold"
        >
          Simulate Payout
        </button>
      </div>
    </div>
  );
}

