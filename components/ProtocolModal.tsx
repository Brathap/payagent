'use client';

import React from 'react';
import { X, Cpu, ShieldCheck, Key, Code2, ArrowRight, Layers, CheckCircle } from 'lucide-react';

interface ProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProtocolModal({ isOpen, onClose }: ProtocolModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="glass-panel-glow rounded-3xl max-w-3xl w-full p-5 sm:p-7 border border-blue-500/30 text-white shadow-2xl relative my-auto">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center space-x-2">
              <span>APCP &bull; Agentic Payment Consent Protocol</span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold border border-cyan-500/20">
                v1.0 Spec
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Cryptographic Intent Verification &times; PayPal Orders v2 REST Architecture
            </p>
          </div>
        </div>

        {/* Visual Architecture Steps */}
        <div className="space-y-4 text-xs font-mono">
          
          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-blue-400 font-bold">
              <span className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-[11px] text-blue-300">1</span>
                <span>User Spending Mandate Signing</span>
              </span>
              <span className="text-[10px] text-slate-400">Client-Side Enclave</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              The buyer defines an inviolable spend ceiling ($100 max) and sustainability constraints. When an item is selected, the client signs an <code>Ed25519</code> intent nonce binding the buyer to that exact transaction cap.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-indigo-400 font-bold">
              <span className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[11px] text-indigo-300">2</span>
                <span>Multi-Agent Inventory &amp; Rebate Arbitration</span>
              </span>
              <span className="text-[10px] text-slate-400">Autonomous Tool Calling</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              The Shopper Agent and Merchant API negotiate bundle rebates (-10%) and calculate a carbon-offset micro-contribution (PayPal Green Commerce).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[11px] text-emerald-300">3</span>
                <span>PayPal Orders v2 Sandbox API Handshake</span>
              </span>
              <span className="text-[10px] text-slate-400">OAuth 2.0 Client Credentials</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              The backend calls <code>POST /v2/checkout/orders</code> with intent <code>CAPTURE</code>. Upon user authorization, <code>POST /v2/checkout/orders/{'{id}'}/capture</code> settles the funds and returns an immutable transaction ID.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-cyan-400 font-bold">
              <span className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center text-[11px] text-cyan-300">4</span>
                <span>AG Grid Real-Time Telemetry &amp; Dispute Shield</span>
              </span>
              <span className="text-[10px] text-slate-400">AG Grid Community v36</span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed">
              All transactions mutate the AG Grid state without page reload. If a dispute arises, the merchant copilot generates a court-ready evidence dossier citing the cryptographic signature hash and PayPal session telemetry.
            </p>
          </div>

        </div>

        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>Compliant with PayPal Seller Protection</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition font-sans cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>

      </div>
    </div>
  );
}
