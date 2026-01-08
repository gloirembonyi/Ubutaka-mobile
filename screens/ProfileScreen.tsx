
import React from 'react';
import { Screen } from '../types';
import { MOCK_USER } from '../constants';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

// Fixed missing closing logic and default export for ProfileScreen
const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate, theme, toggleTheme }) => {
  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto hide-scrollbar transition-colors">
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md px-4 py-4 border-b border-slate-100 dark:border-slate-800 text-center">
        <h2 className="text-lg font-bold dark:text-white">Profile & Settings</h2>
      </header>

      <main className="flex-1 px-5 pt-8 pb-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="size-28 rounded-full border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden bg-slate-200 dark:bg-slate-700">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${MOCK_USER.avatar}')` }}></div>
            </div>
            <button className="absolute bottom-1 right-1 bg-primary text-white size-8 rounded-full shadow-lg border-2 border-white dark:border-slate-800 flex items-center justify-center active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold mt-4 tracking-tight dark:text-white">{MOCK_USER.name}</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="material-symbols-outlined text-primary text-[18px] material-symbols-filled">verified</span>
            <p className="text-primary font-bold text-sm">Verified Citizen</p>
          </div>
        </div>

        {/* ID Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-soft p-5 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">id_card</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">National ID (NID)</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Rwanda Identification Agency</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-bold uppercase rounded">Active</span>
          </div>
          <div className="bg-slate-50 dark:bg-background-dark/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <p className="font-mono font-bold tracking-widest text-slate-700 dark:text-slate-200">1 1990 8 00*** *** *</p>
            <span className="material-symbols-outlined text-primary text-[20px] cursor-pointer active:scale-90 transition-transform">content_copy</span>
          </div>
        </div>

        {/* Prefs */}
        <div className="bg-white dark:bg-surface-dark rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mb-8">
          <div className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined">{theme === 'dark' ? 'dark_mode' : 'light_mode'}</span>
              </div>
              <span className="text-sm font-bold dark:text-slate-200">Dark Mode</span>
            </div>
            <button 
              onClick={toggleTheme}
              className={`w-12 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
            >
              <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`}></div>
            </button>
          </div>

          {[
            { icon: 'notifications', label: 'Notifications', value: 'On' },
            { icon: 'security', label: 'Privacy & Security', value: '' },
            { icon: 'help', label: 'Help Center', value: '' },
            { icon: 'logout', label: 'Log Out', color: 'text-red-500', value: '' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border-b border-slate-50 dark:border-slate-800 last:border-none cursor-pointer active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`p-2 bg-slate-50 dark:bg-slate-800 rounded-lg ${item.color || 'text-slate-500 dark:text-slate-400'}`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <span className={`text-sm font-bold ${item.color || 'dark:text-slate-200'}`}>{item.label}</span>
              </div>
              <div className="flex items-center gap-1 text-slate-400">
                {item.value && <span className="text-xs font-bold">{item.value}</span>}
                <span className="material-symbols-outlined">chevron_right</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-[0.2em] mb-4">
          Ubutaka Rwanda • v2.4.1
        </p>
      </main>
    </div>
  );
};

export default ProfileScreen;
