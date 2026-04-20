import { useState } from 'react';
import { RefreshCw, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { triggerPlan } from '../api';

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function SettingsScreen() {
  const [status, setStatus] = useState<Status>('idle');

  async function handleTrigger() {
    setStatus('loading');
    try {
      await triggerPlan();
      setStatus('success');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  return (
    <div className="px-4 pb-8">
      <div className="rounded-2xl overflow-hidden shadow-sm border border-amber-100 mb-6">
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3">
            <Sparkles size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">TN Meal Planner</h2>
          <p className="text-white/80 text-sm mt-1">Tamil Nadu Family Meal Planner</p>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
            <span className="text-xs text-white/60">Powered by Google Sheets</span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
          </div>
        </div>
        <div className="bg-white px-5 py-4 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            Plan your family's Tamil Nadu-style meals for the week with traditional dishes, smart grocery tracking, and easy meal overrides.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-white shadow-sm overflow-hidden mb-4">
        <div className="px-5 py-4 border-b border-amber-50">
          <h3 className="text-sm font-bold text-gray-700">Meal Plan</h3>
          <p className="text-xs text-gray-400 mt-0.5">Generate a new weekly meal plan for your family</p>
        </div>
        <div className="px-5 py-4">
          <button
            onClick={handleTrigger}
            disabled={status === 'loading'}
            className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              status === 'loading'
                ? 'bg-amber-100 text-amber-400 cursor-not-allowed'
                : status === 'success'
                ? 'bg-green-500 text-white'
                : status === 'error'
                ? 'bg-red-500 text-white'
                : 'bg-amber-500 text-white hover:bg-amber-600 active:scale-95'
            }`}
          >
            {status === 'loading' && (
              <span className="w-4 h-4 border-2 border-amber-300 border-t-amber-500 rounded-full animate-spin" />
            )}
            {status === 'success' && <CheckCircle size={16} />}
            {status === 'error' && <AlertCircle size={16} />}
            {status === 'idle' && <RefreshCw size={16} />}
            {status === 'loading'
              ? 'Generating Plan…'
              : status === 'success'
              ? 'Plan Generated!'
              : status === 'error'
              ? 'Failed — Tap to Retry'
              : 'Generate Weekly Plan'}
          </button>

          {status === 'success' && (
            <p className="text-center text-xs text-green-600 mt-2 font-medium">
              Your weekly meal plan has been generated. Refresh the Home screen to see it.
            </p>
          )}
          {status === 'error' && (
            <p className="text-center text-xs text-red-500 mt-2">
              Could not connect to the planner. Please try again.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-amber-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-amber-50">
          <h3 className="text-sm font-bold text-gray-700">About</h3>
        </div>
        <div className="divide-y divide-amber-50">
          {[
            { label: 'App Version', value: '1.0.0' },
            { label: 'Cuisine', value: 'Tamil Nadu' },
            { label: 'Plan Duration', value: '2 Weeks' },
            { label: 'Data Source', value: 'Google Sheets API' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm font-semibold text-gray-700">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
