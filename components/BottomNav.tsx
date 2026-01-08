
import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ current, onNavigate }) => {
  const items = [
    { id: 'dashboard' as Screen, icon: 'home', label: 'Home' },
    { id: 'marketplace' as Screen, icon: 'map', label: 'Market' },
    { id: 'transactions' as Screen, icon: 'receipt_long', label: 'Actions', center: true },
    { id: 'support' as Screen, icon: 'school', label: 'Learn' },
    { id: 'profile' as Screen, icon: 'person', label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white/95 backdrop-blur-lg border-t border-slate-200 px-6 py-2 flex justify-between items-end z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {items.map((item) => (
        item.center ? (
          <button 
            key={item.id} 
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-end -mt-8 active:scale-95 transition-transform"
          >
            <div className="size-14 rounded-full bg-primary shadow-lg shadow-primary/40 flex items-center justify-center text-white border-4 border-white">
              <span className="material-symbols-outlined text-[28px]">add</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 mt-1">{item.label}</span>
          </button>
        ) : (
          <button 
            key={item.id} 
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 group w-14 transition-colors ${current === item.id ? 'text-primary' : 'text-slate-400'}`}
          >
            <div className={`p-1 rounded-full ${current === item.id ? 'bg-primary/10' : 'group-hover:bg-slate-100'}`}>
              <span className={`material-symbols-outlined ${current === item.id ? 'font-bold' : 'font-medium'}`}>{item.icon}</span>
            </div>
            <span className={`text-[10px] ${current === item.id ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
          </button>
        )
      ))}
    </nav>
  );
};

export default BottomNav;
