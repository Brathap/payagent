'use client';

import React, { useState } from 'react';
import { Terminal, Send, CheckCircle, Copy, Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { playSound } from '@/lib/sounds';

interface ApiPlaygroundProps {
  soundEnabled: boolean;
  theme?: 'light' | 'dark';
}

export default function ApiPlayground({ soundEnabled, theme = 'light' }: ApiPlaygroundProps) {
  const isLight = theme === 'light';

  const [activeEndpoint, setActiveEndpoint] = useState<'create' | 'capture' | 'webhook'>('create');
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [responseLog, setResponseLog] = useState<string | null>(null);

  const endpoints = {
    create: {
      method: 'POST',
      url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer A21AAJ...[PayPal_OAuth2_Token]',
        'PayPal-Request-Id': '7b1c4e9d-1144-4b55-a0c3-982e5d120a11',
      },
      payload: {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: 'PU-AEROGLIDE-30L',
            description: 'AeroGlide Eco Travel Backpack 30L (AI Agent Dispatched)',
            amount: {
              currency_code: 'USD',
              value: '61.70',
              breakdown: {
                item_total: { currency_code: 'USD', value: '68.00' },
                discount: { currency_code: 'USD', value: '6.80' },
                handling: { currency_code: 'USD', value: '0.50' },
              },
            },
            items: [
              {
                name: 'AeroGlide Eco Travel Backpack 30L',
                unit_amount: { currency_code: 'USD', value: '68.00' },
                quantity: '1',
                category: 'PHYSICAL_GOODS',
              },
            ],
          },
        ],
        application_context: {
          brand_name: 'PayPal NOVA Autonomous Commerce',
          user_action: 'PAY_NOW',
          shipping_preference: 'NO_SHIPPING',
        },
      },
    },
    capture: {
      method: 'POST',
      url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders/5KJ82910AA331201/capture',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer A21AAJ...[PayPal_OAuth2_Token]',
      },
      payload: {
        note_to_payer: 'Captured via PayAgent Sentinel APCP Autonomous Protocol',
      },
    },
    webhook: {
      method: 'POST',
      url: 'https://your-webhook-listener.com/api/paypal/webhook',
      headers: {
        'Content-Type': 'application/json',
        'PAYPAL-AUTH-ALGO': 'SHA256withRSA',
        'PAYPAL-TRANSMISSION-ID': 'tx-81a9c3-99b2',
      },
      payload: {
        id: 'WH-EVENT-99814421',
        event_version: '1.0',
        create_time: '2026-11-12T12:00:00Z',
        event_type: 'CHECKOUT.ORDER.APPROVED',
        resource_type: 'checkout-order',
        summary: 'PayPal Sandbox Order 5KJ82910AA331201 authorized by buyer',
        resource: {
          id: '5KJ82910AA331201',
          status: 'APPROVED',
          intent: 'CAPTURE',
        },
      },
    },
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (soundEnabled) playSound('click');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateApiCall = () => {
    setSimulating(true);
    if (soundEnabled) playSound('click');
    setTimeout(() => {
      setSimulating(false);
      if (soundEnabled) playSound('success');
      setResponseLog(
        JSON.stringify(
          {
            status: 'HTTP/2 201 Created',
            order_id: `PAYPAL-SBX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
            intent: 'CAPTURE',
            state: 'COMPLETED',
            apcp_attestation: 'VERIFIED_ED25519_CONSENT',
            debug_id: Math.random().toString(16).substring(2, 14),
            links: [
              { href: 'https://api-m.sandbox.paypal.com/v2/checkout/orders/...', rel: 'self', method: 'GET' },
            ],
          },
          null,
          2
        )
      );
    }, 700);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      
      {/* Header banner */}
      <div className={`rounded-3xl p-6 relative overflow-hidden border shadow-sm ${
        isLight ? 'bg-white border-slate-200 text-slate-900' : 'nova-card'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Terminal className="w-4 h-4" />
              </span>
              <h2 className={`text-xl font-black tracking-tight ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                PayPal Developer Protocol Playground
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                isLight ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}>
                Sandbox Validated
              </span>
            </div>
            <p className={`text-xs mt-2 max-w-xl font-medium ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>
              Inspect raw REST API payloads dispatched to PayPal Sandbox v2, test order authorization, and examine cryptographic Ed25519 signature nonces.
            </p>
          </div>

          <button
            onClick={handleSimulateApiCall}
            disabled={simulating}
            className="flex items-center space-x-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition cursor-pointer self-start sm:self-auto active:scale-95"
          >
            <Zap className={`w-4 h-4 ${simulating ? 'animate-spin' : ''}`} />
            <span>{simulating ? 'Executing Sandbox Call...' : 'Test Sandbox Endpoint'}</span>
          </button>
        </div>
      </div>

      {/* Endpoint Selector Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => {
            if (soundEnabled) playSound('click');
            setActiveEndpoint('create');
            setResponseLog(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
            activeEndpoint === 'create'
              ? 'bg-[#0070BA] text-white shadow-md'
              : isLight
              ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          POST /v2/checkout/orders (Create)
        </button>

        <button
          onClick={() => {
            if (soundEnabled) playSound('click');
            setActiveEndpoint('capture');
            setResponseLog(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
            activeEndpoint === 'capture'
              ? 'bg-[#0070BA] text-white shadow-md'
              : isLight
              ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          POST /orders/{'{id}'}/capture
        </button>

        <button
          onClick={() => {
            if (soundEnabled) playSound('click');
            setActiveEndpoint('webhook');
            setResponseLog(null);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
            activeEndpoint === 'webhook'
              ? 'bg-[#0070BA] text-white shadow-md'
              : isLight
              ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          POST /webhook (Order Approved)
        </button>
      </div>

      {/* Payload Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Request Side */}
        <div className={`rounded-3xl p-5 space-y-3 border shadow-sm ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'nova-card'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            isLight ? 'border-slate-100' : 'border-slate-800'
          }`}>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded font-extrabold ${
                isLight ? 'bg-blue-100 text-blue-800' : 'bg-blue-500/20 text-blue-300'
              }`}>
                {endpoints[activeEndpoint].method}
              </span>
              <span className="truncate">{endpoints[activeEndpoint].url}</span>
            </span>
            <button
              onClick={() => handleCopy(JSON.stringify(endpoints[activeEndpoint].payload, null, 2))}
              className={`flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-lg border transition font-bold ${
                isLight
                  ? 'text-slate-700 hover:bg-slate-100 bg-slate-50 border-slate-200'
                  : 'text-slate-400 hover:text-white bg-slate-800 border-slate-700'
              }`}
            >
              {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div>
            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}>Request Headers:</span>
            <pre className={`mt-1 p-2.5 rounded-xl border font-mono text-[11px] overflow-x-auto ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-slate-800 font-semibold'
                : 'bg-black/60 border-slate-800 text-slate-300'
            }`}>
              {JSON.stringify(endpoints[activeEndpoint].headers, null, 2)}
            </pre>
          </div>

          <div>
            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold ${
              isLight ? 'text-slate-700' : 'text-slate-400'
            }`}>JSON Body:</span>
            <pre className={`mt-1 p-3 rounded-xl border font-mono text-[11px] overflow-x-auto max-h-72 ${
              isLight
                ? 'bg-slate-50 border-slate-200 text-blue-900 font-semibold'
                : 'bg-black/60 border-slate-800 text-cyan-300'
            }`}>
              {JSON.stringify(endpoints[activeEndpoint].payload, null, 2)}
            </pre>
          </div>
        </div>

        {/* Response Side */}
        <div className={`rounded-3xl p-5 space-y-3 border shadow-sm ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'nova-card'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            isLight ? 'border-slate-100' : 'border-slate-800'
          }`}>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>PayPal Sandbox Response Telemetry</span>
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-bold ${
              isLight
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}>
              HTTP 200/201 OK
            </span>
          </div>

          {responseLog ? (
            <pre className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto max-h-96 leading-relaxed ${
              isLight
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 font-bold'
                : 'bg-black/80 border-emerald-500/30 text-emerald-300'
            }`}>
              {responseLog}
            </pre>
          ) : (
            <div className="py-20 text-center space-y-3">
              <Zap className="w-8 h-8 text-blue-500 mx-auto opacity-70 animate-bounce" />
              <p className={`text-xs max-w-sm mx-auto font-medium ${
                isLight ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Click <strong>&quot;Test Sandbox Endpoint&quot;</strong> above to execute a simulated live HTTP handshake against the PayPal sandbox gateway.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
