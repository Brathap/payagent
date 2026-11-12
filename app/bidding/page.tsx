'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import NovaCanvas from '@/components/NovaCanvas';
import ParticleBackground from '@/components/ParticleBackground';

export default function BiddingPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className={`min-h-screen flex flex-col font-sans ${theme === 'light' ? 'light bg-[#f8fafc] text-slate-900 nova-mesh-light' : 'dark bg-[#060911] text-slate-100 nova-mesh-dark'}`}>
      <ParticleBackground theme={theme} />
      <Navbar
        activeTab="bidding"
        setActiveTab={() => {}}
        onOpenSettings={() => {}}
        onOpenProtocol={() => {}}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        theme={theme}
        setTheme={setTheme}
        onStartTour={() => {}}
      />
      <main className="flex-1 relative z-10">
        <NovaCanvas
          soundEnabled={soundEnabled}
          onNavigateToMerchant={() => {}}
          theme={theme}
          canvasView="bidding"
        />
      </main>
    </div>
  );
}
