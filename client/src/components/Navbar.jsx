import React from 'react';
import { ShieldAlert, Wifi, WifiOff, RefreshCw, LogOut, User, Webhook, FileSpreadsheet, PlusCircle } from 'lucide-react';

export default function Navbar({
  isOnline,
  pendingCount,
  onSync,
  isSyncing,
  user,
  onLogout,
  activeTab,
  setActiveTab,
  onOpenLogModal,
  onOpenSapModal,
  onExportCsv
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800">
      {/* Top Banner */}
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-inner">
            A
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5 leading-tight">
              Arvind Quality Tracker
            </h1>
            <p className="text-[11px] text-slate-400 font-medium">
              Shop-floor Defects • {user?.plant || 'Gujarat & Maharashtra Plants'}
            </p>
          </div>
        </div>

        {/* Action Controls & Offline Badge */}
        <div className="flex items-center gap-2">
          {/* Offline/Online Badge */}
          <div className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
            isOnline ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60' : 'bg-amber-950/80 text-amber-400 border border-amber-800/60'
          }`}>
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Offline</span>
              </>
            )}
          </div>

          {/* Pending Queue Sync Badge */}
          {pendingCount > 0 && (
            <button
              onClick={onSync}
              disabled={isSyncing || !isOnline}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-full flex items-center gap-1 shadow-sm transition-all disabled:opacity-50"
              title="Sync pending offline entries"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{pendingCount} Sync</span>
            </button>
          )}

          {/* User Profile / Logout */}
          <div className="flex items-center gap-1 pl-1">
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Logout / Switch User"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar for Mobile */}
      <div className="bg-slate-950/60 backdrop-blur border-t border-slate-800/60 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1 overflow-x-auto no-scrollbar py-1.5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'list'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Inspections List
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'summary'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Summary View
            </button>
            <button
              onClick={onOpenSapModal}
              className="px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-400 hover:text-indigo-300 hover:bg-slate-800/50 flex items-center gap-1 transition-all"
            >
              <Webhook className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden xs:inline">SAP Webhook</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onExportCsv}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-md flex items-center gap-1 border border-slate-700/60"
              title="Export CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={onOpenLogModal}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-md flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Defect</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
