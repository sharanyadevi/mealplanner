import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { addDish } from '../api';

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

const MEAL_TYPES = ['Breakfast', 'Snacks', 'Lunch', 'Dinner'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Biweekly', 'Monthly', 'Occasional'];

export default function AddDishModal({ onClose, onSaved }: Props) {
  const [dishName, setDishName] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [vegNonVeg, setVegNonVeg] = useState('Veg');
  const [ingredients, setIngredients] = useState('');
  const [frequency, setFrequency] = useState('Weekly');
  const [priority, setPriority] = useState('Medium');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  async function handleSave() {
    if (!dishName.trim()) {
      setError('Dish name is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await addDish(dishName.trim(), mealType, vegNonVeg, ingredients.trim(), frequency, priority);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to add dish. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const pillClass = (active: boolean, color: string = 'amber') =>
    `px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
      active
        ? color === 'green'
          ? 'bg-green-600 text-white'
          : color === 'red'
          ? 'bg-red-500 text-white'
          : 'bg-amber-500 text-white'
        : 'bg-gray-100 text-gray-500'
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-t-2xl shadow-2xl p-6 pb-24 animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-widest">New Dish</p>
            <h2 className="text-lg font-bold text-gray-800">Add Dish</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Dish Name</label>
            <input
              autoFocus
              type="text"
              value={dishName}
              onChange={(e) => setDishName(e.target.value)}
              placeholder="e.g. Pongal, Sambar…"
              className="w-full border border-amber-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type</label>
            <div className="flex flex-wrap gap-2">
              {MEAL_TYPES.map((t) => (
                <button key={t} onClick={() => setMealType(t)} className={pillClass(mealType === t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Veg / Non-Veg</label>
            <div className="flex gap-2">
              <button onClick={() => setVegNonVeg('Veg')} className={pillClass(vegNonVeg === 'Veg', 'green')}>
                Veg
              </button>
              <button onClick={() => setVegNonVeg('NonVeg')} className={pillClass(vegNonVeg === 'NonVeg', 'red')}>
                Non-Veg
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Ingredients</label>
            <input
              type="text"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="Comma-separated (e.g. Rice, Dal, Pepper…)"
              className="w-full border border-amber-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-amber-50 text-sm"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {FREQUENCY_OPTIONS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-amber-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-amber-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-xs mt-3">{error}</p>}

        <div className="flex gap-3 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !dishName.trim()}
            className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-amber-600 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Check size={16} />
                Add Dish
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
