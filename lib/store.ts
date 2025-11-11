import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WaveEvent, KPI, TopSource, GraphNode, GraphEdge, SimulationSpeed } from './simulator';

interface AppState {
  // Wallet
  walletAddress: string | null;
  setWalletAddress: (address: string | null) => void;

  // Current page
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Simulation
  speed: SimulationSpeed;
  setSpeed: (speed: SimulationSpeed) => void;
  showSpeedPanel: boolean;
  setShowSpeedPanel: (show: boolean) => void;

  // Data
  kpi: KPI | null;
  waves: WaveEvent[];
  topSources: TopSource[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  wavesPerMinute: number[];
  rewardsStream: number[];
  liveTicker: string[];

  // Filters
  feedFilter: 'all' | 'transmission' | 'resonated' | 'my-waves';
  setFeedFilter: (filter: 'all' | 'transmission' | 'resonated' | 'my-waves') => void;

  // Echo Core
  balance: number;
  signalsDelivered: number;
  pendingDisbursements: number;

  // Update methods
  updateKPI: (kpi: KPI) => void;
  addWave: (wave: WaveEvent) => void;
  updateWave: (wave: WaveEvent) => void;
  updateTopSources: (sources: TopSource[]) => void;
  updateGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void;
  updateWavesPerMinute: (data: number[]) => void;
  updateRewardsStream: (data: number[]) => void;
  updateLiveTicker: (messages: string[]) => void;
  updateBalance: (amount: number) => void;
  incrementSignalsDelivered: () => void;
  updatePendingDisbursements: (value: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      walletAddress: null,
      setWalletAddress: (address) => set({ walletAddress: address }),

      currentPage: 'hub',
      setCurrentPage: (page) => set({ currentPage: page }),

      speed: 'normal',
      setSpeed: (speed) => set({ speed }),
      showSpeedPanel: false,
      setShowSpeedPanel: (show) => set({ showSpeedPanel: show }),

      kpi: null,
      waves: [],
      topSources: [],
      graphNodes: [],
      graphEdges: [],
      wavesPerMinute: [],
      rewardsStream: [],
      liveTicker: [],

      feedFilter: 'all',
      setFeedFilter: (filter) => set({ feedFilter: filter }),

      balance: 0.0,
      signalsDelivered: 0,
      pendingDisbursements: 0,

      updateKPI: (kpi) => set({ kpi }),
      addWave: (wave) => set((state) => ({
        waves: [wave, ...state.waves].slice(0, 500),
      })),
      updateWave: (wave) => set((state) => {
        const index = state.waves.findIndex((w) => w.id === wave.id);
        if (index !== -1) {
          const newWaves = [...state.waves];
          newWaves[index] = wave;
          return { waves: newWaves };
        }
        return state;
      }),
      updateTopSources: (sources) => set({ topSources: sources }),
      updateGraph: (nodes, edges) => set({ graphNodes: nodes, graphEdges: edges }),
      updateWavesPerMinute: (data) => set({ wavesPerMinute: data }),
      updateRewardsStream: (data) => set({ rewardsStream: data }),
      updateLiveTicker: (messages) => set({ liveTicker: messages }),
      updateBalance: (amount) => set((state) => ({ balance: state.balance + amount })),
      incrementSignalsDelivered: () => set((state) => ({ signalsDelivered: state.signalsDelivered + 1 })),
      updatePendingDisbursements: (value) => set({ pendingDisbursements: value }),
    }),
    {
      name: 'lyrin402-storage',
      partialize: (state) => ({
        walletAddress: state.walletAddress,
        currentPage: state.currentPage,
        speed: state.speed,
        feedFilter: state.feedFilter,
      }),
    }
  )
);

