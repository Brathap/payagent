'use client';

import React from 'react';
import {
  ShoppingBag,
  Scale,
  ShieldCheck,
  BarChart3,
  Terminal,
  Layers,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Settings,
  Sparkles,
} from 'lucide-react';
import Logo from './Logo';
import { playSound } from '@/lib/sounds';

export type NavTab = 'canvas' | 'bidding' | 'dispute' | 'merchant' | 'api';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenSettings: () => void;
  onOpenProtocol: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  onStartTour?: () => void;
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
  onStartTour,
}: NavbarProps) {
  const switchTab = (tab: NavTab) => {
    if (soundEnabled) playSound('click');
    setActiveTab(tab);
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (soundEnabled) playSound('click');
  };

  const isLight = theme === 'light';

  const navItems = [
    { id: 'canvas' as NavTab, label: 'Shopper Terminal', icon: ShoppingBag, desc: 'Autonomous Purchasing' },
    { id: 'bidding' as NavTab, label: 'Bidding Matrix', icon: Scale, desc: '3-Merchant Reverse RFQ' },
    { id: 'dispute' as NavTab, label: 'Dispute Shield', icon: ShieldCheck, desc: '304ms Resolution Defense' },
    { id: 'merchant' as NavTab, label: 'AG Grid Hub', icon: BarChart3, desc: 'Virtualized Telemetry' },
    { id: 'api' as NavTab, label: 'REST API', icon: Terminal, desc: 'PayPal Orders v2' },
  ];

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-200 ${
      isLight ? 'bg-white/95 border-slate-200 text-slate-800' : 'bg-[#090d16]/95 border-slate-800 text-white'
    }`}>
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 shrink-0 cursor-pointer" onClick={() => switchTab('canvas')}>
          <Logo size={36} />
          <div>
            <div className="flex items-center space-x-2">
              <span className={`font-black text-lg tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                PayAgent
              </span>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>PayPal Enclave</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden lg:block font-mono">
              APCP Protocol &bull; Orders v2 REST
            </p>
          </div>
        </div>

        {/* Workspace Switcher Tabs */}
        <nav className={`hidden md:flex items-center p-1 rounded-2xl border transition-colors ${
          isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => switchTab(item.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                  isActive
                    ? 'bg-[#0070BA] text-white shadow-sm'
                    : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : isLight ? 'text-slate-500' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile View Selector Dropdown */}
        <div className="md:hidden flex-1 max-w-[160px]">
          <select
            value={activeTab}
            onChange={(e) => switchTab(e.target.value as NavTab)}
            className={`w-full text-xs font-bold px-2 py-1.5 rounded-xl border ${
              isLight ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-white'
            }`}
          >
            {navItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Utility Actions */}
        <div className="flex items-center space-x-2 shrink-0">
          
          {/* Guided Tour Launcher */}
          {onStartTour && (
            <button
              onClick={() => {
                if (soundEnabled) playSound('success');
                onStartTour();
              }}
              title="Launch Guided Product Tour"
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-sm transition cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tour</span>
            </button>
          )}

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-amber-300'
            }`}
          >
            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Protocol Specs Modal */}
          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              onOpenProtocol();
            }}
            title="APCP Specification & Cryptographic Flow"
            className={`hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            <span>Specs</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playSound('click');
            }}
            title={soundEnabled ? 'Fintech SFX Enabled' : 'Fintech SFX Muted'}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              soundEnabled
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-cyan-400'
                : isLight ? 'bg-slate-100 border-slate-200 text-slate-400' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Sandbox Credentials Modal */}
          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              onOpenSettings();
            }}
            title="PayPal Sandbox API Settings"
            className={`p-2 rounded-xl border transition cursor-pointer ${
              isLight
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
