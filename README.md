# LYRIN402 - Living Simulation Platform

A real-time activity simulation platform with live data visualization, interactive graphs, and wallet integration.

## Features

- **Resonance Hub**: Live KPI dashboard with real-time updates
- **Signal Feed**: Stream of wave events with status transitions
- **Echo Core**: Pulsing balance visualization
- **Resonance Map**: Interactive network graph with nodes and connections
- **Transmit**: Form to send waves to the network
- **Manifest**: Typing effect manifesto page

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- React 18
- Tailwind CSS
- Framer Motion (animations)
- Recharts (data visualization)
- Solana Wallet Adapter (Phantom/Solflare)
- Zustand (state management)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── page.tsx           # Resonance Hub (home)
│   ├── feed/              # Signal Feed
│   ├── echo/              # Echo Core
│   ├── map/               # Resonance Map
│   ├── transmit/          # Transmit form
│   └── manifest/          # Manifest page
├── components/            # React components
│   ├── NavigationBar.tsx
│   ├── MainMenu.tsx
│   ├── SpeedControlPanel.tsx
│   ├── KPICard.tsx
│   ├── LiveTicker.tsx
│   ├── WaveCard.tsx
│   ├── WalletProvider.tsx
│   └── SimulatorProvider.tsx
├── lib/                   # Core logic
│   ├── simulator.ts      # Activity simulator engine
│   └── store.ts           # Zustand store
└── app/globals.css        # Global styles
```

## Simulation Controls

Press `` ` `` (backtick) or `Ctrl+Esc` to toggle the speed control panel.

Available speeds:
- **Slow**: 0.5x speed
- **Normal**: 1x speed (default)
- **Fast**: 1.5x speed
- **Hype**: 2x event frequency, 1.5x KPI growth

Admin controls:
- **Inject 50 Waves**: Add 50 waves instantly
- **Trigger Spike**: Create a rewards spike
- **Reset Seeds**: Reset random seed for reproducibility

## Wallet Integration

The app supports Solana wallet connections via:
- Phantom
- Solflare

Wallet connection is read-only (no on-chain operations).

## Notes

- All data is simulated locally
- No on-chain transactions are performed
- Data persists in browser localStorage
- The simulator runs continuously, even when not viewing the page

