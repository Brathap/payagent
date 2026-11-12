'use client';

import React from 'react';
import { X, Cpu, ShieldCheck, Key, Code2, ArrowRight, Layers, CheckCircle } from 'lucide-react';

interface ProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'light' | 'dark';
}

export default function ProtocolModal({ isOpen, onClose, theme = 'light' }: ProtocolModalProps) {
  if (!isOpen) return null;
  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className={`rounded-3xl max-w-3xl w-full p-5 sm:p-7 border shadow-2xl relative my-auto transition-colors ${
        isLight
          ? 'bg-white border-blue-200 text-slate-900 shadow-blue-500/10'
          : 'bg-[#0b111e] border-blue-500/30 text-white shadow-2xl'
      }`}>
        
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-2 rounded-xl transition ${
            isLight
              ? 'text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200'
              : 'text-slate-400 hover:text-white bg-white/5 hover:bg-white/10'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center space-x-2">
              <span className={isLight ? 'text-slate-900 font-black' : 'text-white font-black'}>
                APCP &bull; Agentic Payment Consent Protocol
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
              }`}>
                v1.0 Spec
              </span>
            </h3>
            <p className={`text-xs font-mono font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Cryptographic Intent Verification &times; PayPal Orders v2 REST Architecture
            </p>
          </div>
        </div>

        {/* Visual Architecture Steps */}
        <div className="space-y-3.5 text-xs font-mono">
          
          <div className={`p-4 rounded-2xl border space-y-2 ${
            isLight ? 'bg-slate-50/90 border-slate-200 shadow-sm' : 'bg-black/50 border-white/5'
          }`}>
            <div className={`flex items-center justify-between font-bold ${
              isLight ? 'text-blue-700 font-bold' : 'text-blue-400 font-bold'
            }`}>
              <span className="flex items-center space-x-2 text-xs">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  isLight ? 'bg-blue-600 text-white' : 'bg-blue-500/20 text-blue-300'
                }`}>1</span>
                <span>User Spending Mandate Signing</span>
              </span>
              <span className={`text-[10.5px] font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Client-Side Enclave
              </span>
            </div>
            <p className={`font-sans text-xs leading-relaxed ${
              isLight ? 'text-slate-800 font-medium' : 'text-slate-300'
            }`}>
              The buyer defines an inviolable spend ceiling ($100 max) and sustainability constraints. When an item is selected, the client signs an <code className={isLight ? 'bg-slate-200 text-blue-900 px-1 py-0.5 rounded font-mono font-bold' : 'bg-white/10 px-1 py-0.5 rounded'}>Ed25519</code> intent nonce binding the buyer to that exact transaction cap.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-2 ${
            isLight ? 'bg-slate-50/90 border-slate-200 shadow-sm' : 'bg-black/50 border-white/5'
          }`}>
            <div className={`flex items-center justify-between font-bold ${
              isLight ? 'text-indigo-700 font-bold' : 'text-indigo-400 font-bold'
            }`}>
              <span className="flex items-center space-x-2 text-xs">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  isLight ? 'bg-indigo-600 text-white' : 'bg-indigo-500/20 text-indigo-300'
                }`}>2</span>
                <span>Multi-Agent Inventory &amp; Rebate Arbitration</span>
              </span>
              <span className={`text-[10.5px] font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                Autonomous Tool Calling
              </span>
            </div>
            <p className={`font-sans text-xs leading-relaxed ${
              isLight ? 'text-slate-800 font-medium' : 'text-slate-300'
            }`}>
              The Shopper Agent and Merchant API negotiate bundle rebates (-10%) and calculate a carbon-offset micro-contribution (PayPal Green Commerce).
            </p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-2 ${
            isLight ? 'bg-slate-50/90 border-slate-200 shadow-sm' : 'bg-black/50 border-white/5'
          }`}>
            <div className={`flex items-center justify-between font-bold ${
              isLight ? 'text-emerald-700 font-bold' : 'text-emerald-400 font-bold'
            }`}>
              <span className="flex items-center space-x-2 text-xs">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  isLight ? 'bg-emerald-600 text-white' : 'bg-emerald-500/20 text-emerald-300'
                }`}>3</span>
                <span>PayPal Orders v2 Sandbox API Handshake</span>
              </span>
              <span className={`text-[10.5px] font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                OAuth 2.0 Client Credentials
              </span>
            </div>
            <p className={`font-sans text-xs leading-relaxed ${
              isLight ? 'text-slate-800 font-medium' : 'text-slate-300'
            }`}>
              The backend calls <code className={isLight ? 'bg-slate-200 text-emerald-900 px-1 py-0.5 rounded font-mono font-bold' : 'bg-white/10 px-1 py-0.5 rounded'}>POST /v2/checkout/orders</code> with intent <code className={isLight ? 'bg-slate-200 text-emerald-900 px-1 py-0.5 rounded font-mono font-bold' : 'bg-white/10 px-1 py-0.5 rounded'}>CAPTURE</code>. Upon user authorization, <code className={isLight ? 'bg-slate-200 text-emerald-900 px-1 py-0.5 rounded font-mono font-bold' : 'bg-white/10 px-1 py-0.5 rounded'}>POST /v2/checkout/orders/{'{id}'}/capture</code> settles the funds and returns an immutable transaction ID.
            </p>
          </div>

          <div className={`p-4 rounded-2xl border space-y-2 ${
            isLight ? 'bg-slate-50/90 border-slate-200 shadow-sm' : 'bg-black/50 border-white/5'
          }`}>
            <div className={`flex items-center justify-between font-bold ${
              isLight ? 'text-cyan-700 font-bold' : 'text-cyan-400 font-bold'
            }`}>
              <span className="flex items-center space-x-2 text-xs">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                  isLight ? 'bg-cyan-600 text-white' : 'bg-cyan-500/20 text-cyan-300'
                }`}>4</span>
                <span>AG Grid Real-Time Telemetry &amp; Dispute Shield</span>
              </span>
              <span className={`text-[10.5px] font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                AG Grid Community v36
              </span>
            </div>
            <p className={`font-sans text-xs leading-relaxed ${
              isLight ? 'text-slate-800 font-medium' : 'text-slate-300'
            }`}>
              All transactions mutate the AG Grid state without page reload. If a dispute arises, the merchant copilot generates a court-ready evidence dossier citing the cryptographic signature hash and PayPal session telemetry.
            </p>
          </div>

        </div>

        <div className={`mt-5 pt-4 border-t flex items-center justify-between text-xs font-mono ${
          isLight ? 'border-slate-200' : 'border-white/10'
        }`}>
          <div className={`flex items-center space-x-1.5 font-bold ${
            isLight ? 'text-emerald-700' : 'text-emerald-400'
          }`}>
            <ShieldCheck className="w-4 h-4" />
            <span>Compliant with PayPal Seller Protection</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold transition font-sans cursor-pointer shadow-md"
          >
            Close Blueprint
          </button>
        </div>

      </div>
    </div>
  );
}
