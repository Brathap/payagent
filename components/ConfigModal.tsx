'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle, ExternalLink, Shield } from 'lucide-react';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigModal({ isOpen, onClose }: ConfigModalProps) {
  const [clientId, setClientId] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('payagent_paypal_client_id') || '';
      setClientId(stored);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('payagent_paypal_client_id', clientId.trim());
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">PayPal Sandbox Credentials</h3>
            <p className="text-xs text-slate-400">Configure or test with official PayPal developer accounts</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center space-x-1.5 font-semibold text-emerald-400">
              <Shield className="w-3.5 h-3.5" />
              <span>Instant Out-of-the-Box Mode Active</span>
            </div>
            <p>
              By default, PayAgent operates in autonomous Sandbox Simulation mode so judges can evaluate the full payment and merchant flow immediately without typing credentials.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              PayPal Sandbox Client ID (Optional)
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="e.g. AfQ... (Leave empty to use simulated sandbox)"
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <a
              href="https://developer.paypal.com/dashboard/applications/sandbox"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-xs text-blue-400 hover:underline"
            >
              <span>Get Sandbox credentials</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <div className="flex items-center space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition flex items-center space-x-1.5"
              >
                {saved && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                <span>{saved ? 'Saved!' : 'Save Config'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
