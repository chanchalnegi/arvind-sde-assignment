import React from 'react';
import { Search, Filter, Calendar, ArrowUpDown, X } from 'lucide-react';

export default function FilterBar({
  filters,
  setFilters,
  onResetFilters
}) {
  const { severity, status, startDate, endDate, search, sortBy, sortOrder } = filters;

  const hasActiveFilters =
    severity !== 'All' ||
    status !== 'All' ||
    startDate !== '' ||
    endDate !== '' ||
    search !== '';

  return (
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-3">
      {/* Top Search & Reset Row */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            placeholder="Search machine ID or remarks..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
          {search && (
            <button
              onClick={() => setFilters({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Filter Options Row */}
      <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 text-xs">
        {/* Status Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open Only</option>
            <option value="Resolved">Resolved Only</option>
          </select>
        </div>

        {/* Severity Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Severity</label>
          <select
            value={severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="Major">Major</option>
            <option value="Minor">Minor</option>
          </select>
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">From Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="w-full py-1 px-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">To Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="w-full py-1 px-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Sorting Row */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span>Sort By:</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="py-1 px-2 bg-slate-100 border border-slate-200 rounded-md text-xs font-semibold text-slate-800 focus:outline-none"
          >
            <option value="date">Inspection Date</option>
            <option value="severity">Severity (High to Low)</option>
            <option value="machine_id">Machine ID</option>
            <option value="status">Status</option>
          </select>

          <button
            onClick={() => setFilters({ ...filters, sortOrder: sortOrder === 'asc' ? 'desc' : 'asc' })}
            className="px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md text-xs font-bold text-slate-700 transition-colors"
          >
            {sortOrder === 'asc' ? 'Asc ↑' : 'Desc ↓'}
          </button>
        </div>
      </div>
    </div>
  );
}
