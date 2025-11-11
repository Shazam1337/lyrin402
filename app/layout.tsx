import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import WalletProvider from '@/components/WalletProvider';
import NavigationBar from '@/components/NavigationBar';
import MainMenu from '@/components/MainMenu';
import SpeedControlPanel from '@/components/SpeedControlPanel';
import SimulatorProvider from '@/components/SimulatorProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LYRIN402 - Resonance Hub',
  description: 'Living simulation of network activity',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletProvider>
          <SimulatorProvider>
            <NavigationBar />
            <MainMenu />
            <main className="pt-32 pb-8 min-h-screen relative z-10">
              {children}
            </main>
            <SpeedControlPanel />
          </SimulatorProvider>
        </WalletProvider>
      </body>
    </html>
  );
}

