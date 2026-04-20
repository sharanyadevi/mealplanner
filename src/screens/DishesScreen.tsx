import { useState, useEffect, useCallback } from 'react';
import { Search, UtensilsCrossed } from 'lucide-react';
import { fetchDishes } from '../api';
import { Dish } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const GROUP_ORDER = ['Breakfast', 'Snacks', 'Lunch', 'Dinner'];

const GROUP_STYLE: Record<string, { header: string; dot: string }> = {
  Breakfast: { header: 'bg-amber-500', dot: 'bg-amber-400' },
  Snacks: { header: 'bg-green-600', dot: 'bg-green-400' },
  Lunch: { header: 'bg-orange-500', dot: 'bg-orange-400' },
  Dinner: { header: 'bg-red-600', dot: 'bg-red-400' },
};

export default function DishesScreen() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchDishes();
      setDishes(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dishes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = dishes.filter((d) =>
    d.Dish_Name.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = GROUP_ORDER.reduce<Record<string, Dish[]>>((acc, g) => {
    acc[g] = filtered.filter((d) => d.Meal_Type === g);
    return acc;
  }, {});

  const otherTypes = [...new Set(filtered.map((d) => d.Meal_Type))].filter(
    (t) => !GROUP_ORDER.includes(t)
  );
  otherTypes.forEach((t) => {
    grouped[t] = filtered.filter((d) => d.Meal_Type === t);
  });

  const allGroups = [...GROUP_ORDER, ...otherTypes].filter((g) => grouped[g]?.length > 0);
  const visibleGroups = activeGroup ? [activeGroup] : allGroups;

  if (loading) return <LoadingSpinner message="Loading dishes…" />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
        <UtensilsCrossed size={32} className="text-red-300" />
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={load} className="px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <div className="px-4 mb-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search dishes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-200 bg-amber-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-300"
          />
        </div>
      </div>

      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        <button
          onClick={() => setActiveGroup(null)}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
            activeGroup === null
              ? 'bg-amber-500 text-white'
              : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}
        >
          All ({filtered.length})
        </button>
        {allGroups.map((g) => {
          const style = GROUP_STYLE[g] ?? { header: 'bg-gray-500', dot: 'bg-gray-400' };
          return (
            <button
              key={g}
              onClick={() => setActiveGroup(activeGroup === g ? null : g)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeGroup === g
                  ? `${style.header} text-white`
                  : 'bg-gray-50 text-gray-600 border border-gray-200'
              }`}
            >
              {g} ({grouped[g].length})
            </button>
          );
        })}
      </div>

      <div className="space-y-4 px-4">
        {visibleGroups.map((group) => {
          const items = grouped[group];
          if (!items?.length) return null;
          const style = GROUP_STYLE[group] ?? { header: 'bg-gray-500', dot: 'bg-gray-400' };
          return (
            <div key={group} className="rounded-2xl overflow-hidden shadow-sm border border-amber-100">
              <div className={`${style.header} px-4 py-2.5 flex items-center gap-2`}>
                <span className="w-2 h-2 rounded-full bg-white/60" />
                <h3 className="text-sm font-bold text-white tracking-wide">{group}</h3>
                <span className="ml-auto text-white/70 text-xs font-medium">{items.length} dishes</span>
              </div>
              <div className="bg-white divide-y divide-amber-50">
                {items.map((dish, idx) => (
                  <div key={idx} className="flex items-center gap-3 px-4 py-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                    <span className="flex-1 text-sm font-medium text-gray-700">{dish.Dish_Name}</span>
                    <div className="flex items-center gap-1.5">
                      {dish.Priority?.toLowerCase() === 'high' && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
                          HIGH
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          dish.Veg_NonVeg?.toLowerCase() === 'veg'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {dish.Veg_NonVeg?.toLowerCase() === 'veg' ? 'VEG' : 'NON-VEG'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <UtensilsCrossed size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No dishes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
