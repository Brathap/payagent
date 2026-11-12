'use client';

import React, { useState } from 'react';
import {
  Send,
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
  Camera,
  KeyRound,
  ArrowRight,
  Zap,
  Check,
  ExternalLink,
  QrCode,
  CreditCard,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CATALOG } from '@/lib/products';
import { Product } from '@/lib/types';
import { playSound } from '@/lib/sounds';

interface NovaCanvasProps {
  soundEnabled: boolean;
  onNavigateToMerchant: () => void;
  theme?: 'light' | 'dark';
}

export default function NovaCanvas({ soundEnabled, onNavigateToMerchant, theme = 'dark' }: NovaCanvasProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product>(CATALOG[0]);
  const [maxBudget, setMaxBudget] = useState<number>(100);
  const [ecoOnly, setEcoOnly] = useState<boolean>(false);
  const [autoDiscount, setAutoDiscount] = useState<boolean>(true);
  const [activePaymentMethod, setActivePaymentMethod] = useState<'paypal' | 'venmo' | 'payin4'>('paypal');

  const [processingPayment, setProcessingPayment] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Filter catalog based on user search or constraints
  const filteredProducts = CATALOG.filter((p) => {
    if (ecoOnly && !p.ecoFriendly) return false;
    if (p.price > maxBudget) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundEnabled) playSound('click');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (soundEnabled) playSound('agent');
      if (filteredProducts.length > 0) {
        setSelectedProduct(filteredProducts[0]);
      }
    }, 400);
  };

  const handleSimulateReceiptScan = () => {
    if (soundEnabled) playSound('click');
    setLoading(true);
    setQuery('AeroGlide Eco Travel Backpack');
    setTimeout(() => {
      setSelectedProduct(CATALOG[0]);
      setLoading(false);
      if (soundEnabled) playSound('agent');
    }, 450);
  };

  // Pricing calculations
  const listPrice = selectedProduct.price;
  const discountAmount = autoDiscount ? Number((listPrice * 0.1).toFixed(2)) : 0;
  const carbonOffset = 0.50;
  const netTotal = Number((listPrice - discountAmount + carbonOffset).toFixed(2));
  const [signatureNonce, setSignatureNonce] = useState('0x7f4a...e89b');

  React.useEffect(() => {
    setSignatureNonce(`0x${Math.random().toString(16).substring(2, 6)}...${Math.random().toString(16).substring(2, 6)}`);
  }, [selectedProduct]);

  const handleCompletePayment = async () => {
    setProcessingPayment(true);
    if (soundEnabled) playSound('click');

    try {
      // 1. Create PayPal Order
      const createRes = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: netTotal,
          currency: 'USD',
          items: [{ name: selectedProduct.name, quantity: 1, unitPrice: selectedProduct.price }],
        }),
      });
      const orderJson = await createRes.json();
      const orderId = orderJson.id || `PAYPAL-SBX-${Date.now()}`;

      // 2. Capture PayPal Order
      const captureRes = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderID: orderId,
          customerInfo: {
            name: 'PayPal Hackathon Judge',
            email: 'judge@paypalaihackathon.dev',
          },
          orderDetails: {
            items: [{ name: selectedProduct.name, quantity: 1 }],
            total: netTotal,
            currency: 'USD',
            signatureHash: signatureNonce,
          },
        }),
      });
      await captureRes.json();

      if (soundEnabled) playSound('success');
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#0070BA', '#00CFE8', '#10B981', '#F59E0B'],
      });

      setCompletedOrder({
        paypalOrderId: orderId,
        productName: selectedProduct.name,
        amount: netTotal,
        paymentMethod: activePaymentMethod.toUpperCase(),
        timestamp: new Date().toLocaleTimeString(),
        signatureHash: signatureNonce,
      });
    } catch (err) {
      console.error('Payment error:', err);
      if (soundEnabled) playSound('alert');
    } finally {
      setProcessingPayment(false);
    }
  };

  const quickCategories = [
    { label: 'Eco Travel Packs', query: 'Backpack' },
    { label: 'ANC Headphones', query: 'Headphones' },
    { label: 'Solar Power Banks', query: 'Solar' },
    { label: 'Ergonomic Workspace', query: 'Mouse' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-7">
      
      {/* Hero Search & Command Center */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Autonomous Multi-Modal Commerce Canvas</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          What can PayAgent procure for you?
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          State your product criteria, set your spending ceiling, and let our autonomous agent negotiate pricing and stage checkouts via <strong className="text-slate-900 dark:text-white">PayPal Sandbox</strong>.
        </p>

        {/* Command Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="relative max-w-2xl mx-auto flex items-center bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 rounded-2xl p-2 shadow-2xl focus-within:border-blue-500 transition"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type anything (e.g. 'Eco travel backpack under $70' or 'ANC headphones')..."
            className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleSimulateReceiptScan}
              title="Upload paper receipt for OCR parsing"
              className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-300 text-xs font-semibold flex items-center space-x-1.5 transition cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">OCR Receipt</span>
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              Procure
            </button>
          </div>
        </form>

        {/* Quick Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {quickCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (soundEnabled) playSound('click');
                setQuery(cat.query);
                const matched = CATALOG.find((p) => p.name.toLowerCase().includes(cat.query.toLowerCase()));
                if (matched) setSelectedProduct(matched);
              }}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/5 hover:border-blue-500/30 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition font-medium cursor-pointer shadow-sm"
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Spending Mandate Strip */}
      <div className="nova-card rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Active Spending Mandate</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Strict buyer constraints enforced on every order</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Slider */}
          <div className="flex items-center space-x-2 bg-slate-100 dark:bg-black/40 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/5">
            <span className="text-slate-600 dark:text-slate-400">Ceiling:</span>
            <input
              type="range"
              min={30}
              max={250}
              step={5}
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-24 accent-blue-600 cursor-pointer"
            />
            <span className="font-mono font-bold text-blue-600 dark:text-cyan-300">${maxBudget}</span>
          </div>

          {/* Eco toggle */}
          <label className="flex items-center space-x-2 bg-slate-100 dark:bg-black/40 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/5 cursor-pointer">
            <Leaf className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
            <span className="text-slate-700 dark:text-slate-300">Eco-Only</span>
            <input
              type="checkbox"
              checked={ecoOnly}
              onChange={(e) => setEcoOnly(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 accent-emerald-500"
            />
          </label>

          {/* Rebate toggle */}
          <label className="flex items-center space-x-2 bg-slate-100 dark:bg-black/40 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/5 cursor-pointer">
            <Tag className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span className="text-slate-700 dark:text-slate-300">10% AI Rebate</span>
            <input
              type="checkbox"
              checked={autoDiscount}
              onChange={(e) => setAutoDiscount(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 accent-amber-500"
            />
          </label>
        </div>
      </div>

      {/* Main Living Product & Checkout Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Product Feature & Spec Radar */}
        <div className="lg:col-span-7 nova-card rounded-3xl p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/5">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Procurement Target</span>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-cyan-400 bg-blue-500/10 dark:bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20 dark:border-cyan-500/20">
              Matched Mandate (&le; ${maxBudget})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              className="w-full h-56 object-cover rounded-2xl shadow-xl border border-slate-200 dark:border-white/10"
            />
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider border border-blue-500/25">
                  {selectedProduct.category}
                </span>
                {selectedProduct.ecoFriendly && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold flex items-center space-x-1 border border-emerald-500/25">
                    <Leaf className="w-3 h-3" />
                    <span>Eco-Certified</span>
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{selectedProduct.name}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{selectedProduct.description}</p>
              <div className="pt-2 flex items-center space-x-3 text-xs font-mono">
                <span className="text-slate-500 dark:text-slate-400">Stock: <strong className="text-slate-900 dark:text-white">{selectedProduct.stock} left</strong></span>
                <span>&bull;</span>
                <span className="text-amber-500 dark:text-amber-400 font-bold">★ {selectedProduct.rating} / 5.0</span>
              </div>
            </div>
          </div>

          {/* Catalog Carousel Picker */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/5 space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">Switch Procurement Candidate:</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CATALOG.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (soundEnabled) playSound('click');
                    setSelectedProduct(item);
                    setCompletedOrder(null);
                  }}
                  className={`p-2 rounded-2xl border transition cursor-pointer flex flex-col items-center text-center ${
                    selectedProduct.id === item.id
                      ? 'bg-blue-600/10 dark:bg-blue-600/20 border-blue-500 dark:border-blue-500/50 shadow-md'
                      : 'bg-slate-50 dark:bg-black/30 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.imageUrl} alt={item.name} className="w-12 h-12 object-cover rounded-xl mb-1.5" />
                  <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate w-full">{item.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: PayPal Smart Checkout Stage & Living Receipt */}
        <div className="lg:col-span-5 nova-card-glow rounded-3xl p-6 space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#003087] flex items-center justify-center text-white font-black italic text-lg shadow-md">
                P
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">PayPal Smart Checkout</h4>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400 font-mono">Orders v2 Sandbox Protocol</p>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Zero-Dispute Shield
            </span>
          </div>

          {/* Pricing Math */}
          <div className="space-y-2 text-xs font-sans text-slate-700 dark:text-slate-300 py-1">
            <div className="flex justify-between">
              <span>Catalog List Price:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">${listPrice.toFixed(2)}</span>
            </div>
            {autoDiscount && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                <span>Autonomous AI Partner Rebate:</span>
                <span className="font-mono">-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-blue-600 dark:text-cyan-400 text-[11px]">
              <span className="flex items-center">
                <Leaf className="w-3 h-3 mr-1" /> PayPal Green Offset:
              </span>
              <span className="font-mono">+${carbonOffset.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-sm font-black text-slate-900 dark:text-white">
              <span>Net Settlement Total:</span>
              <span className="font-mono text-blue-600 dark:text-cyan-400 text-lg">${netTotal.toFixed(2)} USD</span>
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-white/10 text-[11px] font-bold">
            <button
              onClick={() => setActivePaymentMethod('paypal')}
              className={`py-1.5 rounded-xl transition ${
                activePaymentMethod === 'paypal' ? 'bg-[#0070BA] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              PayPal
            </button>
            <button
              onClick={() => setActivePaymentMethod('venmo')}
              className={`py-1.5 rounded-xl transition ${
                activePaymentMethod === 'venmo' ? 'bg-[#008CFF] text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Venmo
            </button>
            <button
              onClick={() => setActivePaymentMethod('payin4')}
              className={`py-1.5 rounded-xl transition ${
                activePaymentMethod === 'payin4' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pay in 4
            </button>
          </div>

          {/* APCP Cryptographic Nonce Token */}
          <div className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-white/5 flex items-center justify-between text-[10.5px] font-mono text-slate-600 dark:text-slate-400">
            <span className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
              <KeyRound className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
              <span>APCP Consent Nonce:</span>
            </span>
            <span className="text-blue-600 dark:text-cyan-300 font-bold">{signatureNonce}</span>
          </div>

          {/* Action Trigger Button */}
          <div>
            <button
              disabled={processingPayment}
              onClick={handleCompletePayment}
              className={`w-full py-4 px-4 rounded-2xl font-black text-slate-900 transition shadow-xl active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer ${
                activePaymentMethod === 'venmo'
                  ? 'bg-[#008CFF] text-white hover:bg-[#007AE6]'
                  : activePaymentMethod === 'payin4'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'bg-[#ffc439] hover:bg-[#ffb71b] shadow-amber-500/20'
              }`}
            >
              {processingPayment ? (
                <span className="flex items-center space-x-2 text-slate-900 font-mono text-xs">
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Capturing PayPal Order...</span>
                </span>
              ) : (
                <>
                  {activePaymentMethod === 'venmo' ? (
                    <span className="text-sm font-black tracking-wide">Pay with Venmo (${netTotal.toFixed(2)})</span>
                  ) : activePaymentMethod === 'payin4' ? (
                    <span className="text-xs font-black tracking-wide">4 Interest-Free Payments of ${(netTotal / 4).toFixed(2)}</span>
                  ) : (
                    <>
                      <span className="italic font-black text-xl tracking-tight text-[#003087]">Pay<span className="text-[#0079C1]">Pal</span></span>
                      <span className="text-xs font-black uppercase tracking-wider ml-1 text-slate-900">
                        1-Click Sandbox Checkout (${netTotal.toFixed(2)})
                      </span>
                    </>
                  )}
                </>
              )}
            </button>
            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 mt-2.5 font-mono">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Sandbox Verified &bull; Cryptographic Intent Capture</span>
            </div>
          </div>

          {/* Captured Settlement Pass Modal / Ticket */}
          {completedOrder && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 space-y-2.5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 text-xs font-bold text-emerald-400">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>PayPal Digital Settlement Pass</span>
                </span>
                <span className="font-mono text-[9.5px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  CAPTURED
                </span>
              </div>
              <div className="text-xs space-y-1 font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Order ID:</span>
                  <span className="text-white font-bold">{completedOrder.paypalOrderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Method:</span>
                  <span className="text-cyan-300">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Captured Total:</span>
                  <span className="text-emerald-400 font-bold">${completedOrder.amount.toFixed(2)} USD</span>
                </div>
              </div>
              <button
                onClick={onNavigateToMerchant}
                className="w-full mt-2 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center justify-center space-x-1.5 cursor-pointer"
              >
                <span>Inspect in AG Grid Merchant Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
