'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, MessageSquare, Volume2, ShieldCheck, Zap, X, ChevronRight, Bot } from 'lucide-react';
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
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const tips = [
    'Hey! I am Sentinel, your PayPal autonomous copilot. I enforce your spending ceiling so you never overspend.',
    'I just negotiated a 10% partner rebate on the AeroGlide backpack and signed an Ed25519 consent nonce!',
    'Transactions settle in 1.2s via PayPal Orders v2 Sandbox. You can inspect live rows in the AG Grid Terminal.',
    'Click "Run 1-Click Demo" to watch me autonomously procure and stage an order with zero friction!',
  ];

  // Eye blinking animation cycle
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  const handleAvatarClick = () => {
    if (soundEnabled) playSound('click');
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      const msg = tips[currentMessageIndex];
      setIsTalking(true);
      if (soundEnabled) speakVoice(msg);
      setTimeout(() => setIsTalking(false), 3500);
    }
  };

  const handleNextTip = () => {
    if (soundEnabled) playSound('click');
    const nextIdx = (currentMessageIndex + 1) % tips.length;
    setCurrentMessageIndex(nextIdx);
    const msg = tips[nextIdx];
    setIsTalking(true);
    if (soundEnabled) speakVoice(msg);
    setTimeout(() => setIsTalking(false), 3500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Speech / Dialog Bubble */}
      {isOpen && (
        <div className={`mb-3 w-80 sm:w-88 rounded-3xl p-4 sm:p-5 border shadow-2xl transition-all animate-in slide-in-from-bottom-4 duration-300 relative ${
          isLight
            ? 'bg-white/95 backdrop-blur-xl border-slate-200/90 text-slate-800 shadow-blue-500/10'
            : 'bg-[#0b111e]/95 backdrop-blur-xl border-cyan-500/30 text-white shadow-cyan-500/10'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider font-mono text-blue-600 dark:text-cyan-400">
                Sentinel AI Copilot
              </span>
              <span className="px-1.5 py-0.2 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 text-[9px] font-mono font-bold border border-cyan-500/20">
                v2.4
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body message */}
          <div className="py-3 text-xs leading-relaxed">
            <p className={isLight ? 'text-slate-700' : 'text-slate-300'}>
              {tips[currentMessageIndex]}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="space-y-1.5 pt-1 border-t border-slate-100 dark:border-white/10">
            {onTriggerDemo && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onTriggerDemo();
                }}
                className="w-full px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-200" />
                  <span>Run 1-Click Autonomous Demo</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-center space-x-2 pt-1">
              {onTriggerVoice && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onTriggerVoice();
                  }}
                  className={`flex-1 px-2.5 py-1.5 rounded-xl border text-[11px] font-bold transition flex items-center justify-center space-x-1 cursor-pointer ${
                    isLight
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                  }`}
                >
                  <Volume2 className="w-3 h-3 text-cyan-400" />
                  <span>Voice Command</span>
                </button>
              )}

              <button
                onClick={handleNextTip}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition flex items-center space-x-1 cursor-pointer ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-blue-600'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-cyan-300'
                }`}
                title="Next Copilot Insight"
              >
                <span>Next Tip</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Animated Avatar Button */}
      <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
        
        {/* Pulsing Ambient Glow Ring */}
        <div className={`absolute -inset-1 rounded-full opacity-75 blur-md transition duration-500 group-hover:opacity-100 ${
          isTalking
            ? 'bg-gradient-to-r from-cyan-400 via-rose-500 to-indigo-500 animate-spin'
            : 'bg-gradient-to-r from-blue-600 to-cyan-400 group-hover:blur-lg'
        }`} />

        {/* Floating Tooltip Pill */}
        {!isOpen && (
          <div className={`absolute right-16 top-3 px-3 py-1 rounded-full text-[10.5px] font-mono font-bold whitespace-nowrap shadow-lg border transition pointer-events-none ${
            isLight
              ? 'bg-white/95 text-slate-800 border-slate-200'
              : 'bg-slate-900/95 text-cyan-300 border-cyan-400/30'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block mr-1.5 animate-ping" />
            Sentinel AI &bull; Tap Me!
          </div>
        )}

        {/* 3D Cyber Bot Avatar Graphic */}
        <div className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform group-hover:scale-105 active:scale-95 border-2 ${
          isLight
            ? 'bg-gradient-to-b from-white to-slate-100 border-blue-500 shadow-blue-500/20'
            : 'bg-gradient-to-b from-slate-900 via-[#0b1329] to-[#060911] border-cyan-400/80 shadow-cyan-500/30'
        }`}>
          
          <svg viewBox="0 0 100 100" className="w-11 h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00CFE8" />
                <stop offset="50%" stopColor="#0070BA" />
                <stop offset="100%" stopColor="#4F46E5" />
              </linearGradient>
              <linearGradient id="visorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#050B14" />
                <stop offset="100%" stopColor="#0E1E38" />
              </linearGradient>
            </defs>

            {/* Antenna with Pulsing Beacon */}
            <rect x="47" y="10" width="6" height="14" rx="3" fill="url(#avatarGrad)" />
            <circle cx="50" cy="8" r="5" fill="#00CFE8" className={isTalking ? 'animate-ping' : ''} />
            <circle cx="50" cy="8" r="3" fill="#ffffff" />

            {/* Head Chasis */}
            <rect x="20" y="24" width="60" height="52" rx="22" fill="url(#avatarGrad)" />
            
            {/* Visor Screen */}
            <rect x="26" y="32" width="48" height="34" rx="14" fill="url(#visorGrad)" stroke="#00CFE8" strokeWidth="1.5" />

            {/* LED Glowing Cyber Eyes */}
            {isBlinking ? (
              <>
                <line x1="34" y1="48" x2="44" y2="48" stroke="#00CFE8" strokeWidth="3" strokeLinecap="round" />
                <line x1="56" y1="48" x2="66" y2="48" stroke="#00CFE8" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="39" cy="48" r="5.5" fill="#00CFE8" />
                <circle cx="40" cy="46" r="2" fill="#ffffff" />
                <circle cx="61" cy="48" r="5.5" fill="#00CFE8" />
                <circle cx="62" cy="46" r="2" fill="#ffffff" />
              </>
            )}

            {/* Cute animated soundwave mouth when talking */}
            {isTalking ? (
              <g className="animate-pulse">
                <line x1="42" y1="58" x2="44" y2="58" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
                <line x1="47" y1="56" x2="49" y2="60" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
                <line x1="52" y1="58" x2="54" y2="58" stroke="#34D399" strokeWidth="2" strokeLinecap="round" />
              </g>
            ) : (
              <path d="M44 58 Q50 62 56 58" stroke="#00CFE8" strokeWidth="2" strokeLinecap="round" fill="none" />
            )}

            {/* Side Ear Comms */}
            <rect x="14" y="42" width="6" height="16" rx="3" fill="#0070BA" />
            <rect x="80" y="42" width="6" height="16" rx="3" fill="#0070BA" />
          </svg>

          {/* Active Status Dot */}
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
        </div>
      </div>

    </div>
  );
}
