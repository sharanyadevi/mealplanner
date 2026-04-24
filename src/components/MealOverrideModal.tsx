import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { MealType } from '../types';
import { overrideMeal } from '../api';

interface Props {
  date: string;
  mealType: MealType;
  currentDish: string;
  onClose: () => void;
  onSaved: (dish: string) => void;
}

const mealColors: Record<MealType, string> = {
  Breakfast: 'bg-amber-100 text-amber-800',
  Snacks: 'bg-green-100 text-green-800',
  Lunch: 'bg-orange-100 text-orange-800',
  Dinner: 'bg-red-100 text-red-800',
};

export default function MealOverrideModal({ date, mealType, currentDish, onClose, onSaved }: Props) {
  const [dish, setDish] = useState(currentDish);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const formatted = new Date(date + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  async function handleSave() {
    if (!dish.trim()) return;
    setSaving(true);
    setError('');
    try {
      await overrideMeal(date, mealType, dish.trim());
      onSaved(dish.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="w-full max-w-lg bg-white rounded-t-2xl shadow-2xl p-6 pb-24 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">{formatted}</p>
            <h2 className="text-lg font-bold text-gray-800">Override Meal</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${mealColors[mealType]}`}>
            {mealType}
          </span>
        </div>

        <label className="block text-sm font-semibold text-gray-700 mb-1">Dish Name</label>
        <input
          autoFocus
          type="text"
          value={dish}
          onChange={(e) => setDish(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          placeholder="Enter dish name…"
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
            disabled={saving || !dish.trim()}
            className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check size={16} />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
