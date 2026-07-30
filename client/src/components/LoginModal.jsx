import React, { useState } from 'react';
import { Lock, User, AlertCircle, ShieldCheck } from 'lucide-react';

export default function LoginModal({ isOpen, onLogin, isLoggingIn, loginError }) {
  const [username, setUsername] = useState('supervisor');
  const [password, setPassword] = useState('arvind123');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center font-extrabold text-xl mx-auto shadow-inner text-white">
            A
          </div>
          <h2 className="text-lg font-bold">Arvind Quality Tracker</h2>
          <p className="text-xs text-slate-400">Shop-floor Supervisor Portal</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-semibold text-slate-900 text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Quick Login Presets:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setUsername('supervisor');
                  setPassword('arvind123');
                }}
                className="py-1.5 px-2 bg-slate-100 hover:bg-indigo-50 text-[10px] font-semibold text-slate-700 rounded-lg border border-slate-200 text-center"
              >
                Supervisor (Gujarat)
              </button>
              <button
                type="button"
                onClick={() => {
                  setUsername('quality_mgr');
                  setPassword('arvind123');
                }}
                className="py-1.5 px-2 bg-slate-100 hover:bg-indigo-50 text-[10px] font-semibold text-slate-700 rounded-lg border border-slate-200 text-center"
              >
                Manager (Maharashtra)
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
