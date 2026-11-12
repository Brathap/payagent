'use client';

import React from 'react';
import { Bot, BarChart3, Settings, Sparkles, Volume2, VolumeX, ShieldCheck, Terminal, Layers } from 'lucide-react';
import { playSound } from '@/lib/sounds';

interface NavbarProps {
  activeTab: 'canvas' | 'merchant' | 'api';
  setActiveTab: (tab: 'canvas' | 'merchant' | 'api') => void;
  onOpenSettings: () => void;
  onOpenProtocol: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenProtocol,
  soundEnabled,
  setSoundEnabled,
}: NavbarProps) {
  const switchTab = (tab: 'canvas' | 'merchant' | 'api') => {
    if (soundEnabled) playSound('click');
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#060911]/90 backdrop-blur-xl border-b border-white/5 text-white">
      {/* Top telemetry line */}
      <div className="border-b border-white/[0.04] px-4 py-1 flex items-center justify-between text-[10.5px] text-slate-400 bg-black/40">
        <div className="flex items-center space-x-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
          <span className="font-mono text-cyan-400 font-bold tracking-wider shrink-0">PAYPAL AI HACKATHON 2026</span>
          <span className="hidden sm:inline text-slate-500">&bull;</span>
          <span className="hidden sm:inline text-slate-400 truncate">
            PayPal Orders v2 Sandbox &bull; AG Grid Community v36 &bull; APCP Protocol
          </span>
        </div>
        <div className="flex items-center space-x-1.5 font-mono text-[10px] text-emerald-400 shrink-0">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span className="hidden xs:inline">SANDBOX GATEWAY:</span>
          <span className="font-bold">ACTIVE</span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#060911]" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                PayPal
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                NOVA
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400 hidden sm:block font-mono">
              Agentic Commerce &bull; Autonomous Payments
            </p>
          </div>
        </div>

        {/* 3 Main View Tabs */}
        <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={() => switchTab('canvas')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'canvas'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Agentic Canvas</span>
          </button>

          <button
            onClick={() => switchTab('merchant')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'merchant'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-300" />
            <span>AG Grid Terminal</span>
          </button>

          <button
            onClick={() => switchTab('api')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'api'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">Protocol</span>
            <span>API</span>
          </button>
        </div>

        {/* Utility controls */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              onOpenProtocol();
            }}
            title="View Protocol Specs & Architecture"
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold transition cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Specs</span>
          </button>

          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playSound('click');
            }}
            title={soundEnabled ? 'Fintech SFX Enabled' : 'Fintech SFX Muted'}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              soundEnabled
                ? 'bg-blue-950/60 border-blue-500/40 text-blue-400 shadow-sm shadow-blue-500/10'
                : 'bg-slate-900/80 border-white/5 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              onOpenSettings();
            }}
            title="Configure Credentials"
            className="p-2 rounded-xl bg-slate-900/80 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
