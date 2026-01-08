
import React from 'react';
import { Screen } from '../types';
import { MOCK_USER } from '../constants';

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto hide-scrollbar bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-8 pb-4 sticky top-0 z-20 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div 
              className="size-12 rounded-full bg-slate-100 bg-cover bg-center border-2 border-white shadow-sm" 
              style={{ backgroundImage: `url('${MOCK_USER.avatar}')` }}
            />
            <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 border-2 border-white">
              <span className="material-symbols-outlined text-[14px] font-bold block">check</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Muraho,</span>
            <h1 className="text-xl font-bold leading-none text-slate-900">{MOCK_USER.name}</h1>
          </div>
        </div>
        <button className="relative rounded-full p-2 hover:bg-slate-50 group transition-colors">
          <span className="material-symbols-outlined text-slate-600 group-hover:text-primary">notifications</span>
          <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
      </header>

      <main className="px-6 flex flex-col gap-6 pb-8">
        {/* Verification Status Banner */}
        <div 
          onClick={() => onNavigate('verification')}
          className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">fingerprint</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Biometric Identity</p>
              <p className="text-xs text-primary font-semibold">Active & Verified</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-slate-300">chevron_right</span>
        </div>

        {/* Hero Card */}
        <section 
          onClick={() => onNavigate('parcel-details')}
          className="relative overflow-hidden rounded-[2rem] bg-slate-900 shadow-xl shadow-slate-200 group cursor-pointer active:scale-[0.99] transition-all"
        >
          <div className="absolute inset-0 z-0 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-500" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBg3B2S4GgGnOLWO9G9snLyexmgoP8BoMiJYbNlHRmhhpZt-0LM2yKADDK40N_L83tq28leenpgC-0ZHu32zftdaKAWXOZXHV2FujdyWeNC3DVte7JcpPM9SphFSyhqaqVLT3u1uZ1NuGYlH4Ecd1klMuQZiEXqpiR2tvUH7LY3xiA_QmawIgGFRj2MlPoO1rWZyBb0Bx-ZctaP-MC0TRnujB-CfwWoi-0VYqeaLZw985AbeB37zg5cevXUbaF0lVUPs-Ra-rZdBGR3')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-tr from-slate-950/80 to-transparent"></div>
          <div className="relative z-10 p-6 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Holdings</p>
                <h2 className="text-4xl font-extrabold text-white">3 Parcels</h2>
                <p className="text-xs text-white/60 font-medium mt-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">location_on</span>
                  Karongi & Gasabo Districts
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
                <span className="material-symbols-outlined text-white text-3xl">map</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-primary text-white text-xs font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-primary/20">
                Land Certificates
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onNavigate('register-land'); }}
                className="flex-1 bg-white/10 text-white text-xs font-bold py-3.5 rounded-xl border border-white/10 backdrop-blur-md active:scale-95"
              >
                Register New
              </button>
            </div>
          </div>
        </section>

        {/* Quick Actions Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Land Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: 'add_location_alt', label: 'Register Land', color: 'primary', screen: 'register-land' },
              { icon: 'shopping_cart', label: 'Buy Land', color: 'primary', screen: 'marketplace' },
              { icon: 'sell', label: 'Sell Land', color: 'primary', screen: 'sell-land' },
              { icon: 'family_history', label: 'Inheritance', color: 'primary', screen: 'inheritance' }
            ].map((action, idx) => (
              <button 
                key={idx} 
                onClick={() => onNavigate(action.screen as Screen)}
                className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex flex-col gap-4 group active:scale-95"
              >
                <div className={`size-12 rounded-2xl bg-${action.color}/5 text-${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-2xl">{action.icon}</span>
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-800 block">{action.label}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Paperless Flow</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Transactions Snippet */}
        <section className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-slate-900">Recent Services</h3>
            <button 
              onClick={() => onNavigate('transactions')}
              className="text-primary text-xs font-bold uppercase tracking-wider"
            >
              History
            </button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                  <span className="material-symbols-outlined">payments</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Tax Payment</p>
                  <p className="text-[10px] text-slate-400">Parcel 5/03/...111</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Oct 24</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardScreen;
