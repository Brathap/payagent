'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ShopperAgent from '@/components/ShopperAgent';
import MerchantDashboard from '@/components/MerchantDashboard';
import ConfigModal from '@/components/ConfigModal';
import ProtocolModal from '@/components/ProtocolModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'shopper' | 'merchant'>('shopper');
  const [configOpen, setConfigOpen] = useState(false);
  const [protocolOpen, setProtocolOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-[#05070e] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white mesh-bg">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setConfigOpen(true)}
        onOpenProtocol={() => setProtocolOpen(true)}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'shopper' ? (
          <ShopperAgent soundEnabled={soundEnabled} />
        ) : (
          <MerchantDashboard soundEnabled={soundEnabled} />
        )}
      </main>

      {/* Settings / Sandbox Config Modal */}
      <ConfigModal
        isOpen={configOpen}
        onClose={() => setConfigOpen(false)}
      />

      {/* APCP Protocol Architecture Blueprint Modal */}
      <ProtocolModal
        isOpen={protocolOpen}
        onClose={() => setProtocolOpen(false)}
      />
    </div>
  );
}
