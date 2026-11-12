'use client';

import React, { useState } from 'react';
import { Sparkles, X, ChevronRight, Zap, ShieldCheck, Mic, ArrowUpRight, Bot } from 'lucide-react';
import { playSound, speakVoice } from '@/lib/sounds';

interface NovaAvatarProps {
  soundEnabled: boolean;
  theme?: 'light' | 'dark';
  onTriggerDemo?: () => void;
  onTriggerVoice?: () => void;
  onNavigateToMerchant?: () => void;
}

export default function NovaAvatar({
  soundEnabled,
  theme = 'dark',
  onTriggerDemo,
  onTriggerVoice,
  onNavigateToMerchant,
}: NovaAvatarProps) {
  const isLight = theme === 'light';
  const [isOpen, setIsOpen] = useState(false);
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const tips = [
    {
      title: 'Inviolable Spending Ceilings',
      desc: 'APCP locks a mathematical client ceiling before agent dispatch. If an AI model hallucinates a cart total > $100, the payment tool is blocked in the enclave.',
      actionLabel: 'Launch Guided Tour',
      action: onTriggerDemo,
    },
    {
      title: 'Autonomous 10% Partner Concession',
      desc: 'Our buyer agent runs reverse RFQs across merchant catalog feeds, automatically attaching an authenticated 10% discount and PayPal Green carbon offsets.',
      actionLabel: 'Test Mic Voice Agent',
      action: onTriggerVoice,
    },
    {
      title: '304ms Zero-Dispute Protection',
      desc: 'When synthetic chargebacks occur in the PayPal Resolution Center, PayAgent cross-references the Ed25519 nonce with PayPal Capture IDs to clear 100% merchant liability.',
      actionLabel: 'Inspect AG Grid Hub',
      action: onNavigateToMerchant,
    },
  ];

  const handleToggleOpen = () => {
    if (soundEnabled) playSound('click');
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      const tip = tips[currentTipIndex];
      speakVoice(tip.title + '. ' + tip.desc);
    }
  };

  const handleNextTip = () => {
    if (soundEnabled) playSound('click');
    const next = (currentTipIndex + 1) % tips.length;
    setCurrentTipIndex(next);
    speakVoice(tips[next].title + '. ' + tips[next].desc);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Sleek Enterprise Copilot Card */}
      {isOpen && (
        <div className={`mb-3 w-84 sm:w-92 rounded-3xl p-5 border shadow-2xl transition-all animate-in slide-in-from-bottom-3 duration-200 relative ${
          isLight
            ? 'bg-white/95 backdrop-blur-xl border-slate-200 text-slate-800 shadow-slate-300/50'
            : 'bg-slate-900/95 backdrop-blur-xl border-slate-800 text-white shadow-black/60'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#0070BA] flex items-center justify-center text-white">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <span className={`text-xs font-black uppercase tracking-wider font-mono ${
                  isLight ? 'text-slate-900' : 'text-white'
                }`}>
                  Sentinel Protocol Copilot
                </span>
                <div className="flex items-center space-x-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>APCP v1.0 &bull; ONLINE</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Current Tip / Architecture Insight */}
          <div className="py-3.5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-600 dark:text-cyan-400">
                {tips[currentTipIndex].title}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {currentTipIndex + 1} of {tips.length}
              </span>
            </div>
            <p className={`leading-relaxed text-[11.5px] ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
              {tips[currentTipIndex].desc}
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
            {tips[currentTipIndex].action && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  tips[currentTipIndex].action!();
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold text-xs transition flex items-center justify-between cursor-pointer shadow-sm"
              >
                <span>{tips[currentTipIndex].actionLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                onClick={handleNextTip}
                className={`text-[11px] font-semibold transition cursor-pointer flex items-center space-x-1 ${
                  isLight ? 'text-slate-600 hover:text-slate-900' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Next Insight</span>
                <ChevronRight className="w-3 h-3" />
              </button>
              <span className="text-[10px] font-mono text-slate-400">
                PayPal AI Hackathon 2026
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modern Sleek Floating Copilot Button */}
      <button
        onClick={handleToggleOpen}
        title="Open Sentinel Protocol Copilot"
        className={`relative p-3.5 rounded-full border shadow-xl transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-95 group ${
          isOpen
            ? 'bg-[#0070BA] text-white border-blue-400'
            : isLight
            ? 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200 shadow-slate-300/60'
            : 'bg-slate-900 text-cyan-300 hover:bg-slate-800 border-slate-800 shadow-black/80'
        }`}
      >
        <Bot className="w-5 h-5 text-blue-600 dark:text-cyan-400 group-hover:scale-110 transition-transform" />
        
        {/* Subtle Online Badge */}
        <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-950" />
      </button>

    </div>
  );
}
