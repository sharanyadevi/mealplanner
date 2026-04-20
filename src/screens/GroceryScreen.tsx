import { useState, useEffect, useCallback } from 'react';
import { Search, ShoppingBasket, AlertTriangle, CheckCircle } from 'lucide-react';
import { fetchGrocery } from '../api';
import { GroceryItem } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import GroceryUpdateModal from '../components/GroceryUpdateModal';

type Filter = 'all' | 'low' | 'ok';

export default function GroceryScreen() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<GroceryItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchGrocery();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load grocery list');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const lowCount = items.filter((i) => i.Current_Qty <= i.Reorder_Level).length;

  const filtered = items.filter((item) => {
    const matchSearch = item.Ingredient.toLowerCase().includes(search.toLowerCase());
    const isLow = item.Current_Qty <= item.Reorder_Level;
    if (filter === 'low') return matchSearch && isLow;
    if (filter === 'ok') return matchSearch && !isLow;
    return matchSearch;
  });

  function handleSaved(ingredient: string, qty: number) {
    setItems((prev) =>
      prev.map((i) => (i.Ingredient === ingredient ? { ...i, Current_Qty: qty } : i))
    );
    setSelected(null);
  }

  if (loading) return <LoadingSpinner message="Loading grocery list…" />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
        <ShoppingBasket size={32} className="text-red-300" />
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={load} className="px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="pb-4">
        {lowCount > 0 && (
          <div className="mx-4 mb-3 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <AlertTriangle size={16} className="text-red-500 shrink-0" />
            <p className="text-xs text-red-600 font-semibold">
              {lowCount} item{lowCount > 1 ? 's' : ''} need{lowCount === 1 ? 's' : ''} restocking
            </p>
          </div>
        )}

        <div className="px-4 mb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search ingredients…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
          </div>
        </div>

        <div className="px-4 mb-4 flex gap-2">
          {(['all', 'low', 'ok'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-colors ${
                filter === f
                  ? f === 'low'
                    ? 'bg-red-500 text-white'
                    : f === 'ok'
                    ? 'bg-green-600 text-white'
                    : 'bg-amber-500 text-white'
                  : 'bg-gray-50 text-gray-500 border border-gray-200'
              }`}
            >
              {f === 'all' ? `All (${items.length})` : f === 'low' ? `Low (${lowCount})` : `OK (${items.length - lowCount})`}
            </button>
          ))}
        </div>

        <div className="px-4 space-y-2">
          {filtered.map((item, idx) => {
            const isLow = item.Current_Qty <= item.Reorder_Level;
            const pct = item.Reorder_Level > 0
              ? Math.min(100, (item.Current_Qty / (item.Reorder_Level * 2)) * 100)
              : 100;

            return (
              <button
                key={idx}
                onClick={() => setSelected(item)}
                className={`w-full text-left rounded-xl border ${
                  isLow ? 'border-red-200 bg-red-50' : 'border-amber-100 bg-white'
                } px-4 py-3 shadow-sm hover:shadow-md transition-shadow group`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 p-1.5 rounded-lg ${isLow ? 'bg-red-100' : 'bg-green-100'}`}>
                    {isLow ? (
                      <AlertTriangle size={14} className="text-red-500" />
                    ) : (
                      <CheckCircle size={14} className="text-green-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-sm font-semibold truncate ${isLow ? 'text-red-700' : 'text-gray-700'}`}>
                        {item.Ingredient}
                      </span>
                      <span className={`shrink-0 text-sm font-bold ${isLow ? 'text-red-600' : 'text-gray-700'}`}>
                        {item.Current_Qty}
                        <span className="text-xs font-normal ml-0.5 text-gray-400">{item.Unit}</span>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isLow ? 'bg-red-400' : 'bg-green-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-gray-400">
                        Reorder at {item.Reorder_Level} {item.Unit}
                      </span>
                      <span className="text-[10px] text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                        Tap to update
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <ShoppingBasket size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">No items found</p>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <GroceryUpdateModal
          item={selected}
          onClose={() => setSelected(null)}
          onSaved={(qty) => handleSaved(selected.Ingredient, qty)}
        />
      )}
    </>
  );
}
