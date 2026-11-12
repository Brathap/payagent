'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import NovaCanvas from '@/components/NovaCanvas';
import MerchantDashboard from '@/components/MerchantDashboard';
import ApiPlayground from '@/components/ApiPlayground';
import ConfigModal from '@/components/ConfigModal';
import ProtocolModal from '@/components/ProtocolModal';
import ParticleBackground from '@/components/ParticleBackground';
import InteractiveTour from '@/components/InteractiveTour';
import NovaAvatar from '@/components/NovaAvatar';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'canvas' | 'merchant' | 'api'>('canvas');
  const [configOpen, setConfigOpen] = useState(false);
  const [protocolOpen, setProtocolOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [tourActive, setTourActive] = useState(false);

  // Cross-component triggers for the tour
  const [tourBudget, setTourBudget] = useState<number | undefined>(undefined);
  const [tourQuery, setTourQuery] = useState<string | undefined>(undefined);
  const checkoutTriggerRef = React.useRef<(() => void) | null>(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'canvas' || tabParam === 'merchant' || tabParam === 'api') {
        setActiveTab(tabParam);
      }
      const themeParam = params.get('theme');
      if (themeParam === 'light') {
        setTheme('light');
      } else if (themeParam === 'dark') {
        setTheme('dark');
      } else {
        // Enforce pure light theme default for high-contrast fintech aesthetics
        setTheme('light');
      }
      if (params.get('modal') === 'protocol') {
        setProtocolOpen(true);
      }
      if (params.get('modal') === 'config') {
        setConfigOpen(true);
      }
      if (params.get('tour') === 'true') {
        setTourActive(true);
      }
    } catch (e) {}
  }, []);

  const handleSetTheme = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('payagent_theme', newTheme);
    } catch (e) {}
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden ${
        isLight
          ? 'light bg-[#f8fafc] text-slate-900 nova-mesh-light selection:bg-blue-600 selection:text-white'
          : 'dark bg-[#060911] text-slate-100 nova-mesh-dark selection:bg-blue-600 selection:text-white'
      }`}
    >
      {/* Dynamic Animated Canvas Particle Mesh */}
      <ParticleBackground theme={theme} />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setConfigOpen(true)}
        onOpenProtocol={() => setProtocolOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        theme={theme}
        setTheme={handleSetTheme}
        onStartTour={() => setTourActive(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 relative z-10">
        {activeTab === 'canvas' ? (
          <NovaCanvas
            soundEnabled={soundEnabled}
            onNavigateToMerchant={() => setActiveTab('merchant')}
            theme={theme}
            controlledBudget={tourBudget}
            controlledQuery={tourQuery}
            onRegisterTriggerCheckout={(fn) => {
              checkoutTriggerRef.current = fn;
            }}
            onStartTour={() => setTourActive(true)}
          />
        ) : activeTab === 'merchant' ? (
          <MerchantDashboard soundEnabled={soundEnabled} theme={theme} />
        ) : (
          <ApiPlayground soundEnabled={soundEnabled} theme={theme} />
        )}
      </main>

      {/* Cool Interactive AI Copilot Avatar */}
      <NovaAvatar
        soundEnabled={soundEnabled}
        theme={theme}
        onTriggerDemo={() => setTourActive(true)}
        onTriggerVoice={() => {
          setActiveTab('canvas');
          setTourQuery('Eco travel backpack under $70');
        }}
        onNavigateToMerchant={() => setActiveTab('merchant')}
      />

      {/* Autonomous Guided Interactive Tour */}
      <InteractiveTour
        isActive={tourActive}
        onClose={() => setTourActive(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onSetBudget={(val) => setTourBudget(val)}
        onSearch={(q) => setTourQuery(q)}
        onTriggerCheckout={() => {
          if (checkoutTriggerRef.current) {
            checkoutTriggerRef.current();
          }
        }}
        onTriggerDispute={() => {}}
      />

      {/* Settings / Sandbox Config Modal */}
      <ConfigModal
        isOpen={configOpen}
        onClose={() => setConfigOpen(false)}
        theme={theme}
      />

      {/* Protocol Specs Modal */}
      <ProtocolModal
        isOpen={protocolOpen}
        onClose={() => setProtocolOpen(false)}
        theme={theme}
      />
    </div>
  );
}
