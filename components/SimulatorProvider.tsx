'use client';

import { useEffect } from 'react';
import { simulator } from '@/lib/simulator';
import { useAppStore } from '@/lib/store';

export default function SimulatorProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const {
      updateKPI,
      addWave,
      updateWave,
      updateTopSources,
      updateGraph,
      updateWavesPerMinute,
      updateRewardsStream,
      updateLiveTicker,
      updateBalance,
      incrementSignalsDelivered,
    } = useAppStore.getState();

    simulator.start();

    const handleKPIUpdate = (kpi: any) => {
      updateKPI(kpi);
    };

    const handleWave = (wave: any) => {
      addWave(wave);
    };

    const handleWaveUpdate = (wave: any) => {
      updateWave(wave);
      
      if (wave.status === 'resonated' && wave.reward) {
        updateBalance(wave.reward);
        incrementSignalsDelivered();
      }
    };

    const handleWavesPerMinute = (data: number[]) => {
      updateWavesPerMinute(data);
    };

    const handleRewardsStream = (data: number[]) => {
      updateRewardsStream(data);
    };

    const handleTickerUpdate = (messages: string[]) => {
      updateLiveTicker(messages);
    };

    const handleGraphUpdate = (data: any) => {
      updateGraph(data.nodes, data.edges);
    };

    const handleTopSources = () => {
      updateTopSources(simulator.getTopSources());
    };

    simulator.on('kpi-update', handleKPIUpdate);
    simulator.on('wave', handleWave);
    simulator.on('wave-update', handleWaveUpdate);
    simulator.on('waves-per-minute', handleWavesPerMinute);
    simulator.on('rewards-stream', handleRewardsStream);
    simulator.on('ticker-update', handleTickerUpdate);
    simulator.on('graph-update', handleGraphUpdate);

    // Initial data load
    updateKPI(simulator.getKPI());
    simulator.getWaves().forEach((wave) => addWave(wave));
    updateTopSources(simulator.getTopSources());
    const { nodes, edges } = { nodes: simulator.getGraphNodes(), edges: simulator.getGraphEdges() };
    updateGraph(nodes, edges);
    updateWavesPerMinute(simulator.getWavesPerMinute());
    updateRewardsStream(simulator.getRewardsStream());
    updateLiveTicker(simulator.getLiveTicker());

    // Update top sources periodically
    const topSourcesInterval = setInterval(handleTopSources, 5000);

    return () => {
      simulator.off('kpi-update', handleKPIUpdate);
      simulator.off('wave', handleWave);
      simulator.off('wave-update', handleWaveUpdate);
      simulator.off('waves-per-minute', handleWavesPerMinute);
      simulator.off('rewards-stream', handleRewardsStream);
      simulator.off('ticker-update', handleTickerUpdate);
      simulator.off('graph-update', handleGraphUpdate);
      clearInterval(topSourcesInterval);
    };
  }, []);

  return <>{children}</>;
}

