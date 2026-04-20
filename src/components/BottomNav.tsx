import { Home, UtensilsCrossed, ShoppingBasket, Settings, type LucideIcon } from 'lucide-react';
import { Screen } from '../types';

interface Props {
  active: Screen;
  onChange: (s: Screen) => void;
}

const tabs: { id: Screen; label: string; Icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'dishes', label: 'Dishes', Icon: UtensilsCrossed },
  { id: 'grocery', label: 'Grocery', Icon: ShoppingBasket },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-100 z-50">
      <div className="flex max-w-lg mx-auto">
        {tabs.map(({ id, label, Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 relative transition-colors"
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-500 rounded-b-full" />
              )}
              <Icon
                size={20}
                className={isActive ? 'text-amber-600' : 'text-gray-400'}
              />
              <span
                className={`text-[10px] font-semibold tracking-wide ${
                  isActive ? 'text-amber-600' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
