import { useState, useEffect, useCallback } from 'react';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { fetchWeeklyPlan } from '../api';
import { DayPlan, MealType } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import MealOverrideModal from '../components/MealOverrideModal';

const MEAL_TYPES: MealType[] = ['Breakfast', 'Snacks', 'Lunch', 'Dinner'];

const MEAL_STYLE: Record<MealType, { dot: string; label: string; bg: string }> = {
  Breakfast: { dot: 'bg-amber-400', label: 'text-amber-700', bg: 'bg-amber-50' },
  Snacks: { dot: 'bg-green-400', label: 'text-green-700', bg: 'bg-green-50' },
  Lunch: { dot: 'bg-orange-400', label: 'text-orange-700', bg: 'bg-orange-50' },
  Dinner: { dot: 'bg-red-400', label: 'text-red-700', bg: 'bg-red-50' },
};

function generateNext14Days(): string[] {
  const days: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return {
    weekday: d.toLocaleDateString('en-IN', { weekday: 'short' }),
    day: d.getDate(),
    month: d.toLocaleDateString('en-IN', { month: 'short' }),
    full: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }),
  };
}

interface ModalState {
  date: string;
  mealType: MealType;
  currentDish: string;
}

export default function HomeScreen() {
  const [plan, setPlan] = useState<Record<string, DayPlan>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<ModalState | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const days = generateNext14Days();
  const today = days[0];

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchWeeklyPlan();
      const map: Record<string, DayPlan> = {};
      data.forEach((d) => {
        if (d.date) map[d.date] = d;
      });
      setPlan(map);
      setExpandedDays(new Set(days.slice(0, 3)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load plan');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function toggleDay(date: string) {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      next.has(date) ? next.delete(date) : next.add(date);
      return next;
    });
  }

  function openModal(date: string, mealType: MealType) {
    const dayPlan = plan[date] ?? {};
    setModal({ date, mealType, currentDish: dayPlan[mealType] ?? '' });
  }

  function handleSaved(date: string, mealType: MealType, dish: string) {
    setPlan((prev) => ({
      ...prev,
      [date]: { ...prev[date], date, [mealType]: dish },
    }));
    setModal(null);
    load();
  }

  if (loading) return <LoadingSpinner message="Loading meal plan…" />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
          <Calendar size={28} className="text-red-400" />
        </div>
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={load} className="px-6 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold">
          Retry
        </button>
      </div>
    );
  }

  const week1 = days.slice(0, 7);
  const week2 = days.slice(7, 14);

  return (
    <>
      <div className="pb-4">
        {[week1, week2].map((week, wi) => (
          <div key={wi} className="mb-2">
            <div className="px-4 py-2 flex items-center gap-2">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
                {wi === 0 ? 'This Week' : 'Next Week'}
              </span>
              <div className="flex-1 h-px bg-amber-100" />
            </div>
            <div className="space-y-2 px-4">
              {week.map((date) => {
                const isToday = date === today;
                const dayData = plan[date] ?? {};
                const isExpanded = expandedDays.has(date);
                const fmt = formatDate(date);
                const hasMeals = MEAL_TYPES.some((m) => dayData[m]);

                return (
                  <div
                    key={date}
                    className={`rounded-2xl overflow-hidden shadow-sm border ${
                      isToday ? 'border-amber-400 ring-1 ring-amber-300' : 'border-amber-100'
                    } bg-white`}
                  >
                    <button
                      onClick={() => toggleDay(date)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left ${
                        isToday ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-white'
                      }`}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0 ${
                          isToday ? 'bg-white/20' : 'bg-amber-50'
                        }`}
                      >
                        <span className={`text-[10px] font-bold uppercase ${isToday ? 'text-white/80' : 'text-amber-400'}`}>
                          {fmt.weekday}
                        </span>
                        <span className={`text-lg font-black leading-none ${isToday ? 'text-white' : 'text-gray-800'}`}>
                          {fmt.day}
                        </span>
                        <span className={`text-[9px] ${isToday ? 'text-white/70' : 'text-gray-400'}`}>
                          {fmt.month}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-gray-700'}`}>
                            {isToday ? 'Today' : fmt.weekday + ', ' + fmt.day + ' ' + fmt.month}
                          </span>
                          {!hasMeals && (
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isToday ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                              No plan
                            </span>
                          )}
                        </div>
                        {hasMeals && (
                          <p className={`text-xs mt-0.5 truncate ${isToday ? 'text-white/80' : 'text-gray-400'}`}>
                            {MEAL_TYPES.filter((m) => dayData[m]).map((m) => dayData[m]).join(' · ')}
                          </p>
                        )}
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={16} className={isToday ? 'text-white/70' : 'text-gray-400'} />
                      ) : (
                        <ChevronDown size={16} className={isToday ? 'text-white/70' : 'text-gray-400'} />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="divide-y divide-amber-50">
                        {MEAL_TYPES.map((mealType) => {
                          const dish = dayData[mealType] ?? '';
                          const style = MEAL_STYLE[mealType];
                          return (
                            <button
                              key={mealType}
                              onClick={() => openModal(date, mealType)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:${style.bg} transition-colors group`}
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                              <span className={`text-xs font-bold w-16 shrink-0 ${style.label}`}>
                                {mealType}
                              </span>
                              <span className={`flex-1 text-sm ${dish ? 'text-gray-700 font-medium' : 'text-gray-300 italic'}`}>
                                {dish || 'Tap to set…'}
                              </span>
                              <span className="text-[10px] text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                                Edit
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <MealOverrideModal
          date={modal.date}
          mealType={modal.mealType}
          currentDish={modal.currentDish}
          onClose={() => setModal(null)}
          onSaved={(dish) => handleSaved(modal.date, modal.mealType, dish)}
        />
      )}
    </>
  );
}
