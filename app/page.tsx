'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import NovaCanvas from '@/components/NovaCanvas';
import MerchantDashboard from '@/components/MerchantDashboard';
import ApiPlayground from '@/components/ApiPlayground';
import ConfigModal from '@/components/ConfigModal';
import ProtocolModal from '@/components/ProtocolModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'canvas' | 'merchant' | 'api'>('canvas');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [configOpen, setConfigOpen] = useState(false);
  const [protocolOpen, setProtocolOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className={`${theme} min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#060911] text-slate-100' : 'bg-slate-50 text-slate-900'
    } nova-mesh`}>
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setConfigOpen(true)}
        onOpenProtocol={() => setProtocolOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'canvas' ? (
          <NovaCanvas
            soundEnabled={soundEnabled}
            onNavigateToMerchant={() => setActiveTab('merchant')}
            theme={theme}
          />
        ) : activeTab === 'merchant' ? (
          <MerchantDashboard soundEnabled={soundEnabled} theme={theme} />
        ) : (
          <ApiPlayground soundEnabled={soundEnabled} />
        )}
      </main>

      {/* Settings / Sandbox Config Modal */}
      <ConfigModal
        isOpen={configOpen}
        onClose={() => setConfigOpen(false)}
      />

      {/* Protocol Specs Modal */}
      <ProtocolModal
        isOpen={protocolOpen}
        onClose={() => setProtocolOpen(false)}
      />
    </div>
  );
}
