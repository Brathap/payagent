'use client';

import React from 'react';
import { Bot, BarChart3, ShieldCheck, Settings, Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: 'shopper' | 'merchant';
  setActiveTab: (tab: 'shopper' | 'merchant') => void;
  onOpenSettings: () => void;
}

export default function Navbar({ activeTab, setActiveTab, onOpenSettings }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                PayAgent
              </span>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                AI + PayPal
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Autonomous Agentic Commerce &amp; AG Grid Intelligence
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setActiveTab('shopper')}
            className={`flex items-center space-x-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'shopper'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Agentic Shopper</span>
          </button>

          <button
            onClick={() => setActiveTab('merchant')}
            className={`flex items-center space-x-2 px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === 'merchant'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-indigo-300" />
            <span>AG Grid Merchant Hub</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PayPal Sandbox Live</span>
          </div>

          <button
            onClick={onOpenSettings}
            title="Configure Sandbox & Keys"
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
}
