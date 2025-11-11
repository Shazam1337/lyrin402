'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { GraphNode, GraphEdge } from '@/lib/simulator';
import { motion } from 'framer-motion';

export default function ResonanceMapPage() {
  const { graphNodes, graphEdges } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [nodeSignals, setNodeSignals] = useState<Record<string, any[]>>({});
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    // Generate mock signals for nodes
    const signals: Record<string, any[]> = {};
    graphNodes.forEach((node) => {
      signals[node.id] = Array.from({ length: 5 }, (_, i) => ({
        id: `signal-${i}`,
        hash: `#${Math.random().toString(16).substr(2, 6).toUpperCase()}`,
        reward: (Math.random() * 0.05).toFixed(3),
        time: Date.now() - i * 60000,
      }));
    });
    setNodeSignals(signals);
  }, [graphNodes]);

  const topNodes = [...graphNodes]
    .sort((a, b) => b.totalRewards - a.totalRewards)
    .slice(0, 10);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Graph */}
        <div className="lg:col-span-3 bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">Resonance Map</h2>
          <div className="relative" style={{ height: '600px' }}>
            <svg
              ref={svgRef}
              width="100%"
              height="100%"
              className="absolute inset-0"
            >
              {/* Edges */}
              {graphEdges.map((edge, index) => {
                const fromNode = graphNodes.find((n) => n.id === edge.from);
                const toNode = graphNodes.find((n) => n.id === edge.to);
                if (!fromNode || !toNode) return null;

                return (
                  <line
                    key={`edge-${index}`}
                    x1={fromNode.x * dimensions.width}
                    y1={fromNode.y * dimensions.height}
                    x2={toNode.x * dimensions.width}
                    y2={toNode.y * dimensions.height}
                    stroke="rgba(0, 255, 255, 0.2)"
                    strokeWidth={edge.strength * 2}
                  />
                );
              })}

              {/* Nodes */}
              {graphNodes.map((node) => (
                <g key={node.id}>
                  <motion.circle
                    cx={node.x * dimensions.width}
                    cy={node.y * dimensions.height}
                    r={node.size / 2}
                    fill={node.color}
                    stroke={selectedNode?.id === node.id ? '#00ffff' : 'rgba(0, 255, 255, 0.3)'}
                    strokeWidth={selectedNode?.id === node.id ? 3 : 1}
                    className="cursor-pointer"
                    onClick={() => setSelectedNode(node)}
                    animate={{
                      r: node.size / 2,
                      opacity: 0.8 + (Date.now() - node.lastActivity) / 3600000 * 0.2,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  {selectedNode?.id === node.id && (
                    <text
                      x={node.x * dimensions.width}
                      y={node.y * dimensions.height - node.size / 2 - 10}
                      textAnchor="middle"
                      fill="#00ffff"
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {node.userName}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>

          {/* Node Details */}
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-black/60 border border-cyan-500/30 rounded-lg p-4"
            >
              <h3 className="text-lg font-semibold text-cyan-400 mb-2">
                {selectedNode.userName}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs text-gray-400">Total Rewards</div>
                  <div className="text-lg font-bold text-green-400">
                    {selectedNode.totalRewards.toFixed(3)} SOL
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Last Activity</div>
                  <div className="text-sm text-gray-300">
                    {new Date(selectedNode.lastActivity).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-2">Recent Signals</div>
                <div className="space-y-1">
                  {nodeSignals[selectedNode.id]?.map((signal) => (
                    <div
                      key={signal.id}
                      className="text-xs text-gray-300 flex justify-between"
                    >
                      <span>{signal.hash}</span>
                      <span className="text-green-400">+{signal.reward} SOL</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Top Participants */}
        <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">Top Participants</h2>
          <div className="space-y-3">
            {topNodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedNode?.id === node.id
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-cyan-500/20 hover:border-cyan-500/40'
                }`}
                onClick={() => setSelectedNode(node)}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                    <span className="text-sm font-medium text-cyan-300">
                      #{index + 1} {node.userName}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {node.totalRewards.toFixed(3)} SOL
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

