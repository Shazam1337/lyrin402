export type WaveStatus = 'sent' | 'transmission' | 'resonated' | 'retry';

// Simple EventEmitter for browser
class EventEmitter {
  private events: Record<string, Function[]> = {};

  on(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  off(event: string, listener: Function) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(l => l !== listener);
    }
  }

  emit(event: string, ...args: any[]) {
    if (this.events[event]) {
      this.events[event].forEach(listener => listener(...args));
    }
  }
}

export interface WaveEvent {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  tweetHash: string;
  status: WaveStatus;
  reward?: number;
  timestamp: number;
  createdAt: number;
}

export interface KPI {
  totalWaves: number;
  activeUsers: number;
  rewardsStreamed: number;
  processing: number;
  conversionRate: number;
  avgTimeToVerify: number;
  networkHealth: number;
}

export interface TopSource {
  name: string;
  count: number;
  percentage: number;
}

export interface GraphNode {
  id: string;
  userId: string;
  userName: string;
  x: number;
  y: number;
  size: number;
  color: string;
  lastActivity: number;
  totalRewards: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  strength: number;
}

export type SimulationSpeed = 'slow' | 'normal' | 'fast' | 'hype';

class ActivitySimulator extends EventEmitter {
  private speed: SimulationSpeed = 'normal';
  private seed: number = Date.now();
  private kpi: KPI;
  private waves: WaveEvent[] = [];
  private topSources: TopSource[] = [];
  private graphNodes: GraphNode[] = [];
  private graphEdges: GraphEdge[] = [];
  private wavesPerMinute: number[] = [];
  private rewardsStream: number[] = [];
  private liveTicker: string[] = [];
  
  private eventLoopInterval?: NodeJS.Timeout;
  private kpiLoopInterval?: NodeJS.Timeout;
  private graphLoopInterval?: NodeJS.Timeout;
  private tickerInterval?: NodeJS.Timeout;
  private graphUpdateInterval?: NodeJS.Timeout;

  private speedMultipliers = {
    slow: { event: 0.5, kpi: 0.5, graph: 0.5 },
    normal: { event: 1, kpi: 1, graph: 1 },
    fast: { event: 1.5, kpi: 1.5, graph: 1.5 },
    hype: { event: 2, kpi: 1.5, graph: 1 },
  };

  constructor() {
    super();
    
    // Initialize KPI
    this.kpi = {
      totalWaves: 1247,
      activeUsers: 342,
      rewardsStreamed: 0,
      processing: 12,
      conversionRate: 87.3,
      avgTimeToVerify: 2.4,
      networkHealth: 89,
    };

    // Initialize top sources
    this.topSources = [
      { name: '#LYRIN402', count: 234, percentage: 18.7 },
      { name: '#Resonance', count: 189, percentage: 15.1 },
      { name: '@user1', count: 156, percentage: 12.5 },
      { name: '#Waves', count: 134, percentage: 10.7 },
      { name: '@user2', count: 98, percentage: 7.8 },
      { name: '#Echo', count: 87, percentage: 7.0 },
    ];

    // Initialize graph nodes
    this.initializeGraphNodes();
    this.initializeGraphEdges();

    // Initialize historical data
    const now = Date.now();
    for (let i = 0; i < 600; i++) {
      this.wavesPerMinute.push(this.random(5, 15));
      this.rewardsStream.push(0);
    }
  }

  private random(min: number, max: number): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return min + (this.seed / 233280) * (max - min);
  }

  private randomInt(min: number, max: number): number {
    return Math.floor(this.random(min, max + 1));
  }

  private generateUserId(): string {
    return `user${this.randomInt(1, 100)}`;
  }

  private generateUserName(): string {
    const names = ['Resonator', 'Echo', 'Wave', 'Signal', 'Node', 'Core', 'Pulse', 'Stream'];
    return `${names[this.randomInt(0, names.length - 1)]}${this.randomInt(100, 999)}`;
  }

  private generateTweetHash(): string {
    return Array.from({ length: 6 }, () => 
      '0123456789ABCDEF'[this.randomInt(0, 15)]
    ).join('');
  }

  private initializeGraphNodes() {
    const nodeCount = this.randomInt(20, 40);
    this.graphNodes = Array.from({ length: nodeCount }, (_, i) => {
      const userId = this.generateUserId();
      return {
        id: `node-${i}`,
        userId,
        userName: this.generateUserName(),
        x: this.random(0.1, 0.9),
        y: this.random(0.1, 0.9),
        size: this.random(20, 60),
        color: `hsl(${this.randomInt(180, 280)}, 70%, 60%)`,
        lastActivity: Date.now() - this.randomInt(0, 3600000),
        totalRewards: this.random(0.5, 10),
      };
    });
  }

  private initializeGraphEdges() {
    const edgeCount = this.randomInt(15, 30);
    this.graphEdges = Array.from({ length: edgeCount }, () => ({
      from: this.graphNodes[this.randomInt(0, this.graphNodes.length - 1)].id,
      to: this.graphNodes[this.randomInt(0, this.graphNodes.length - 1)].id,
      strength: this.random(0.3, 1),
    }));
  }

  start() {
    this.eventLoop();
    this.kpiLoop();
    this.graphLoop();
    this.tickerLoop();
    this.graphUpdateLoop();
  }

  stop() {
    if (this.eventLoopInterval) clearInterval(this.eventLoopInterval);
    if (this.kpiLoopInterval) clearInterval(this.kpiLoopInterval);
    if (this.graphLoopInterval) clearInterval(this.graphLoopInterval);
    if (this.tickerInterval) clearInterval(this.tickerInterval);
    if (this.graphUpdateInterval) clearInterval(this.graphUpdateInterval);
  }

  setSpeed(speed: SimulationSpeed) {
    this.speed = speed;
    this.stop();
    this.start();
  }

  private eventLoop() {
    const multiplier = this.speedMultipliers[this.speed].event;
    const baseInterval = 1000 / multiplier;
    
    this.eventLoopInterval = setInterval(() => {
      const probability = 0.7 * multiplier;
      if (this.random(0, 1) < probability) {
        const count = this.randomInt(1, 3);
        for (let i = 0; i < count; i++) {
          this.generateWave();
        }
      }
    }, baseInterval);
  }

  private generateWave() {
    const wave: WaveEvent = {
      id: `wave-${Date.now()}-${this.randomInt(1000, 9999)}`,
      userId: this.generateUserId(),
      userName: this.generateUserName(),
      userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.generateUserId()}`,
      tweetHash: this.generateTweetHash(),
      status: 'sent',
      timestamp: Date.now(),
      createdAt: Date.now(),
    };

    this.waves.unshift(wave);
    if (this.waves.length > 1000) {
      this.waves = this.waves.slice(0, 1000);
    }

    this.emit('wave', wave);

    // Transition to transmission
    setTimeout(() => {
      wave.status = 'transmission';
      this.emit('wave-update', wave);
    }, this.randomInt(1000, 2000));

    // Transition to resonated or retry
    const delay = this.randomInt(2000, 5000);
    setTimeout(() => {
      if (this.random(0, 1) < 0.05) {
        // Retry
        wave.status = 'retry';
        this.emit('wave-update', wave);
        setTimeout(() => {
          wave.status = 'transmission';
          this.emit('wave-update', wave);
          setTimeout(() => {
            wave.status = 'resonated';
            wave.reward = this.random(0.01, 0.05);
            this.kpi.rewardsStreamed += wave.reward;
            this.emit('wave-update', wave);
          }, this.randomInt(2000, 3000));
        }, 2000);
      } else {
        wave.status = 'resonated';
        wave.reward = this.random(0.01, 0.05);
        if (this.random(0, 1) < 0.1) {
          wave.reward = this.random(0.05, 0.1); // Rare spike
        }
        this.kpi.rewardsStreamed += wave.reward;
        this.emit('wave-update', wave);
      }
    }, delay);
  }

  private kpiLoop() {
    const multiplier = this.speedMultipliers[this.speed].kpi;
    const baseInterval = 2000 / multiplier;
    const jitter = this.randomInt(300, 700);
    
    this.kpiLoopInterval = setInterval(() => {
      // Total Waves - monotonic growth + noise
      this.kpi.totalWaves += this.random(0.5 * multiplier, 2 * multiplier);
      
      // Active Users - sawtooth noise ±5%
      const baseUsers = 342;
      const variation = baseUsers * 0.05;
      this.kpi.activeUsers = baseUsers + this.random(-variation, variation);
      
      // Rewards Streamed - uneven growth with occasional spikes
      if (this.random(0, 1) < 0.15) {
        this.kpi.rewardsStreamed += this.random(0.1 * multiplier, 0.5 * multiplier);
      } else {
        this.kpi.rewardsStreamed += this.random(0.01 * multiplier, 0.05 * multiplier);
      }
      
      // Processing - pulsing queue
      this.kpi.processing = Math.max(5, Math.min(25, 
        this.kpi.processing + this.random(-2, 3)
      ));
      
      // Conversion Rate - narrow corridor ±0.2-0.5%
      const baseRate = 87.3;
      const conversionVariation = this.random(0.2, 0.5);
      this.kpi.conversionRate = baseRate + this.random(-conversionVariation, conversionVariation);
      
      // Avg Time to Verify - light oscillations ±0.3s
      const baseTime = 2.4;
      this.kpi.avgTimeToVerify = baseTime + this.random(-0.3, 0.3);
      
      // Network Health - slow drift 70-95
      this.kpi.networkHealth = Math.max(70, Math.min(95,
        this.kpi.networkHealth + this.random(-0.5, 0.5)
      ));

      // Update waves per minute
      const newValue = this.random(8, 18) * multiplier;
      this.wavesPerMinute.push(newValue);
      if (this.wavesPerMinute.length > 600) {
        this.wavesPerMinute.shift();
      }

      // Update rewards stream
      this.rewardsStream.push(this.kpi.rewardsStreamed + this.random(-0.1, 0.3));
      if (this.rewardsStream.length > 600) {
        this.rewardsStream.shift();
      }

      // Update top sources
      this.updateTopSources();

      this.emit('kpi-update', this.kpi);
      this.emit('waves-per-minute', this.wavesPerMinute);
      this.emit('rewards-stream', this.rewardsStream);
    }, baseInterval + jitter);
  }

  private updateTopSources() {
    this.topSources.forEach(source => {
      source.count += this.randomInt(0, 3);
      source.percentage = (source.count / this.kpi.totalWaves) * 100;
    });
    
    // Shuffle percentages slightly
    this.topSources.sort((a, b) => b.percentage - a.percentage);
  }

  private graphLoop() {
    const multiplier = this.speedMultipliers[this.speed].graph;
    const baseInterval = (this.randomInt(3000, 10000)) / multiplier;
    
    this.graphLoopInterval = setInterval(() => {
      // Update node sizes and colors
      this.graphNodes.forEach(node => {
        node.size = Math.max(20, Math.min(80, 
          node.size + this.random(-2, 3)
        ));
        node.totalRewards += this.random(0, 0.1);
        const hue = 180 + (node.totalRewards * 10) % 100;
        node.color = `hsl(${hue}, 70%, 60%)`;
      });

      this.emit('graph-update', {
        nodes: this.graphNodes,
        edges: this.graphEdges,
      });
    }, baseInterval);
  }

  private graphUpdateLoop() {
    const multiplier = this.speedMultipliers[this.speed].graph;
    const baseInterval = 3000 / multiplier;
    
    this.graphUpdateInterval = setInterval(() => {
      // Light jitter for node positions
      this.graphNodes.forEach(node => {
        node.x = Math.max(0.1, Math.min(0.9, 
          node.x + this.random(-0.01, 0.01)
        ));
        node.y = Math.max(0.1, Math.min(0.9, 
          node.y + this.random(-0.01, 0.01)
        ));
      });

      // Random edge recalculation
      if (this.random(0, 1) < 0.3) {
        this.initializeGraphEdges();
      }

      this.emit('graph-update', {
        nodes: this.graphNodes,
        edges: this.graphEdges,
      });
    }, baseInterval);
  }

  private tickerLoop() {
    const messages = [
      'Wave #{hash} verified → {reward} SOL streamed',
      '@{user} sent wave',
      'Echo amplified',
      'Signal in transmission...',
      'Resonance detected',
      'Network pulse increased',
    ];

    this.tickerInterval = setInterval(() => {
      const template = messages[this.randomInt(0, messages.length - 1)];
      const wave = this.waves[this.randomInt(0, Math.min(10, this.waves.length - 1))];
      
      let message = template;
      if (wave) {
        message = message
          .replace('{hash}', wave.tweetHash)
          .replace('{user}', wave.userName)
          .replace('{reward}', (wave.reward || this.random(0.01, 0.05)).toFixed(2));
      } else {
        message = message
          .replace('{hash}', this.generateTweetHash())
          .replace('{user}', this.generateUserName())
          .replace('{reward}', this.random(0.01, 0.05).toFixed(2));
      }

      this.liveTicker.unshift(message);
      if (this.liveTicker.length > 20) {
        this.liveTicker.pop();
      }

      this.emit('ticker-update', this.liveTicker);
    }, 1000);
  }

  // Public getters
  getKPI(): KPI {
    return { ...this.kpi };
  }

  getWaves(): WaveEvent[] {
    return [...this.waves];
  }

  getTopSources(): TopSource[] {
    return [...this.topSources];
  }

  getGraphNodes(): GraphNode[] {
    return [...this.graphNodes];
  }

  getGraphEdges(): GraphEdge[] {
    return [...this.graphEdges];
  }

  getWavesPerMinute(): number[] {
    return [...this.wavesPerMinute];
  }

  getRewardsStream(): number[] {
    return [...this.rewardsStream];
  }

  getLiveTicker(): string[] {
    return [...this.liveTicker];
  }

  // Admin controls
  injectWaves(count: number) {
    for (let i = 0; i < count; i++) {
      this.generateWave();
    }
  }

  triggerSpike() {
    this.kpi.rewardsStreamed += this.random(5, 10);
    this.injectWaves(20);
  }

  resetSeeds() {
    this.seed = Date.now();
  }
}

export const simulator = new ActivitySimulator();

