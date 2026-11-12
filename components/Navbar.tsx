'use client';

import React from 'react';
import { BarChart3, Settings, Sparkles, Volume2, VolumeX, ShieldCheck, Terminal, Layers, Sun, Moon } from 'lucide-react';
import Logo from '@/components/Logo';
import { playSound } from '@/lib/sounds';

interface NavbarProps {
  activeTab: 'canvas' | 'merchant' | 'api';
  setActiveTab: (tab: 'canvas' | 'merchant' | 'api') => void;
  onOpenSettings: () => void;
  onOpenProtocol: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
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
    if (soundEnabled) playSound('click');
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-200 ${
      theme === 'dark'
        ? 'bg-[#060911]/90 border-white/5 text-white'
        : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      {/* Top telemetry line */}
      <div className={`border-b px-4 py-1 flex items-center justify-between text-[10.5px] font-mono transition-colors duration-200 ${
        theme === 'dark'
          ? 'bg-black/40 border-white/[0.04] text-slate-400'
          : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <div className="flex items-center space-x-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse shrink-0" />
          <span className="font-bold tracking-wider shrink-0 text-blue-600 dark:text-cyan-400">
            PAYPAL AI HACKATHON 2026
          </span>
          <span className="hidden sm:inline opacity-40">&bull;</span>
          <span className="hidden sm:inline truncate opacity-80">
            PayPal Orders v2 Sandbox &bull; AG Grid Community v36 &bull; APCP Protocol
          </span>
        </div>
        <div className="flex items-center space-x-1.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
          <ShieldCheck className="w-3 h-3" />
          <span className="hidden xs:inline">SANDBOX GATEWAY:</span>
          <span className="font-bold">ACTIVE</span>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand with Clean Vector Logo */}
        <div className="flex items-center space-x-3 shrink-0">
          <Logo size="md" />
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
                PayPal
              </span>
              <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-[#0070BA] text-white shadow-sm">
                NOVA
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block font-mono">
              Autonomous Agentic Commerce &bull; Sandbox v2
            </p>
          </div>
        </div>

        {/* 3 Main View Tabs */}
        <div className={`flex items-center p-1 rounded-2xl border transition-colors ${
          theme === 'dark'
            ? 'bg-slate-900/90 border-white/10 shadow-inner'
            : 'bg-slate-100 border-slate-200'
        }`}>
          <button
            onClick={() => switchTab('canvas')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'canvas'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Agentic Canvas</span>
          </button>

          <button
            onClick={() => switchTab('merchant')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'merchant'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-300" />
            <span>AG Grid Terminal</span>
          </button>

          <button
            onClick={() => switchTab('api')}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === 'api'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden sm:inline">Protocol</span>
            <span>API</span>
          </button>
        </div>

        {/* Utility controls (Theme toggle, SFX toggle, Settings) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900 border-white/10 text-amber-400 hover:bg-slate-800'
                : 'bg-white border-slate-200 text-indigo-600 hover:bg-slate-50 shadow-sm'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Specs modal trigger */}
          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              onOpenProtocol();
            }}
            title="View Protocol Specs & Architecture"
            className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Specs</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playSound('click');
            }}
            title={soundEnabled ? 'Fintech SFX Enabled' : 'Fintech SFX Muted'}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              soundEnabled
                ? 'bg-blue-600/10 border-blue-500/40 text-blue-600 dark:text-blue-400'
                : 'bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-white/5 text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Settings modal trigger */}
          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              onOpenSettings();
            }}
            title="Configure Credentials"
            className={`p-2 rounded-xl border transition cursor-pointer ${
              theme === 'dark'
                ? 'bg-slate-900/80 border-white/5 hover:border-white/10 text-slate-300'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
