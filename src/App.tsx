import { useState } from 'react';
import { Calendar, Flame } from 'lucide-react';
import { Screen } from './types';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import DishesScreen from './screens/DishesScreen';
import GroceryScreen from './screens/GroceryScreen';
import SettingsScreen from './screens/SettingsScreen';

const SCREEN_TITLES: Record<Screen, string> = {
  home: 'Meal Calendar',
  dishes: 'Our Dishes',
  grocery: 'Grocery',
  settings: 'Settings',
};

const SCREEN_SUBTITLES: Record<Screen, string> = {
  home: '2-week family plan',
  dishes: 'Tamil Nadu recipes',
  grocery: 'Stock management',
  settings: 'TN Meal Planner',
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col max-w-lg mx-auto">
      <header className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-4 pt-12 pb-4 shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            {screen === 'home' ? <Calendar size={18} className="text-white" /> : <Flame size={18} className="text-white" />}
          </div>
          <div>
            <h1 className="text-base font-black leading-tight">{SCREEN_TITLES[screen]}</h1>
            <p className="text-white/70 text-[11px] font-medium">{SCREEN_SUBTITLES[screen]}</p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white/40" />
            <span className="w-2 h-2 rounded-full bg-white/60" />
            <span className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pt-3 pb-20">
        {screen === 'home' && <HomeScreen />}
        {screen === 'dishes' && <DishesScreen />}
        {screen === 'grocery' && <GroceryScreen />}
        {screen === 'settings' && <SettingsScreen />}
      </main>

      <BottomNav active={screen} onChange={setScreen} />
    </div>
  );
}
