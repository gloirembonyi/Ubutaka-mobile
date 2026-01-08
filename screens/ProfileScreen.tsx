
import React from 'react';
import { Screen } from '../types';
import { MOCK_USER } from '../constants';
import BottomNav from '../components/BottomNav';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col pb-24 bg-background-light">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-4 py-4 border-b border-slate-100 text-center">
        <h2 className="text-lg font-bold">Profile & Settings</h2>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-8 hide-scrollbar">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <div className="size-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-200">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${MOCK_USER.avatar}')` }}></div>
            </div>
            <button className="absolute bottom-1 right-1 bg-primary text-white size-8 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>
          </div>
          <h1 className="text-2xl font-bold mt-4 tracking-tight">{MOCK_USER.name}</h1>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="material-symbols-outlined text-primary text-[18px] material-symbols-filled">verified</span>
            <p className="text-primary font-bold text-sm">Verified Citizen</p>
          </div>
        </div>

        {/* ID Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-soft p-5 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="material-symbols-outlined">id_card</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">National ID (NID)</p>
                <p className="text-[10px] text-slate-400">Rwanda Identification Agency</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold uppercase rounded">Active</span>
          </div>
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
            <p className="font-mono font-bold tracking-widest text-slate-700">1 1990 8 00*** *** *</p>
            <span className="material-symbols-outlined text-primary text-[20px]">content_copy</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {[
            { icon: 'folder_shared', label: 'Documents', color: 'blue' },
            { icon: 'shield_lock', label: 'Security', color: 'teal' },
            { icon: 'translate', label: 'Language', color: 'purple', sub: 'Kinyarwanda' },
            { icon: 'support_agent', label: 'Support', color: 'orange' }
          ].map((item, idx) => (
            <button key={idx} className="flex flex-col items-center gap-2 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm active:scale-95 transition-all">
              <div className={`size-12 rounded-full bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center`}>
                <span className="material-symbols-outlined">{item.icon}</span>
              </div>
              <span className="text-sm font-bold text-slate-700">{item.label}</span>
              {item.sub && <span className="text-[8px] text-slate-400 -mt-1 font-bold">{item.sub}</span>}
            </button>
          ))}
        </div>

        {/* Prefs */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-8">
          {[
            { icon: 'notifications', label: 'Notifications', hasDot: true },
            { icon: 'fingerprint', label: 'Biometric Login', hasToggle: true },
            { icon: 'dark_mode', label: 'Appearance', value: 'System' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border-b border-slate-50 last:border-none">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-lg text-slate-500">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <span className="text-sm font-bold text-slate-700">{item.label}</span>
              </div>
              {item.hasDot && <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>}
              {item.hasToggle && (
                <div className="w-11 h-6 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 size-4 bg-white rounded-full"></div>
                </div>
              )}
              {item.value && <span className="text-xs font-bold text-slate-400">{item.value}</span>}
            </div>
          ))}
        </div>

        <button 
          onClick={() => onNavigate('landing')}
          className="w-full py-4 text-red-500 font-bold text-sm bg-red-50 border border-red-100 rounded-2xl mb-8"
        >
          Sign Out
        </button>
      </main>

      <BottomNav current="profile" onNavigate={onNavigate} />
    </div>
  );
};

export default ProfileScreen;
