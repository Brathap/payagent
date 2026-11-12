'use client';

import React from 'react';
import { Bot, BarChart3, ShieldCheck, Settings, Sparkles, Terminal, Volume2, VolumeX, Code2 } from 'lucide-react';
import { playSound } from '@/lib/sounds';

interface NavbarProps {
  activeTab: 'shopper' | 'merchant';
  setActiveTab: (tab: 'shopper' | 'merchant') => void;
  onOpenSettings: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenSettings,
  soundEnabled,
  setSoundEnabled,
}: NavbarProps) {
  const switchTab = (tab: 'shopper' | 'merchant') => {
    if (soundEnabled) playSound('click');
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080b12]/90 backdrop-blur-xl border-b border-slate-800/80 text-white">
      {/* Top micro-ticker line */}
      <div className="bg-gradient-to-r from-blue-900/30 via-indigo-900/40 to-slate-900/30 border-b border-slate-800/50 px-4 py-1 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 font-mono text-cyan-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>PAYPAL AI HACKATHON 2026</span>
          </span>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            Pillar: <strong className="text-slate-200">Autonomous Agentic Commerce</strong> &times; <strong className="text-slate-200">AG Grid Intelligence</strong>
          </span>
        </div>
        <div className="flex items-center space-x-3 font-mono text-[10px]">
          <span className="text-emerald-400 font-semibold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>SANDBOX API: LIVE (0.24s latency)</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#080b12]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                PayAgent
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                SENTINEL
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block font-mono">
              Autonomous Agentic Payments &bull; Powered by PayPal
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => switchTab('shopper')}
            className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'shopper'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Agentic Shopper</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 font-mono font-normal">1</span>
          </button>

          <button
            onClick={() => switchTab('merchant')}
            className={`flex items-center space-x-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'merchant'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-300" />
            <span>AG Grid Merchant Hub</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/10 font-mono font-normal">2</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {/* Audio toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playSound('click');
            }}
            title={soundEnabled ? 'Fintech SFX Enabled' : 'Fintech SFX Muted'}
            className={`p-2 rounded-xl border transition ${
              soundEnabled
                ? 'bg-blue-950/60 border-blue-500/40 text-blue-400'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Settings modal button */}
          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              onOpenSettings();
            }}
            title="Configure Credentials"
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
