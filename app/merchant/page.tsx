'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import MerchantDashboard from '@/components/MerchantDashboard';
import ParticleBackground from '@/components/ParticleBackground';

export default function MerchantPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className={`min-h-screen flex flex-col font-sans ${theme === 'light' ? 'light bg-[#f8fafc] text-slate-900 nova-mesh-light' : 'dark bg-[#060911] text-slate-100 nova-mesh-dark'}`}>
      <ParticleBackground theme={theme} />
      <Navbar
        activeTab="merchant"
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
        <MerchantDashboard soundEnabled={soundEnabled} theme={theme} />
      </main>
    </div>
  );
}
