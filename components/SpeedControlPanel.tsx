'use client';

import { useAppStore } from '@/lib/store';
import { SimulationSpeed } from '@/lib/simulator';
import { simulator } from '@/lib/simulator';
import { useEffect } from 'react';

export default function SpeedControlPanel() {
  const { speed, setSpeed, showSpeedPanel } = useAppStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '`' || (e.key === 'Escape' && e.ctrlKey)) {
        useAppStore.getState().setShowSpeedPanel(!showSpeedPanel);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showSpeedPanel]);

  if (!showSpeedPanel) return null;

  const speeds: SimulationSpeed[] = ['slow', 'normal', 'fast', 'hype'];

  const handleSpeedChange = (newSpeed: SimulationSpeed) => {
    setSpeed(newSpeed);
    simulator.setSpeed(newSpeed);
  };

  const handleInjectWaves = () => {
    simulator.injectWaves(50);
  };

  const handleTriggerSpike = () => {
    simulator.triggerSpike();
  };

  const handleResetSeeds = () => {
    simulator.resetSeeds();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/90 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-cyan-400">Simulation Control</h3>
        <button
          onClick={() => useAppStore.getState().setShowSpeedPanel(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Speed</label>
          <div className="flex gap-2">
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`px-3 py-1 text-xs rounded transition-colors ${
                  speed === s
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleInjectWaves}
            className="flex-1 px-3 py-2 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded transition-colors"
          >
            Inject 50 Waves
          </button>
          <button
            onClick={handleTriggerSpike}
            className="flex-1 px-3 py-2 text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded transition-colors"
          >
            Trigger Spike
          </button>
        </div>

        <button
          onClick={handleResetSeeds}
          className="w-full px-3 py-2 text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 rounded transition-colors"
        >
          Reset Seeds
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <p className="text-xs text-gray-500">
          Press ` or Ctrl+Esc to toggle
        </p>
      </div>
    </div>
  );
}

