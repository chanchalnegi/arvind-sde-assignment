import React from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Cpu,
  CheckSquare,
  Clock,
  User,
  Info,
  Webhook,
  WifiOff
} from 'lucide-react';

export default function InspectionList({
  inspections,
  isLoading,
  onResolveClick
}) {
  if (isLoading) {
    return (
      <div className="py-12 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading defect records...</p>
      </div>
    );
  }

  if (!inspections || inspections.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <Info className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No Inspection Records Found</h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          No quality defect records match the selected filters. Log a new inspection or clear search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {inspections.map((item) => {
        const isOpen = item.status === 'Open';
        const isCritical = item.severity === 'Critical';
        const isMajor = item.severity === 'Major';

        // Severity tag styling
        const severityStyles = isCritical
          ? 'bg-rose-100 text-rose-800 border-rose-200'
          : isMajor
          ? 'bg-amber-100 text-amber-800 border-amber-200'
          : 'bg-blue-100 text-blue-800 border-blue-200';

        return (
          <div
            key={item.id || item._tempId}
            className={`bg-white rounded-xl border transition-all duration-200 p-4 space-y-3 shadow-sm hover:shadow-md ${
              isCritical && isOpen ? 'border-rose-300 ring-1 ring-rose-200/50' : 'border-slate-200'
            }`}
          >
            {/* Header: Machine ID & Status / Severity Badges */}
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-indigo-600" />
                    {item.machine_id}
                  </span>

                  {/* Source indicator tag */}
                  {item.source === 'SAP_WEBHOOK' && (
                    <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded border border-indigo-200 flex items-center gap-0.5">
                      <Webhook className="w-3 h-3 text-indigo-500" /> SAP
                    </span>
                  )}
                  {item.source === 'OFFLINE_SYNC' && (
                    <span className="px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-200 flex items-center gap-0.5">
                      <WifiOff className="w-3 h-3 text-amber-500" /> Queued
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">{item.defect_type}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.date}
                  </span>
                </div>
              </div>

              {/* Status & Severity Chips */}
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${severityStyles}`}
                >
                  {item.severity}
                </span>

                <span
                  className={`px-2 py-0.5 text-[11px] font-semibold rounded-md flex items-center gap-1 ${
                    isOpen
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {isOpen ? (
                    <>
                      <AlertTriangle className="w-3 h-3 text-amber-600" /> Open
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Resolved
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Remarks Text */}
            {item.remarks && (
              <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                <span className="font-semibold text-slate-800">Remarks: </span>
                {item.remarks}
              </div>
            )}

            {/* Resolution Note if Resolved */}
            {!isOpen && item.resolution_note && (
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-2.5 text-xs space-y-1">
                <div className="font-bold text-emerald-900 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> Resolution Note
                  </span>
                  {item.resolved_by && (
                    <span className="text-[10px] text-emerald-700 font-normal flex items-center gap-1">
                      <User className="w-3 h-3" /> {item.resolved_by}
                    </span>
                  )}
                </div>
                <p className="text-emerald-900 leading-relaxed">{item.resolution_note}</p>
                {item.resolved_at && (
                  <p className="text-[10px] text-emerald-700 pt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-600" /> {item.resolved_at}
                  </p>
                )}
              </div>
            )}

            {/* Action Bar for Open Defect */}
            {isOpen && (
              <div className="pt-1 flex items-center justify-between border-t border-slate-100">
                <span className="text-[11px] text-slate-400 italic">
                  {item.plant_location || 'Shop Floor'}
                </span>

                <button
                  onClick={() => onResolveClick(item)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Resolved</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
