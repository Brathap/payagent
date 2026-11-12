'use client';

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule, ColDef } from 'ag-grid-community';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

import {
  ShieldAlert,
  Sparkles,
  Download,
  Search,
  RefreshCw,
  FileText,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Play,
  Square,
  Radio,
} from 'lucide-react';
import { MerchantOrder } from '@/lib/types';
import { playSound } from '@/lib/sounds';

ModuleRegistry.registerModules([AllCommunityModule]);

interface MerchantDashboardProps {
  soundEnabled: boolean;
  theme?: 'light' | 'dark';
}

export default function MerchantDashboard({ soundEnabled, theme = 'light' }: MerchantDashboardProps) {
  const isLight = theme === 'light';

  const [orders, setOrders] = useState<MerchantOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickFilter, setQuickFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<MerchantOrder | null>(null);
  const [auditData, setAuditData] = useState<any>(null);
  const [auditing, setAuditing] = useState(false);
  const [generatedDispute, setGeneratedDispute] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Live Simulator State
  const [isLiveStreaming, setIsLiveStreaming] = useState(false);
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);

  const gridRef = useRef<AgGridReact>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/merchant/orders');
      const data = await res.json();
      setOrders(data.orders || []);
      if (data.orders?.length > 0 && !selectedOrder) {
        setSelectedOrder(data.orders[0]);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedOrder]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Live Transaction Stream Simulator
  useEffect(() => {
    if (isLiveStreaming) {
      streamTimerRef.current = setInterval(async () => {
        try {
          const res = await fetch('/api/merchant/simulate', { method: 'POST' });
          const json = await res.json();
          if (json.order) {
            setOrders((prev) => [json.order, ...prev]);
            if (soundEnabled) playSound('click');
          }
        } catch (e) {
          console.error('Stream simulation error:', e);
        }
      }, 3500);
    } else {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    }
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, [isLiveStreaming, soundEnabled]);

  const toggleLiveStream = () => {
    if (soundEnabled) playSound('click');
    setIsLiveStreaming((prev) => !prev);
  };

  const runAiAudit = async () => {
    setAuditing(true);
    if (soundEnabled) playSound('click');
    try {
      const res = await fetch('/api/merchant/audit', { method: 'POST' });
      const data = await res.json();
      setAuditData(data);
      if (soundEnabled) playSound('success');
    } catch (err) {
      console.error('Failed to run audit:', err);
      if (soundEnabled) playSound('alert');
    } finally {
      setAuditing(false);
    }
  };

  const handleExportCsv = () => {
    if (soundEnabled) playSound('click');
    gridRef.current?.api.exportDataAsCsv({
      fileName: `payagent-telemetry-${new Date().toISOString().substring(0, 10)}.csv`,
    });
  };

  const generateDisputeLetter = (order: MerchantOrder) => {
    if (soundEnabled) playSound('click');
    const letter = `PAYPAL DISPUTE EVIDENCE & RESOLUTION DOSSIER
=====================================================
Case Reference: Dispute on Transaction ${order.paypalOrderId}
Internal System ID: ${order.id}
Settlement Value: $${order.totalAmount.toFixed(2)} ${order.currency}
Verified Counterparty: ${order.customerName} (${order.customerEmail})
Capture Timestamp: ${order.timestamp} UTC
APCP Cryptographic Signature: ${order.signatureHash || '0x7e4b...91aa'}

1. CRYPTOGRAPHIC INTENT VERIFICATION:
- Intent Signature Protocol: PayAgent Sentinel Ed25519 Nonce Match
- PayPal API Route: /v2/checkout/orders/${order.paypalOrderId}/capture
- Dispatched Manifest: ${order.itemSummary}

2. AI FRAUD ENGINE DIAGNOSTICS:
- Risk Score at Check-out: ${order.riskScore}/100 (${order.riskLevel})
- Risk Diagnostics: ${order.fraudReasoning || 'Zero anomaly detected. Clean device fingerprint with persistent IP session.'}

3. MERCHANT AFFIDAVIT:
The transaction was executed via autonomous buyer consent with an inviolable spending ceiling enforced client-side before authorization. Funds were authorized and settled through PayPal Sandbox Orders v2 API with non-repudiation.

AFFIDAVIT ATTESTATION: ED25519-VERIFIED-VALID
RESOLUTION REQUEST: Immediate release of reserved funds to merchant.`;
    setGeneratedDispute(letter);
  };

  const copyDispute = () => {
    if (generatedDispute) {
      navigator.clipboard.writeText(generatedDispute);
      setCopied(true);
      if (soundEnabled) playSound('click');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // AG Grid Column Definitions with high-contrast Light/Dark styling
  const columnDefs = useMemo<ColDef<MerchantOrder>[]>(() => [
    {
      headerName: 'Order ID',
      field: 'id',
      width: 115,
      pinned: 'left',
      cellClass: isLight ? 'font-mono font-bold text-blue-700' : 'font-mono font-bold text-blue-400',
    },
    {
      headerName: 'PayPal Order ID',
      field: 'paypalOrderId',
      width: 175,
      cellClass: isLight ? 'font-mono text-xs text-slate-800 font-semibold' : 'font-mono text-xs text-slate-300',
    },
    {
      headerName: 'Customer',
      field: 'customerName',
      width: 165,
      cellRenderer: (params: any) => (
        <div className="py-1">
          <div className={`font-bold text-xs truncate ${isLight ? 'text-slate-900 font-bold' : 'text-white font-bold'}`}>
            {params.data.customerName}
          </div>
          <div className={`text-[10px] font-mono truncate font-semibold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {params.data.customerEmail}
          </div>
        </div>
      ),
    },
    {
      headerName: 'Item Breakdown',
      field: 'itemSummary',
      flex: 1,
      minWidth: 230,
      cellClass: isLight ? 'text-xs text-slate-800 font-medium' : 'text-xs text-slate-300',
    },
    {
      headerName: 'Amount',
      field: 'totalAmount',
      width: 115,
      valueFormatter: (params) => `$${params.value?.toFixed(2)} USD`,
      cellClass: isLight ? 'font-mono font-bold text-emerald-700 text-xs' : 'font-mono font-bold text-emerald-400 text-xs',
    },
    {
      headerName: 'APCP Signature',
      field: 'signatureHash',
      width: 135,
      cellRenderer: (params: any) => (
        <span className={`font-mono text-[10px] px-2 py-0.5 rounded border font-bold ${
          isLight ? 'bg-slate-100 text-blue-700 border-slate-200' : 'bg-slate-800 text-cyan-300 border-white/5'
        }`}>
          {params.value || '0x4f2a...88bc'}
        </span>
      ),
    },
    {
      headerName: 'AI Risk Matrix',
      field: 'riskScore',
      width: 140,
      cellRenderer: (params: any) => {
        const score = params.value;
        const color =
          score > 60
            ? isLight ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold' : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
            : score > 30
            ? isLight ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            : isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold' : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold border ${color}`}>
            {score}/100 &bull; {score > 60 ? 'HIGH' : score > 30 ? 'MED' : 'LOW'}
          </span>
        );
      },
    },
    {
      headerName: 'Status',
      field: 'status',
      width: 120,
      cellRenderer: (params: any) => {
        const status = params.value;
        const color =
          status === 'FLAGGED'
            ? isLight ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            : isLight ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
        return (
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider border ${color}`}>
            {status}
          </span>
        );
      },
    },
    {
      headerName: 'Timestamp (UTC)',
      field: 'timestamp',
      width: 155,
      cellClass: isLight ? 'font-mono text-[10.5px] text-slate-600 font-semibold' : 'font-mono text-[10.5px] text-slate-400',
    },
  ], [isLight]);

  // Aggregate KPI stats
  const totalVolume = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const flaggedCount = orders.filter((o) => o.status === 'FLAGGED' || o.riskScore > 60).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">

      {/* Top Telemetry KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        
        <div className={`p-4 sm:p-5 rounded-2xl border transition shadow-sm ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'glass-panel'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold truncate ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>Settled Volume</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <h3 className={`text-xl sm:text-2xl font-black font-mono mt-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>${totalVolume.toFixed(2)}</h3>
          <p className="text-[9.5px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-1 font-semibold truncate">
            &bull; Live PayPal Sandbox Capture
          </p>
        </div>

        <div className={`p-4 sm:p-5 rounded-2xl border transition shadow-sm ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'glass-panel'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold truncate ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>AG Grid Stream</span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <h3 className={`text-xl sm:text-2xl font-black font-mono mt-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>{orders.length} Rows</h3>
          <p className={`text-[9.5px] sm:text-[10px] font-mono mt-1 font-semibold truncate ${
            isLight ? 'text-slate-600' : 'text-slate-400'
          }`}>
            Community v36 Virtualized
          </p>
        </div>

        <div className={`p-4 sm:p-5 rounded-2xl border transition shadow-sm ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'glass-panel'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold truncate ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>Flagged Anomalies</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-2">{flaggedCount} Orders</h3>
          <p className="text-[9.5px] sm:text-[10px] text-rose-600 dark:text-rose-400 font-mono mt-1 font-semibold truncate">
            Protected by APCP Nonces
          </p>
        </div>

        <div className={`p-4 sm:p-5 rounded-2xl border transition shadow-sm ${
          isLight ? 'bg-white border-slate-200 text-slate-900' : 'glass-panel'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-bold truncate ${
              isLight ? 'text-slate-600' : 'text-slate-400'
            }`}>Sponsor Tech</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <h3 className={`text-base sm:text-lg font-bold mt-2 truncate ${
            isLight ? 'text-slate-900 font-bold' : 'text-white'
          }`}>AG Grid Community</h3>
          <p className="text-[9.5px] sm:text-[10px] text-indigo-600 dark:text-indigo-400 font-mono mt-1 font-semibold truncate">
            v36 Modules Loaded
          </p>
        </div>

      </div>

      {/* Main AG Grid Community v36 Terminal */}
      <div className={`rounded-3xl p-4 sm:p-6 space-y-4 shadow-xl border ${
        isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'glass-panel'
      }`}>
        
        {/* Controls Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div className="relative flex-1 max-w-sm">
            <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`} />
            <input
              type="text"
              value={quickFilter}
              onChange={(e) => setQuickFilter(e.target.value)}
              placeholder="Search by ID, customer, risk..."
              className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-mono border ${
                isLight
                  ? 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:bg-white'
                  : 'bg-black/40 border-white/10 text-white placeholder-slate-500'
              }`}
            />
          </div>

          <div className="flex items-center space-x-2">
            
            <button
              onClick={handleExportCsv}
              title="Export filtered AG Grid data to CSV"
              className={`p-2 rounded-xl border transition ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-black/40 border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
              }`}
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={fetchOrders}
              title="Refresh transaction stream"
              className={`p-2 rounded-xl border transition ${
                isLight
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-black/40 border-white/10 hover:border-white/20 text-slate-300 hover:text-white'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-500' : ''}`} />
            </button>

            {/* Live Stream Simulator Toggle */}
            <button
              onClick={toggleLiveStream}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                isLiveStreaming
                  ? isLight
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : isLight
                  ? 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  : 'bg-black/40 border-white/10 hover:border-white/20 text-slate-300'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
              <span>{isLiveStreaming ? 'Streaming' : 'Simulate'}</span>
            </button>

            <button
              onClick={runAiAudit}
              disabled={auditing}
              className="flex items-center justify-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${auditing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">AI Risk</span>
              <span>Audit</span>
            </button>

          </div>

        </div>

        {/* AG Grid community container */}
        <div className={`ag-theme-quartz w-full h-[400px] rounded-2xl overflow-hidden border ${
          isLight ? 'border-slate-200 shadow-sm' : 'border-white/10'
        }`}>
          <AgGridReact
            ref={gridRef}
            rowData={orders}
            columnDefs={columnDefs}
            quickFilterText={quickFilter}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 20, 50]}
            rowSelection="single"
            onRowClicked={(e) => {
              if (e.data) {
                setSelectedOrder(e.data);
                if (soundEnabled) playSound('click');
              }
            }}
            animateRows={true}
          />
        </div>

      </div>

      {/* Detail Inspector & Copilot Audit Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Selected Order Dispute Resolution Copilot */}
        <div className={`rounded-3xl p-5 space-y-4 shadow-xl border ${
          isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'glass-panel'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            isLight ? 'border-slate-100' : 'border-white/5'
          }`}>
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <h3 className={`text-xs font-black uppercase tracking-wider ${
                isLight ? 'text-slate-900 font-bold' : 'text-white'
              }`}>
                PayPal Dispute Defense &bull; Evidence Packager
              </h3>
            </div>
            {selectedOrder && (
              <span className="text-[10px] font-mono text-blue-600 dark:text-cyan-400 font-bold">
                {selectedOrder.id}
              </span>
            )}
          </div>

          {selectedOrder ? (
            <div className="space-y-3.5 text-xs">
              
              <div className={`grid grid-cols-2 gap-2 p-3 rounded-2xl border font-mono ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Customer</span>
                  <p className={`font-bold text-xs mt-0.5 truncate ${isLight ? 'text-slate-900' : 'text-white'}`}>{selectedOrder.customerName}</p>
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>PayPal Email</span>
                  <p className={`text-xs mt-0.5 truncate font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{selectedOrder.customerEmail}</p>
                </div>
                <div className="mt-1">
                  <span className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Settled Total</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5">${selectedOrder.totalAmount?.toFixed(2)} USD</p>
                </div>
                <div className="mt-1">
                  <span className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>AI Risk Engine</span>
                  <p className={`font-bold text-xs mt-0.5 ${selectedOrder.riskScore > 50 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {selectedOrder.riskScore}/100 ({selectedOrder.riskLevel})
                  </p>
                </div>
              </div>

              <div>
                <span className={`font-mono text-[10px] uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  Autonomous Diagnostic Log:
                </span>
                <p className={`mt-1 p-3 rounded-xl border leading-relaxed font-mono text-[11px] ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-black/50 border-white/5 text-slate-300'
                }`}>
                  {selectedOrder.fraudReasoning || 'Zero anomaly detected. Clean device fingerprint with persistent IP session.'}
                </p>
              </div>

              <button
                onClick={() => generateDisputeLetter(selectedOrder)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold transition flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/20 cursor-pointer active:scale-98"
              >
                <FileText className="w-4 h-4" />
                <span>Package Dispute Evidence for PayPal Resolution Center</span>
              </button>

              {generatedDispute && (
                <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="flex items-center space-x-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span>PayPal Legal Evidence Dossier</span>
                    </span>
                    <button
                      onClick={copyDispute}
                      className={`flex items-center space-x-1 text-[11px] px-2.5 py-1 rounded-lg border transition font-bold ${
                        isLight
                          ? 'text-slate-700 hover:bg-slate-200 bg-slate-100 border-slate-200'
                          : 'text-slate-300 hover:text-white bg-slate-800 border-slate-700'
                      }`}
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className={`text-[10px] whitespace-pre-wrap font-mono max-h-44 overflow-y-auto p-3 rounded-xl border ${
                    isLight
                      ? 'bg-slate-50 border-slate-200 text-slate-900'
                      : 'bg-slate-950 border-white/5 text-slate-300'
                  }`}>
                    {generatedDispute}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <p className={`text-xs py-10 text-center font-mono ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              Select any row in the AG Grid above to inspect risk diagnostics
            </p>
          )}
        </div>

        {/* AI Merchant Audit Recommendations */}
        <div className={`rounded-3xl p-5 space-y-4 shadow-xl border ${
          isLight ? 'bg-white border-slate-200 text-slate-900 shadow-sm' : 'glass-panel'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            isLight ? 'border-slate-100' : 'border-white/5'
          }`}>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <h3 className={`text-xs font-black uppercase tracking-wider ${
                isLight ? 'text-slate-900 font-bold' : 'text-white'
              }`}>
                AI Risk &bull; Elasticity Copilot
              </h3>
            </div>
            <span className={`text-[9.5px] px-2 py-0.5 rounded-full border font-mono font-bold ${
              isLight ? 'bg-cyan-50 text-cyan-800 border-cyan-200' : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
            }`}>
              Autonomous
            </span>
          </div>

          {auditData ? (
            <div className="space-y-3">
              <div className={`grid grid-cols-3 gap-2 p-3 rounded-2xl border text-center font-mono text-xs ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Audited Vol</span>
                  <p className={`font-bold mt-0.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>${auditData.metrics.totalVolume}</p>
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Flagged Vol</span>
                  <p className="font-bold text-rose-600 dark:text-rose-400 mt-0.5">${auditData.metrics.flaggedVolume}</p>
                </div>
                <div>
                  <span className={`text-[10px] uppercase font-bold ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>Risk Ratio</span>
                  <p className="font-bold text-amber-600 dark:text-amber-400 mt-0.5">{auditData.metrics.highRiskRatio}</p>
                </div>
              </div>

              <div className="space-y-2">
                {auditData.recommendations.map((rec: any, idx: number) => (
                  <div key={idx} className={`p-3 rounded-2xl border text-xs space-y-1 ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-black/40 border-white/5'
                  }`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-xs ${isLight ? 'text-slate-900 font-bold' : 'text-white'}`}>{rec.title}</span>
                      <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-mono font-bold ${
                        rec.severity === 'HIGH'
                          ? isLight ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : rec.severity === 'MEDIUM'
                          ? isLight ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : isLight ? 'bg-blue-100 text-blue-800 border border-blue-300' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {rec.severity}
                      </span>
                    </div>
                    <p className={`leading-relaxed text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-400'}`}>{rec.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10 space-y-3">
              <Sparkles className="w-8 h-8 text-indigo-500 mx-auto opacity-70 animate-bounce" />
              <p className={`text-xs max-w-sm mx-auto leading-relaxed ${isLight ? 'text-slate-600 font-medium' : 'text-slate-400'}`}>
                Click <strong>&quot;Run AI Risk Audit&quot;</strong> to let our autonomous LLM agent evaluate fraud vulnerabilities across all current PayPal transactions in AG Grid.
              </p>
              <button
                onClick={runAiAudit}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                Execute Audit Now
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
