'use client';

import React from 'react';
import { BarChart3, Settings, Sparkles, Volume2, VolumeX, ShieldCheck, Terminal, Layers, Sun, Moon } from 'lucide-react';
import Logo from './Logo';
import { playSound } from '@/lib/sounds';

interface NavbarProps {
  activeTab: 'canvas' | 'merchant' | 'api';
  setActiveTab: (tab: 'canvas' | 'merchant' | 'api') => void;
  onOpenSettings: () => void;
  onOpenProtocol: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenProtocol,
  soundEnabled,
  setSoundEnabled,
  theme,
  setTheme,
}: NavbarProps) {
  const switchTab = (tab: 'canvas' | 'merchant' | 'api') => {
    if (soundEnabled) playSound('click');
    setActiveTab(tab);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (soundEnabled) playSound('click');
  };

  const isLight = theme === 'light';

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-200 ${
      isLight ? 'bg-white/90 border-slate-200/80 text-slate-800' : 'bg-[#060911]/90 border-white/5 text-white'
    }`}>
      {/* Top telemetry line */}
      <div className={`border-b px-4 py-1 flex items-center justify-between text-[10.5px] transition-colors ${
        isLight ? 'bg-slate-100/70 border-slate-200 text-slate-600' : 'bg-black/40 border-white/[0.04] text-slate-400'
      }`}>
        <div className="flex items-center space-x-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shrink-0" />
          <span className="font-mono text-blue-600 dark:text-cyan-400 font-bold tracking-wider shrink-0">PAYPAL AI HACKATHON 2026</span>
          <span className="hidden sm:inline opacity-40">&bull;</span>
          <span className="hidden sm:inline truncate">
            PayPal Orders v2 Sandbox &bull; AG Grid Community v36 &bull; APCP Protocol
          </span>
        </div>
        <div className="flex items-center space-x-1.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 shrink-0 font-semibold">
          <ShieldCheck className="w-3 h-3" />
          <span className="hidden xs:inline">SANDBOX GATEWAY:</span>
          <span>ONLINE</span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand with authentic clean Logo */}
        <div className="flex items-center space-x-3 shrink-0">
          <Logo size={40} />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className={`font-black text-xl tracking-tight ${isLight ? 'text-slate-900' : 'bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent'}`}>
                PayPal
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
                NOVA
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block font-mono">
              Agentic Commerce &bull; Autonomous Payments
            </p>
          </div>
        </div>

        {/* 3 Main View Tabs */}
        <div className={`flex items-center p-1 rounded-2xl border transition-colors ${
          isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900/90 border-white/10'
        }`}>
          <button
            onClick={() => switchTab('canvas')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'canvas'
                ? 'bg-[#0070BA] text-white shadow-md'
                : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-white/60' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Agentic Canvas</span>
          </button>

          <button
            onClick={() => switchTab('merchant')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'merchant'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md'
                : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-white/60' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-300" />
            <span>AG Grid Terminal</span>
          </button>

          <button
            onClick={() => switchTab('api')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'api'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                : isLight ? 'text-slate-600 hover:text-slate-900 hover:bg-white/60' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">Protocol</span>
            <span>API</span>
          </button>
        </div>

        {/* Utility controls */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-amber-600'
                : 'bg-slate-900/80 hover:bg-slate-800 border-white/5 text-amber-300'
            }`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              onOpenProtocol();
            }}
            title="View Protocol Specs & Architecture"
            className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
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
                ? 'bg-blue-100 dark:bg-blue-950/60 border-blue-300 dark:border-blue-500/40 text-blue-600 dark:text-blue-400'
                : isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-900/80 border-white/5 text-slate-500'
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
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-slate-900/80 border-white/5 hover:border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
