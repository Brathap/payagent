'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import ShopperAgent from '@/components/ShopperAgent';
import MerchantDashboard from '@/components/MerchantDashboard';
import ConfigModal from '@/components/ConfigModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'shopper' | 'merchant'>('shopper');
  const [configOpen, setConfigOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setConfigOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'shopper' ? (
          <ShopperAgent />
        ) : (
          <MerchantDashboard />
        )}
      </main>

      {/* Settings / Config Modal */}
      <ConfigModal
        isOpen={configOpen}
        onClose={() => setConfigOpen(false)}
      />
    </div>
  );
}
