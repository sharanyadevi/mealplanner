import { useState, useEffect } from 'react';
import { X, Check, AlertTriangle } from 'lucide-react';
import { GroceryItem } from '../types';
import { updateGrocery } from '../api';

interface Props {
  item: GroceryItem;
  onClose: () => void;
  onSaved: (qty: number) => void;
}

export default function GroceryUpdateModal({ item, onClose, onSaved }: Props) {
  const [qty, setQty] = useState(String(item.Current_Qty));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isLow = item.Current_Qty <= item.Reorder_Level;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handleSave() {
    const parsed = parseFloat(qty);
    if (isNaN(parsed) || parsed < 0) {
      setError('Please enter a valid quantity');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await updateGrocery(item.Ingredient, String(parsed));
      onSaved(parsed);
    } catch {
      setError('Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-white rounded-t-2xl shadow-2xl p-6 pb-10 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">Update Stock</p>
            <h2 className="text-lg font-bold text-gray-800">{item.Ingredient}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        {isLow && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">
            <AlertTriangle size={16} className="text-red-500 shrink-0" />
            <p className="text-xs text-red-600 font-medium">
              Stock is low! Reorder level: {item.Reorder_Level} {item.Unit}
            </p>
          </div>
        )}

        <div className="flex gap-4 bg-amber-50 rounded-xl p-4 mb-5">
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-500 mb-1">Current</p>
            <p className="text-xl font-bold text-gray-800">{item.Current_Qty}</p>
            <p className="text-xs text-gray-400">{item.Unit}</p>
          </div>
          <div className="w-px bg-amber-200" />
          <div className="flex-1 text-center">
            <p className="text-xs text-gray-500 mb-1">Reorder at</p>
            <p className="text-xl font-bold text-red-400">{item.Reorder_Level}</p>
            <p className="text-xs text-gray-400">{item.Unit}</p>
          </div>
        </div>

        <label className="block text-sm font-semibold text-gray-700 mb-1">
          New Quantity ({item.Unit})
        </label>
        <input
          autoFocus
          type="number"
          min="0"
          step="0.1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="w-full border border-amber-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50 text-sm"
        />

        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-green-600 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check size={16} />
                Update
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
