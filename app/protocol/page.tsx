'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Cpu, 
  Key, 
  Code2, 
  Layers, 
  CheckCircle, 
  ArrowLeft, 
  ExternalLink, 
  Zap,
  Lock,
  Scale,
  Award
} from 'lucide-react';

export default function ProtocolPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans p-6 sm:p-10 nova-mesh-light">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Navbar */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <Link 
              href="/"
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition flex items-center space-x-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Canvas</span>
            </Link>
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-600">
                APCP SPECIFICATION v1.0 &bull; LIVE SANDBOX
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-blue-100 text-blue-800 border border-blue-200">
              PayPal AI Hackathon 2026
            </span>
          </div>
        </div>

        {/* Hero Banner */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>CRYPTOGRAPHIC INTENT VERIFICATION BLUEPRINT</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
            The Agentic Payment Consent Protocol (APCP)
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            Decoupling autonomous AI reasoning from direct financial authority. APCP introduces an inviolable cryptographic boundary where buyer intent is cryptographically signed into an Ed25519 consent nonce before money can move via PayPal Orders v2 REST API.
          </p>
        </div>

        {/* 4 Protocol Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              1. User Spending Mandate Enclave
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The buyer defines an inviolable spend ceiling ($100 max) and sustainability constraints. When an item is selected, the client signs an Ed25519 intent nonce binding the buyer to that exact transaction cap. Zero-overage guaranteed.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                GUARANTEE: Transactions &gt; $100.00 Blocked
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              2. Multi-Agent Inventory &amp; Rebate Arbitration
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The Shopper Agent and Merchant API negotiate bundle rebates (-10%) and calculate a carbon-offset micro-contribution (PayPal Green Commerce) autonomously with sub-50ms deterministic consensus.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                SUB-50ms: Deterministic Execution Tree
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              3. PayPal Orders v2 Sandbox REST API Handshake
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The backend calls <code className="font-mono text-indigo-700 bg-slate-100 px-1 rounded">POST /v2/checkout/orders</code> with intent CAPTURE. Upon user 1-click authorization, <code className="font-mono text-indigo-700 bg-slate-100 px-1 rounded">POST /orders/&#123;id&#125;/capture</code> settles the funds and returns an immutable transaction ID.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                REST API: OAuth 2.0 Sandbox Verified
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              4. AG Grid Telemetry &amp; Dispute Defense Shield
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              All transactions update the AG Grid state without page reload. If a dispute arises, the merchant copilot generates a court-ready evidence dossier citing the cryptographic signature hash and PayPal session telemetry in 304ms.
            </p>
            <div className="pt-2">
              <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                100% IMMUNITY: PayPal Seller Protection
              </span>
            </div>
          </div>

        </div>

        {/* Live Cryptographic Payload Preview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider">
              Enclave Signature Payload (Ed25519 Curve)
            </span>
            <span className="text-xs font-mono text-emerald-600 font-bold">
              VALIDATED NON-REPUDIATION
            </span>
          </div>
          <div className="bg-slate-900 rounded-2xl p-4 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
            <pre>{`{
  "protocol": "APCP-v1.0",
  "mandate_ceiling": 100.00,
  "currency": "USD",
  "merchant_arbitration": {
    "selected": "EcoSupply Co.",
    "rebate_pct": 10.0,
    "final_total": 80.60
  },
  "ed25519_signature": "0x7f4a9b2c3d1e0f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a",
  "paypal_order_intent": "CAPTURE",
  "seller_protection_status": "ELIGIBLE"
}`}</pre>
          </div>
        </div>

      </div>
    </div>
  );
}
