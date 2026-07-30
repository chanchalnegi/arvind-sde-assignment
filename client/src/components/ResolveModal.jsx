import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Wrench, ShieldCheck } from 'lucide-react';

const RESOLUTION_TEMPLATES = [
  'Re-calibrated loom warp guide tension',
  'Doffed defective yarn spool & replaced roving',
  'Trimmed damaged fabric section and flagged roll',
  'Adjusted dye liquor temperature & re-balanced pH',
  'Cleaned oil guide seal and cleared lint buildup'
];

export default function ResolveModal({ isOpen, onClose, onConfirm, inspection, isSubmitting }) {
  const [resolutionNote, setResolutionNote] = useState('');
  const [validationError, setValidationError] = useState('');

  if (!isOpen || !inspection) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resolutionNote.trim()) {
      setValidationError('A mandatory resolution note is required to mark an inspection as resolved.');
      return;
    }
    setValidationError('');
    onConfirm(inspection.id, resolutionNote.trim());
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3.5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-sm sm:text-base">Resolve Quality Defect</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          {/* Target Inspection Info Box */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-slate-900 font-bold">
              <span>{inspection.machine_id}</span>
              <span className="px-2 py-0.5 text-[10px] bg-indigo-100 text-indigo-800 rounded font-semibold">
                {inspection.defect_type}
              </span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Severity: <strong className="text-slate-700">{inspection.severity}</strong> • Logged Date:{' '}
              {inspection.date}
            </p>
            {inspection.remarks && (
              <p className="text-slate-600 italic text-[11px] pt-1 border-t border-slate-200/60 mt-1">
                "{inspection.remarks}"
              </p>
            )}
          </div>

          {/* Validation Warning */}
          {validationError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Mandatory Resolution Note */}
          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider text-[10px] mb-1">
              Resolution Note (Mandatory) *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe corrective actions taken on machine, fabric trim, or operator adjustments..."
              value={resolutionNote}
              onChange={(e) => {
                setResolutionNote(e.target.value);
                if (e.target.value.trim()) setValidationError('');
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:bg-white text-xs font-medium"
            />

            {/* Quick Resolution Templates */}
            <div className="mt-2 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Quick Resolution Templates:
              </span>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {RESOLUTION_TEMPLATES.map((tmpl) => (
                  <button
                    type="button"
                    key={tmpl}
                    onClick={() => {
                      setResolutionNote((prev) => (prev ? `${prev}. ${tmpl}` : tmpl));
                      setValidationError('');
                    }}
                    className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-[10px] text-slate-700 font-medium rounded border border-slate-200 transition-colors"
                  >
                    + {tmpl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-900/20 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Resolving...' : 'Confirm Resolution'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
