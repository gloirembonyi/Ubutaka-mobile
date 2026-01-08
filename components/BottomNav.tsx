
import React from 'react';
import { Screen } from '../types';

interface BottomNavProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ current, onNavigate }) => {
  const getActiveTab = (screen: Screen): Screen => {
    if (['dashboard', 'parcel-details', 'report-anomaly', 'register-land'].includes(screen)) return 'dashboard';
    if (['marketplace', 'offline', 'buy-land'].includes(screen)) return 'marketplace';
    if (['transactions', 'inheritance', 'sell-land'].includes(screen)) return 'transactions';
    if (['support'].includes(screen)) return 'support';
    if (['profile'].includes(screen)) return 'profile';
    return screen;
  };

  const activeTab = getActiveTab(current);

  const items = [
    { id: 'dashboard' as Screen, icon: 'home', label: 'Home' },
    { id: 'marketplace' as Screen, icon: 'map', label: 'Market' },
    { id: 'transactions' as Screen, icon: 'receipt_long', label: 'Actions', center: true },
    { id: 'support' as Screen, icon: 'school', label: 'Learn' },
    { id: 'profile' as Screen, icon: 'person', label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white/95 backdrop-blur-lg border-t border-slate-100 px-6 py-2 flex justify-between items-end z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      {items.map((item) => (
        item.center ? (
          <button 
            key={item.id} 
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center justify-end -mt-8 active:scale-95 transition-transform"
          >
            <div className={`size-14 rounded-full shadow-lg flex items-center justify-center border-4 border-white transition-all ${activeTab === item.id ? 'bg-primary shadow-primary/30' : 'bg-slate-400 shadow-slate-200'}`}>
              <span className="material-symbols-outlined text-[28px] text-white">
                {activeTab === item.id ? 'layers' : 'add'}
              </span>
            </div>
            <span className={`text-[10px] font-bold mt-1 transition-colors ${activeTab === item.id ? 'text-primary' : 'text-slate-400'}`}>
              {item.label}
            </span>
          </button>
        ) : (
          <button 
            key={item.id} 
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 group w-14 transition-colors ${activeTab === item.id ? 'text-primary' : 'text-slate-400'}`}
          >
            <div className={`p-1 rounded-full transition-colors ${activeTab === item.id ? 'bg-primary/10' : 'group-hover:bg-slate-50'}`}>
              <span className={`material-symbols-outlined ${activeTab === item.id ? 'font-bold material-symbols-filled' : 'font-medium'}`}>
                {item.icon}
              </span>
            </div>
            <span className={`text-[10px] transition-all ${activeTab === item.id ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </button>
        )
      ))}
    </nav>
  );
};

export default BottomNav;
