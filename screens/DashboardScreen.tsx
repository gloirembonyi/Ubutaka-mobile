
import React from 'react';
import { Screen } from '../types';
import { MOCK_USER } from '../constants';
import BottomNav from '../components/BottomNav';

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col pb-24">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-8 pb-4 sticky top-0 z-20 bg-background-light">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div 
              className="size-12 rounded-full bg-slate-200 bg-cover bg-center border-2 border-white shadow-sm" 
              style={{ backgroundImage: `url('${MOCK_USER.avatar}')` }}
            />
            <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-0.5 border-2 border-white">
              <span className="material-symbols-outlined text-[14px] font-bold block">check</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-500">Muraho,</span>
            <h1 className="text-xl font-bold leading-none text-slate-900">{MOCK_USER.name}</h1>
          </div>
        </div>
        <button className="relative rounded-full p-2 hover:bg-slate-100 group transition-colors">
          <span className="material-symbols-outlined text-slate-600 group-hover:text-primary">notifications</span>
          <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      <main className="px-6 flex flex-col gap-6">
        {/* Verification Chip */}
        <div className="flex items-center justify-between bg-primary/5 border border-primary/10 rounded-lg py-2 px-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
            <span className="text-xs font-semibold text-primary tracking-wide">UPI: 1234-5678-9012</span>
          </div>
          <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded uppercase tracking-wider">Verified Owner</span>
        </div>

        {/* Hero Card */}
        <section 
          onClick={() => onNavigate('parcel-details')}
          className="relative overflow-hidden rounded-2xl bg-white shadow-soft group cursor-pointer active:scale-[0.99] transition-all"
        >
          <div className="absolute inset-0 z-0 opacity-40 grayscale" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBg3B2S4GgGnOLWO9G9snLyexmgoP8BoMiJYbNlHRmhhpZt-0LM2yKADDK40N_L83tq28leenpgC-0ZHu32zftdaKAWXOZXHV2FujdyWeNC3DVte7JcpPM9SphFSyhqaqVLT3u1uZ1NuGYlH4Ecd1klMuQZiEXqpiR2tvUH7LY3xiA_QmawIgGFRj2MlPoO1rWZyBb0Bx-ZctaP-MC0TRnujB-CfwWoi-0VYqeaLZw985AbeB37zg5cevXUbaF0lVUPs-Ra-rZdBGR3')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
          <div className="relative z-10 p-5 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Total Holdings</p>
                <h2 className="text-3xl font-extrabold text-slate-900">3 Parcels</h2>
                <p className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">location_on</span>
                  Karongi District
                </p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-slate-100 shadow-sm">
                <span className="material-symbols-outlined text-primary text-3xl">map</span>
              </div>
            </div>
            <button className="w-full bg-primary hover:bg-primary-dark text-white text-sm font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all">
              View Certificates
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: 'handshake', label: 'Sell or Transfer', color: 'blue', screen: 'transactions' },
              { icon: 'balance', label: 'Dispute Resolution', color: 'orange', screen: 'support' },
              { icon: 'report_problem', label: 'Report Anomaly', color: 'red', screen: 'report-anomaly' },
              { icon: 'receipt_long', label: 'Land Taxes', color: 'teal', screen: 'dashboard' }
            ].map((action, idx) => (
              <button 
                key={idx} 
                onClick={() => onNavigate(action.screen as Screen)}
                className="bg-white p-4 rounded-2xl shadow-card hover:shadow-soft transition-all text-left flex flex-col gap-3 group active:scale-95 border border-transparent"
              >
                <div className={`size-10 rounded-xl bg-${action.color}-50 text-${action.color}-600 flex items-center justify-center group-hover:bg-${action.color}-600 group-hover:text-white transition-colors`}>
                  <span className="material-symbols-outlined">{action.icon}</span>
                </div>
                <span className="font-bold text-sm text-slate-700">{action.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
            <button className="text-primary text-sm font-semibold hover:underline">See All</button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center bg-white p-3 rounded-xl shadow-card border border-slate-50">
              <div className="size-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-green-600 text-xl">check_circle</span>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">Parcel #552 Survey Completed</p>
                <p className="text-xs text-slate-500">Approved by District Land Officer</p>
              </div>
              <span className="text-xs font-medium text-slate-400">2h ago</span>
            </div>
            <div className="flex items-center bg-white p-3 rounded-xl shadow-card border border-slate-50 opacity-80">
              <div className="size-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-slate-500 text-xl">history_edu</span>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">Transfer Request Draft</p>
                <p className="text-xs text-slate-500">Continued from saved session</p>
              </div>
              <span className="text-xs font-medium text-slate-400">Yesterday</span>
            </div>
          </div>
        </section>
      </main>

      <BottomNav current="dashboard" onNavigate={onNavigate} />
    </div>
  );
};

export default DashboardScreen;
