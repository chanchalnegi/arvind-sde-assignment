import React, { useState } from 'react';
import { X, Webhook, Send, CheckCircle2, AlertCircle, Code, Copy, Check } from 'lucide-react';

const SAMPLE_PAYLOADS = [
  {
    title: 'Weave Defect Alert (HIGH)',
    payload: {
      notificationHeader: {
        sapNotificationId: 'QM-2026-99104',
        plantId: 'NARODA-01',
        plantName: 'Naroda Plant, Ahmedabad',
        workCenter: 'Loom-104 (Denim Line 1)',
        timestamp: new Date().toISOString()
      },
      defectDetails: {
        code: 'WEAVE_WARP_BREAK',
        category: 'Weave Defect',
        severityLevel: 'HIGH',
        description: 'Auto optical yarn sensor detected 6 warp end breaks on high-speed loom.'
      }
    }
  },
  {
    title: 'Shade Delta Warning (MEDIUM)',
    payload: {
      notificationHeader: {
        sapNotificationId: 'QM-2026-88302',
        plantId: 'NARODA-01',
        plantName: 'Naroda Plant, Ahmedabad',
        workCenter: 'Dyeing Range 03',
        timestamp: new Date().toISOString()
      },
      defectDetails: {
        code: 'SHADE_DELTA_WARN',
        category: 'Shade Variation',
        severityLevel: 'MEDIUM',
        description: 'Spectrophotometer measured Indigo shade shift delta E = 1.94.'
      }
    }
  },
  {
    title: 'Stenter Tear Alert (HIGH)',
    payload: {
      notificationHeader: {
        sapNotificationId: 'QM-2026-77401',
        plantId: 'KHATRAJ-02',
        plantName: 'Khatraj Plant, Gujarat',
        workCenter: 'Finishing Stenter 02',
        timestamp: new Date().toISOString()
      },
      defectDetails: {
        code: 'FABRIC_SELVAGE_TEAR',
        category: 'Hole/Tear',
        severityLevel: 'HIGH',
        description: 'Pin chain tension detector reported selvage rip near meter mark 510.'
      }
    }
  }
];

export default function SapWebhookPlayground({ isOpen, onClose, onSuccessRefresh }) {
  const [jsonText, setJsonText] = useState(
    JSON.stringify(SAMPLE_PAYLOADS[0].payload, null, 2)
  );
  const [isSending, setIsSending] = useState(false);
  const [responseStatus, setResponseStatus] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSend = async () => {
    try {
      setIsSending(true);
      setResponseStatus(null);
      setResponseData(null);

      let parsed;
      try {
        parsed = JSON.parse(jsonText);
      } catch (err) {
        setResponseStatus('JSON Error');
        setResponseData({ error: 'Invalid JSON string syntax' });
        setIsSending(false);
        return;
      }

      const res = await fetch('/api/sap-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed)
      });

      const data = await res.json();
      setResponseStatus(res.status);
      setResponseData(data);

      if (res.ok) {
        onSuccessRefresh();
      }
    } catch (err) {
      console.error('SAP Webhook test error:', err);
      setResponseStatus('Network Error');
      setResponseData({ error: err.message });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-xl rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Webhook className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="font-bold text-sm sm:text-base leading-tight">SAP Webhook Integration Tester</h2>
              <p className="text-[10px] text-slate-400 font-mono">POST /api/sap-webhook</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Quick Payload Preset Selector */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
              Select Sample SAP Payload Preset:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PAYLOADS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setJsonText(JSON.stringify(p.payload, null, 2))}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-800 text-[11px] font-semibold text-slate-700 rounded-md border border-slate-200 transition-colors"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          {/* JSON Payload Editor */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                JSON Payload:
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[10px] font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy JSON'}
              </button>
            </div>

            <textarea
              rows={8}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full p-3 bg-slate-950 text-indigo-300 font-mono text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Trigger Request Button */}
          <button
            onClick={handleSend}
            disabled={isSending}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? 'Sending SAP Alert...' : 'Dispatch Webhook Request'}</span>
          </button>

          {/* Live Response Box */}
          {responseStatus !== null && (
            <div className="space-y-1.5 pt-2 border-t border-slate-200">
              <div className="flex items-center justify-between font-bold">
                <span className="text-[11px] text-slate-600 uppercase tracking-wider">Response:</span>
                <span
                  className={`px-2 py-0.5 text-[10px] rounded font-bold ${
                    responseStatus === 201 || responseStatus === 200
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  Status: {responseStatus}
                </span>
              </div>

              <pre className="p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-xl overflow-x-auto">
                {JSON.stringify(responseData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
