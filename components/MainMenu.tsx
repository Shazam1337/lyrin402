'use client';

import { useAppStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const menuItems = [
  { id: 'hub', label: 'Hub', path: '/' },
  { id: 'feed', label: 'Feed', path: '/feed' },
  { id: 'echo', label: 'Echo Core', path: '/echo' },
  { id: 'map', label: 'Resonance Map', path: '/map' },
  { id: 'transmit', label: 'Transmit', path: '/transmit' },
  { id: 'manifest', label: 'Manifest', path: '/manifest' },
];

export default function MainMenu() {
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const index = menuItems.findIndex(
      (item) => pathname === item.path || (item.path === '/' && pathname === '/')
    );
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [pathname]);

  return (
    <nav className="fixed top-16 left-0 right-0 z-40 bg-black/60 backdrop-blur-sm border-b border-cyan-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 overflow-x-auto relative">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.path || (item.path === '/' && pathname === '/');
            return (
              <Link
                key={item.id}
                href={item.path}
                className={`relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-cyan-400'
                    : 'text-gray-400 hover:text-cyan-300'
                }`}
              >
                {item.label}
                {isActive && (
                  <>
                    {/* Glow under text */}
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400/50 blur-sm" />
                    {/* Active line */}
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

