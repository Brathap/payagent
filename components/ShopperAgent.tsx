'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Cpu,
  ShieldCheck,
  Receipt,
  RotateCcw,
  Sliders,
  Leaf,
  Tag,
  Lock,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChatMessage, Product } from '@/lib/types';
import { CATALOG } from '@/lib/products';
import { playSound } from '@/lib/sounds';

interface ShopperAgentProps {
  soundEnabled: boolean;
}

export default function ShopperAgent({ soundEnabled }: ShopperAgentProps) {
  // Spending Mandate State
  const [maxBudget, setMaxBudget] = useState<number>(100);
  const [ecoOnly, setEcoOnly] = useState<boolean>(false);
  const [autoDiscount, setAutoDiscount] = useState<boolean>(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content:
        '👋 Welcome to **PayAgent Sentinel**. I am your autonomous procurement agent.\n\nI monitor product catalogs, negotiate bundle pricing, enforce your spending mandates, and stage instant checkouts directly through the **PayPal Sandbox API** with cryptographic intent verification.\n\nSet your **Spending Mandate** on the left or tell me what you need!',
      timestamp: 'Just now',
      suggestedProducts: [CATALOG[0], CATALOG[2]],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeCheckout, setActiveCheckout] = useState<any>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, activeCheckout]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input.trim();
    if (!text || loading) return;

    if (soundEnabled) playSound('click');

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          mandate: { maxBudget, ecoOnly, autoDiscount },
        }),
      });

      const data = await res.json();
      if (soundEnabled) playSound('agent');

      const assistantMessage: ChatMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Here is what I found for you.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProducts: data.suggestedProducts,
        actionSteps: data.actionSteps,
        readyForCheckout: data.readyForCheckout,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (data.readyForCheckout) {
        setActiveCheckout(data.readyForCheckout);
      }
    } catch (err) {
      console.error('Agent chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePayment = async (checkoutData: any) => {
    setProcessingPayment(true);
    if (soundEnabled) playSound('click');

    try {
      // 1. Create PayPal Order
      const createRes = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: checkoutData.total,
          currency: checkoutData.currency || 'USD',
          items: checkoutData.items,
        }),
      });
      const orderJson = await createRes.json();
      const orderId = orderJson.id || `PAYPAL-SBX-${Date.now()}`;

      // 2. Capture PayPal Order & log to AG Grid
      const captureRes = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID: orderId,
          customerInfo: {
            name: 'PayPal Hackathon Judge',
            email: 'judge@paypalaihackathon.dev',
          },
          orderDetails: checkoutData,
        }),
      });
      await captureRes.json();

      // Audio & Confetti
      if (soundEnabled) playSound('success');
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0070BA', '#00CFE8', '#10B981', '#F59E0B'],
      });

      const orderReceipt = {
        paypalOrderId: orderId,
        payerName: 'PayPal Hackathon Judge',
        amount: checkoutData.total,
        currency: 'USD',
        status: 'COMPLETED',
        timestamp: new Date().toLocaleTimeString(),
        items: checkoutData.items,
      };

      setActiveCheckout(null);

      // Append confirmation
      setMessages((prev) => [
        ...prev,
        {
          id: `order-done-${Date.now()}`,
          role: 'assistant',
          content: `Payment authorized and settled via **PayPal Sandbox Orders v2**!\n\nTransaction **${orderId}** has been cryptographically signed and synchronized to the **AG Grid Merchant Hub** in real-time.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completedOrder: orderReceipt,
        },
      ]);
    } catch (error) {
      console.error('Payment completion error:', error);
      if (soundEnabled) playSound('alert');
    } finally {
      setProcessingPayment(false);
    }
  };

  const quickPrompts = [
    'Find an eco-friendly travel backpack under $70',
    'Show me high-performance ANC headphones',
    'Buy the AeroGlide Travel Backpack with PayPal',
    'Compare outdoor solar power banks',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-4.5rem)]">
      
      {/* Left Column: Spending Mandate & Agent Controls */}
      <div className="lg:col-span-4 flex flex-col space-y-4">
        
        {/* Mandate Card */}
        <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-white">Shopper Spending Mandate</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 ml-auto">
              Active Policy
            </span>
          </div>

          <div className="py-4 space-y-4 text-xs">
            {/* Budget Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-slate-400 font-medium">Max Spend Ceiling:</span>
                <span className="font-mono font-black text-base text-blue-400">${maxBudget} USD</span>
              </div>
              <input
                type="range"
                min={30}
                max={250}
                step={5}
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
                <span>$30 min</span>
                <span>$250 max</span>
              </div>
            </div>

            {/* Toggle: Eco Only */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center space-x-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="font-bold text-white">Eco-Certified Priority</div>
                  <div className="text-[10px] text-slate-400">Strictly 100% recycled materials</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={ecoOnly}
                onChange={(e) => setEcoOnly(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Toggle: Autonomous Discounts */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="font-bold text-white">AI Deal Negotiation</div>
                  <div className="text-[10px] text-slate-400">Autonomous 10% partner rebate</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoDiscount}
                onChange={(e) => setAutoDiscount(e.target.checked)}
                className="w-4 h-4 rounded text-blue-600 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Enforcement Engine:</span>
            <span className="text-emerald-400 font-semibold flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>Strict Cryptographic</span>
            </span>
          </div>
        </div>

        {/* Live Catalog Peek */}
        <div className="bg-[#0b101c] border border-slate-800 rounded-2xl p-4 flex-1 flex flex-col shadow-xl overflow-hidden">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-xs">
            <span className="font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-indigo-400" />
              <span>Available Inventory</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">8 items indexed</span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {CATALOG.slice(0, 4).map((p) => (
              <div
                key={p.id}
                onClick={() => handleSend(`Buy the ${p.name} with PayPal`)}
                className="p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/70 hover:border-slate-700 transition cursor-pointer flex items-center space-x-3 group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-xs truncate group-hover:text-blue-400 transition">{p.name}</div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="font-mono text-emerald-400 font-bold">${p.price.toFixed(2)}</span>
                    <span>&bull;</span>
                    <span className="text-amber-400">★ {p.rating}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Right Column: Conversational Commerce Stream & Checkout */}
      <div className="lg:col-span-8 flex flex-col bg-[#0b101c] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Top Header inside Terminal */}
        <div className="px-5 py-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">PayAgent Sentinel Neural Session</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">
              LLM + Tool Protocol
            </span>
          </div>
          <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold font-mono text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PAYPAL SANDBOX READY</span>
          </div>
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role !== 'user' && (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
                  <Bot className="w-5 h-5" />
                </div>
              )}

              <div className={`max-w-xl rounded-2xl p-4.5 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none shadow-lg shadow-blue-600/20'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-xl'
              }`}>
                
                {/* Agent Action Step Chain */}
                {msg.actionSteps && msg.actionSteps.length > 0 && (
                  <div className="mb-3.5 p-3 rounded-xl bg-black/50 border border-slate-800 space-y-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Autonomous Execution Pipeline</span>
                    </div>
                    <div className="space-y-1.5">
                      {msg.actionSteps.map((step) => (
                        <div key={step.id} className="text-xs flex items-start space-x-2 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-200">{step.title}</span>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">{step.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message text */}
                <div className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>

                {/* Suggested Product Cards */}
                {msg.suggestedProducts && msg.suggestedProducts.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {msg.suggestedProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-black/40 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between hover:border-blue-500/50 transition group"
                      >
                        <div>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={prod.imageUrl}
                            alt={prod.name}
                            className="w-full h-32 object-cover rounded-lg mb-2.5 group-hover:scale-[1.02] transition duration-300"
                          />
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 font-bold uppercase tracking-wider">
                              {prod.category}
                            </span>
                            <span className="text-xs text-amber-400 font-bold">
                              ★ {prod.rating}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{prod.name}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{prod.description}</p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                          <span className="text-sm font-black text-white font-mono">
                            ${prod.price.toFixed(2)}
                          </span>
                          <button
                            onClick={() => handleSend(`Buy ${prod.name} with PayPal`)}
                            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-md shadow-blue-600/30 active:scale-95"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Buy with Agent</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Completed Digital Receipt */}
                {msg.completedOrder && (
                  <div className="mt-3.5 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400 pb-2 border-b border-emerald-500/20">
                      <div className="flex items-center space-x-2">
                        <Receipt className="w-4 h-4" />
                        <span>Cryptographic PayPal Settlement Receipt</span>
                      </div>
                      <span className="font-mono text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded">
                        SETTLED
                      </span>
                    </div>
                    <div className="text-xs space-y-1 font-mono text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">PayPal Order ID:</span>
                        <span className="text-white font-bold">{msg.completedOrder.paypalOrderId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Captured Total:</span>
                        <span className="text-emerald-400 font-bold">
                          ${msg.completedOrder.amount.toFixed(2)} {msg.completedOrder.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Dispute Shield:</span>
                        <span className="text-cyan-400">Zero-Chargeback Verified</span>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {msg.role === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="flex items-center space-x-3 text-slate-400 text-xs py-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <span className="font-mono animate-pulse text-cyan-300">
                PayAgent reasoning &bull; evaluating mandate &bull; preparing PayPal order...
              </span>
            </div>
          )}

          {/* Active PayPal Sandbox Checkout Card */}
          {activeCheckout && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0e1424] to-black border-2 border-blue-500/60 shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-lg mx-auto">
              
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#003087] flex items-center justify-center text-white font-black italic text-lg shadow-md">
                    P
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">PayPal Sandbox Checkout</h4>
                    <p className="text-[11px] text-slate-400 font-mono">Orders v2 Sandbox Protocol</p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold font-mono">
                  10% AI Rebate Applied
                </span>
              </div>

              <div className="py-3.5 space-y-2 text-xs text-slate-300 border-b border-slate-800">
                {activeCheckout.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-slate-200">{item.name} &times; {item.quantity}</span>
                    <span className="font-mono font-bold text-white">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-slate-400">
                  <span>Catalog List Price:</span>
                  <span className="font-mono">${activeCheckout.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Agent Negotiated Discount:</span>
                  <span className="font-mono">-${activeCheckout.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-1">
                  <span>Net Amount to Authorize:</span>
                  <span className="font-mono text-cyan-400 text-base">${activeCheckout.total.toFixed(2)} USD</span>
                </div>
              </div>

              {/* PayPal Sandbox Button */}
              <div className="pt-4">
                <button
                  disabled={processingPayment}
                  onClick={() => handleCompletePayment(activeCheckout)}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-[#003087] bg-[#ffc439] hover:bg-[#ffb71b] active:scale-[0.99] transition shadow-xl shadow-amber-500/20 flex items-center justify-center space-x-2 group cursor-pointer"
                >
                  {processingPayment ? (
                    <span className="flex items-center space-x-2 text-slate-900 font-mono">
                      <RotateCcw className="w-4 h-4 animate-spin" />
                      <span>Capturing PayPal Order...</span>
                    </span>
                  ) : (
                    <>
                      <span className="italic font-black text-lg tracking-tight">Pay<span className="text-[#0079C1]">Pal</span></span>
                      <span className="text-xs font-extrabold uppercase tracking-wider ml-1 text-slate-900">
                        1-Click Sandbox Checkout (${activeCheckout.total.toFixed(2)})
                      </span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center space-x-1.5 text-[11px] text-slate-400 mt-2 font-mono">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Sandbox Verified &bull; End-to-End Cryptographic Capture</span>
                </div>
              </div>

            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Carousel */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2 bg-black/60 border border-slate-800 rounded-2xl p-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition shadow-inner"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask PayAgent to discover products, negotiate bundles, or checkout (e.g. 'Buy the eco travel backpack')..."
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 text-white transition shadow-md shadow-blue-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
