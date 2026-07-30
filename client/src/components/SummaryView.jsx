import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, Layers, BarChart3, TrendingUp, PieChart } from 'lucide-react';

export default function SummaryView({ summary, onFilterBySeverityAndStatus }) {
  const { open = {}, resolved = {}, totalCount = 0, openCount = 0, resolvedCount = 0 } = summary || {};

  const criticalOpen = open.Critical || 0;
  const majorOpen = open.Major || 0;
  const minorOpen = open.Minor || 0;

  const criticalResolved = resolved.Critical || 0;
  const majorResolved = resolved.Major || 0;
  const minorResolved = resolved.Minor || 0;

  const criticalTotal = criticalOpen + criticalResolved;
  const majorTotal = majorOpen + majorResolved;
  const minorTotal = minorOpen + minorResolved;

  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Logged</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{totalCount}</p>
        </div>

        <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800">Open Defects</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-900 mt-2">{openCount}</p>
        </div>

        <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-800">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-emerald-900">{resolvedCount}</p>
            <span className="text-[11px] font-bold text-emerald-700">{resolutionRate}% Rate</span>
          </div>
        </div>

        <div className="bg-rose-50/70 p-3.5 rounded-xl border border-rose-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-800">Critical Open</span>
            <ShieldAlert className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-900 mt-2">{criticalOpen}</p>
        </div>
      </div>

      {/* Visual Resolution Rate Progress Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-700 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" /> Shop-floor Quality Resolution Progress
          </span>
          <span className="text-indigo-600">{resolutionRate}% Resolved</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
          <div
            className="bg-emerald-500 transition-all duration-500"
            style={{ width: `${resolutionRate}%` }}
            title={`Resolved: ${resolvedCount}`}
          />
          <div
            className="bg-amber-400 transition-all duration-500"
            style={{ width: `${100 - resolutionRate}%` }}
            title={`Open: ${openCount}`}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold pt-0.5">
          <span className="flex items-center gap-1 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> {resolvedCount} Resolved Defects
          </span>
          <span className="flex items-center gap-1 text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span> {openCount} Open Action Items
          </span>
        </div>
      </div>

      {/* Summary Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold tracking-tight">Defects by Severity & Status Summary Matrix</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Real-time plant metrics</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Severity Level</th>
                <th className="px-4 py-2.5 text-center text-amber-700 bg-amber-50/50">Open Defects</th>
                <th className="px-4 py-2.5 text-center text-emerald-700 bg-emerald-50/50">Resolved</th>
                <th className="px-4 py-2.5 text-right">Total Defects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {/* Critical Row */}
              <tr className="hover:bg-rose-50/40 transition-colors">
                <td className="px-4 py-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="font-bold text-rose-900">Critical</span>
                </td>
                <td className="px-4 py-3 text-center bg-amber-50/20 font-bold text-rose-600">
                  <button
                    onClick={() => onFilterBySeverityAndStatus('Critical', 'Open')}
                    className="hover:underline text-rose-600"
                  >
                    {criticalOpen}
                  </button>
                </td>
                <td className="px-4 py-3 text-center bg-emerald-50/20 font-semibold text-emerald-700">
                  <button
                    onClick={() => onFilterBySeverityAndStatus('Critical', 'Resolved')}
                    className="hover:underline text-emerald-700"
                  >
                    {criticalResolved}
                  </button>
                </td>
                <td className="px-4 py-3 text-right font-bold text-slate-900">{criticalTotal}</td>
              </tr>

              {/* Major Row */}
              <tr className="hover:bg-amber-50/40 transition-colors">
                <td className="px-4 py-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="font-bold text-amber-900">Major</span>
                </td>
                <td className="px-4 py-3 text-center bg-amber-50/20 font-bold text-amber-700">
                  <button
                    onClick={() => onFilterBySeverityAndStatus('Major', 'Open')}
                    className="hover:underline text-amber-700"
                  >
                    {majorOpen}
                  </button>
                </td>
                <td className="px-4 py-3 text-center bg-emerald-50/20 font-semibold text-emerald-700">
                  <button
                    onClick={() => onFilterBySeverityAndStatus('Major', 'Resolved')}
                    className="hover:underline text-emerald-700"
                  >
                    {majorResolved}
                  </button>
                </td>
                <td className="px-4 py-3 text-right font-bold text-slate-900">{majorTotal}</td>
              </tr>

              {/* Minor Row */}
              <tr className="hover:bg-blue-50/40 transition-colors">
                <td className="px-4 py-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span className="font-bold text-blue-900">Minor</span>
                </td>
                <td className="px-4 py-3 text-center bg-amber-50/20 font-bold text-slate-700">
                  <button
                    onClick={() => onFilterBySeverityAndStatus('Minor', 'Open')}
                    className="hover:underline text-slate-700"
                  >
                    {minorOpen}
                  </button>
                </td>
                <td className="px-4 py-3 text-center bg-emerald-50/20 font-semibold text-emerald-700">
                  <button
                    onClick={() => onFilterBySeverityAndStatus('Minor', 'Resolved')}
                    className="hover:underline text-emerald-700"
                  >
                    {minorResolved}
                  </button>
                </td>
                <td className="px-4 py-3 text-right font-bold text-slate-900">{minorTotal}</td>
              </tr>
            </tbody>

            {/* Table Footer Total */}
            <tfoot className="bg-slate-50 font-bold text-slate-900 border-t-2 border-slate-200">
              <tr>
                <td className="px-4 py-3">Total Counts</td>
                <td className="px-4 py-3 text-center text-amber-800 bg-amber-100/50">{openCount}</td>
                <td className="px-4 py-3 text-center text-emerald-800 bg-emerald-100/50">{resolvedCount}</td>
                <td className="px-4 py-3 text-right text-indigo-700">{totalCount}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
