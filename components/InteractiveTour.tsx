'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, X, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '@/lib/sounds';

import { NavTab } from './Navbar';

interface InteractiveTourProps {
  isActive: boolean;
  onClose: () => void;
  onNavigateTab: (tab: NavTab) => void;
  onSetBudget: (val: number) => void;
  onSearch: (query: string) => void;
  onTriggerCheckout: () => void;
  onTriggerDispute: () => void;
}

export default function InteractiveTour({
  isActive,
  onClose,
  onNavigateTab,
  onSetBudget,
  onSearch,
  onTriggerCheckout,
  onTriggerDispute,
}: InteractiveTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 100, y: 100 });
  const [cursorClicking, setCursorClicking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const steps = [
    {
      title: 'Step 1: Enforce Buyer Spending Mandate',
      desc: 'Locking maximum spend ceiling to $85.00 USD with strict zero-overage guardrails.',
      action: () => {
        onNavigateTab('canvas');
        setCursorPos({ x: 620, y: 250 });
        setTimeout(() => {
          setCursorClicking(true);
          onSetBudget(85);
          playSound('click');
          setTimeout(() => setCursorClicking(false), 300);
        }, 1200);
      },
    },
    {
      title: 'Step 2: AI Multi-Agent Procurement & Negotiation',
      desc: 'Shopper Agent queries merchant catalog, arbitrates 10% partner discount & green offsets.',
      action: () => {
        setCursorPos({ x: 500, y: 190 });
        setTimeout(() => {
          setCursorClicking(true);
          onSearch('Eco Travel Backpack 30L');
          playSound('agent');
          setTimeout(() => setCursorClicking(false), 300);
        }, 1000);
      },
    },
    {
      title: 'Step 3: PayPal Orders v2 Sandbox Capture',
      desc: 'Executing 1-Click Cryptographic Sandbox Checkout with signed Ed25519 nonce.',
      action: () => {
        setCursorPos({ x: 920, y: 550 });
        setTimeout(() => {
          setCursorClicking(true);
          onTriggerCheckout();
          playSound('success');
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.6 },
          });
          setTimeout(() => setCursorClicking(false), 400);
        }, 1200);
      },
    },
    {
      title: 'Step 4: AG Grid Enterprise Intelligence Terminal',
      desc: 'Switching to AG Grid v36 table to inspect real-time transaction streaming telemetry.',
      action: () => {
        setCursorPos({ x: 530, y: 65 });
        setTimeout(() => {
          setCursorClicking(true);
          onNavigateTab('merchant');
          playSound('click');
          setTimeout(() => setCursorClicking(false), 300);
        }, 1000);
      },
    },
    {
      title: 'Step 5: Autonomous AI PayPal Dispute Defense',
      desc: 'AI Auditor verifies transaction safety & generates legally structured Dispute Dossier.',
      action: () => {
        onNavigateTab('dispute');
        setCursorPos({ x: 380, y: 350 });
        setTimeout(() => {
          setCursorClicking(true);
          onTriggerDispute();
          playSound('success');
          setTimeout(() => setCursorClicking(false), 300);
        }, 1200);
      },
    },
  ];

  useEffect(() => {
    if (!isActive || isPaused) return;

    steps[currentStep].action();

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        // Loop or finish
        setTimeout(() => {
          setCurrentStep(0);
        }, 3000);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [isActive, currentStep, isPaused]);

  if (!isActive) return null;

  const activeInfo = steps[currentStep];

  return (
    <>
      {/* Virtual Autonomous Animated Cursor */}
      <div
        className="fixed pointer-events-none z-[100] transition-all duration-700 ease-out"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
          transform: cursorClicking ? 'scale(0.85)' : 'scale(1)',
        }}
      >
        <div className="relative">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
              fill="#00CFE8"
              stroke="#003087"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute top-5 left-5 px-2 py-0.5 rounded-md bg-blue-600 text-white font-mono text-[9px] font-bold shadow-lg whitespace-nowrap animate-pulse">
            Agentic AI Cursor
          </div>
          {cursorClicking && (
            <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full border-2 border-cyan-400 animate-ping opacity-75" />
          )}
        </div>
      </div>

      {/* Floating Tour HUD Controller */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] max-w-xl w-full px-4 animate-in slide-in-from-bottom-8 duration-300">
        <div className="bg-slate-900/95 border-2 border-cyan-500/50 backdrop-blur-2xl rounded-3xl p-4 text-white shadow-2xl shadow-cyan-500/20">
          
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-mono text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Autonomous Interactive Tour</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition cursor-pointer"
                title={isPaused ? 'Resume Tour' : 'Pause Tour'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 transition cursor-pointer"
                title="Exit Tour"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="py-2.5 space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center space-x-2">
              <span>{activeInfo.title}</span>
            </h4>
            <p className="text-xs text-slate-300 font-sans">{activeInfo.desc}</p>
          </div>

          {/* 5-Step Progress Indicators */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentStep
                    ? 'bg-cyan-400 shadow-md shadow-cyan-400/50'
                    : i < currentStep
                    ? 'bg-blue-600'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
