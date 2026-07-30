import React, { useState } from 'react';
import { X, PlusCircle, AlertTriangle, ShieldAlert, Tag } from 'lucide-react';

const DEFECT_TYPES = [
  'Weave Defect',
  'Shade Variation',
  'Hole/Tear',
  'Count Deviation',
  'Other'
];

const MACHINE_SUGGESTIONS = [
  'Loom-104 (Denim Line 1)',
  'Dyeing Range 03',
  'Finishing Stenter 02',
  'Spinning Frame SF-12',
  'Airjet Loom AL-08'
];

const REMARK_TAGS = [
  'Broken warp threads',
  'Indigo shade delta > 1.5',
  'Pin chain slip tear',
  'Count shifted Ne 30s to 31s',
  'Oil spot along selvage'
];

export default function NewInspectionModal({ isOpen, onClose, onSubmit, isSubmitting, userPlant }) {
  const todayStr = new Date().toISOString().slice(0, 10);

  const [date, setDate] = useState(todayStr);
  const [machineId, setMachineId] = useState('');
  const [defectType, setDefectType] = useState(DEFECT_TYPES[0]);
  const [severity, setSeverity] = useState('Major');
  const [remarks, setRemarks] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!machineId.trim()) {
      setErrorMsg('Please enter a Machine / Line ID.');
      return;
    }
    setErrorMsg('');
    onSubmit({
      date,
      machine_id: machineId.trim(),
      defect_type: defectType,
      severity,
      remarks: remarks.trim(),
      plant_location: userPlant || 'Naroda Plant, Gujarat'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-sm sm:text-base">Log Quality Inspection</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Inspection Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
            />
          </div>

          {/* Machine / Line ID (Free Text) */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Machine / Line ID *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Loom-104, Dyeing Range 01"
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-semibold text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {MACHINE_SUGGESTIONS.map((sug) => (
                <button
                  type="button"
                  key={sug}
                  onClick={() => setMachineId(sug)}
                  className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-[10px] font-semibold text-slate-600 rounded-md border border-slate-200 transition-colors"
                >
                  + {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Defect Type Dropdown */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Defect Type *
            </label>
            <select
              value={defectType}
              onChange={(e) => setDefectType(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 text-xs"
            >
              {DEFECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Radio Chips */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1.5">
              Severity Level *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSeverity('Critical')}
                className={`py-2.5 px-3 rounded-lg border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  severity === 'Critical'
                    ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-300'
                    : 'bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Critical</span>
              </button>

              <button
                type="button"
                onClick={() => setSeverity('Major')}
                className={`py-2.5 px-3 rounded-lg border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  severity === 'Major'
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md ring-2 ring-amber-300'
                    : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                }`}
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Major</span>
              </button>

              <button
                type="button"
                onClick={() => setSeverity('Minor')}
                className={`py-2.5 px-3 rounded-lg border font-bold text-xs flex flex-col items-center gap-1 transition-all ${
                  severity === 'Minor'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                    : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                }`}
              >
                <Tag className="w-4 h-4" />
                <span>Minor</span>
              </button>
            </div>
          </div>

          {/* Remarks Optional Text Area */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Remarks (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Provide defect location meter mark, batch number, or root cause..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs font-medium"
            />
            {/* Quick remark chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {REMARK_TAGS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setRemarks((prev) => (prev ? `${prev}. ${tag}` : tag))}
                  className="px-2 py-1 bg-slate-100 hover:bg-indigo-50 text-[10px] text-slate-600 font-medium rounded border border-slate-200"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Logging...' : 'Submit Quality Inspection'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
