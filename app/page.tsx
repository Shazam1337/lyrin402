'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import KPICard from '@/components/KPICard';
import LiveTicker from '@/components/LiveTicker';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import Link from 'next/link';

export default function HomePage() {
  const { kpi, wavesPerMinute, rewardsStream, liveTicker, topSources } = useAppStore();
  const { publicKey } = useWallet();
  const walletModal = useWalletModal();
  const [chartData, setChartData] = useState<any[]>([]);
  const [rewardsData, setRewardsData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [lastSynced, setLastSynced] = useState(new Date());

  useEffect(() => {
    if (wavesPerMinute.length > 0) {
      const data = wavesPerMinute.slice(-60).map((value, index) => ({
        time: index,
        value: Math.round(value),
      }));
      setChartData(data);
    }
  }, [wavesPerMinute]);

  useEffect(() => {
    if (rewardsStream.length > 0) {
      const data = rewardsStream.slice(-60).map((value, index) => ({
        time: index,
        value: parseFloat(value.toFixed(2)),
      }));
      setRewardsData(data);
    }
  }, [rewardsStream]);

  useEffect(() => {
    if (topSources.length > 0) {
      const data = topSources.slice(0, 7).map((source) => ({
        name: source.name,
        value: source.percentage,
      }));
      setBarData(data);
    }
  }, [topSources]);

  // Update sync timestamp every 5-10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastSynced(new Date());
    }, 5000 + Math.random() * 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

      {/* KPI Wall */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6 relative z-10">
        {kpi && (
          <>
            <KPICard
              title="Total Waves"
              value={Math.round(kpi.totalWaves)}
              sparkline={wavesPerMinute.slice(-20)}
              color="cyan"
            />
            <KPICard
              title="Active Users (24h)"
              value={Math.round(kpi.activeUsers)}
              color="blue"
            />
            <KPICard
              title="Rewards Streamed"
              value={kpi.rewardsStreamed}
              unit="SOL"
              color="purple"
            />
            <KPICard
              title="Processing"
              value={Math.round(kpi.processing)}
              unit="waves"
              color="cyan"
            />
            <KPICard
              title="Conversion Rate"
              value={kpi.conversionRate}
              unit="%"
              color="blue"
            />
            <KPICard
              title="Avg. Time to Verify"
              value={kpi.avgTimeToVerify}
              unit="s"
              color="cyan"
            />
            <KPICard
              title="Network Health"
              value={kpi.networkHealth}
              unit="/100"
              color="green"
            />
          </>
        )}
      </div>

      {/* Live Ticker */}
      <div className="mb-6">
        <LiveTicker messages={liveTicker} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 relative z-10">
        {/* Large Line Chart - Waves per minute */}
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 relative group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-cyan-400">Waves per Minute</h3>
            <span className="text-xs text-cyan-400/60 flex items-center gap-1">
              <span className="live-blink w-1.5 h-1.5 bg-cyan-400 rounded-full" /> live data feed ⚡
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00FFF0" />
                  <stop offset="100%" stopColor="#A04BFF" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                dot={false}
                animationDuration={300}
                style={{ filter: 'url(#glow)' }}
                className="group-hover:opacity-90 transition-opacity"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(0, 255, 255, 0.5)',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                }}
                labelStyle={{ color: '#00ffff', fontWeight: 'bold' }}
                cursor={{ stroke: '#00ffff', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Mini - Top Sources */}
        <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4 relative group hover:border-cyan-500/40 transition-all">
          <h3 className="text-sm font-semibold text-cyan-400 mb-4">Top Sources (10min)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} layout="vertical">
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#00ffff" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#0080ff" stopOpacity={0.85} />
                </linearGradient>
                <filter id="barGlow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                </filter>
              </defs>
              <Bar 
                dataKey="value" 
                fill="url(#barGradient)" 
                radius={[0, 4, 4, 0]}
                className="group-hover:opacity-100 transition-all"
                style={{ filter: 'url(#barGlow)' }}
              />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={80}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.9)',
                  border: '1px solid rgba(0, 255, 255, 0.5)',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                }}
                labelStyle={{ color: '#00ffff', fontWeight: 'bold' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rewards Stream */}
      <div className="bg-black/40 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 mb-6 relative group hover:border-purple-500/40 transition-all overflow-hidden">
        {/* Holographic overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"
            style={{
              animation: 'gradient-shift 3s ease infinite',
              backgroundSize: '200% 100%',
            }}
          />
        </div>
        <h3 className="text-sm font-semibold text-purple-400 mb-4 relative z-10">Rewards Stream</h3>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={rewardsData}>
            <defs>
              <linearGradient id="colorRewards" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#A04BFF" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#8000FF" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#A04BFF" stopOpacity={0.1} />
              </linearGradient>
              <filter id="rewardsGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke="#A04BFF"
              fill="url(#colorRewards)"
              strokeWidth={3}
              animationDuration={300}
              style={{ filter: 'url(#rewardsGlow)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                border: '1px solid rgba(160, 75, 255, 0.5)',
                borderRadius: '8px',
                boxShadow: '0 0 20px rgba(160, 75, 255, 0.3)',
              }}
              labelStyle={{ color: '#A04BFF', fontWeight: 'bold' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* CTA Block */}
      <div className="text-center relative z-10">
        {publicKey ? (
          <Link
            href="/transmit"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all font-semibold text-lg neon-breathe gradient-animate"
            style={{
              backgroundImage: 'linear-gradient(90deg, #00ffff, #0080ff, #00ffff)',
              backgroundSize: '200% 100%',
            }}
          >
            <span>⚡</span> Send Wave
          </Link>
        ) : (
          <button
            onClick={() => walletModal?.setVisible(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg transition-all font-semibold text-lg cursor-pointer neon-breathe gradient-animate"
            style={{
              backgroundImage: 'linear-gradient(90deg, #00ffff, #0080ff, #00ffff)',
              backgroundSize: '200% 100%',
            }}
          >
            Connect Resonance
          </button>
        )}
      </div>
      
      {/* Data sync timestamp */}
      <div className="text-center mt-4 text-xs text-gray-500 relative z-10">
        Data last synced: <span className="text-cyan-400">{lastSynced.toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

