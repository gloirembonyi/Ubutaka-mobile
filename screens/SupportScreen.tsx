
import React from 'react';
import { Screen } from '../types';

interface SupportScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SupportScreen: React.FC<SupportScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto hide-scrollbar">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold dark:text-white">Support & Learning</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ubutaka Assistant</p>
        </div>
      </header>

      <main className="flex-1 pb-8">
        {/* Dispute Status Card */}
        <div className="px-6 mt-6">
          <button 
            onClick={() => onNavigate('dispute-list')}
            className="w-full p-6 rounded-[2.5rem] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/50 flex items-center justify-between group active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                <span className="material-symbols-outlined text-3xl">gavel</span>
              </div>
              <div className="text-left">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Community Disputes</h3>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Track mediation & resolution cases</p>
              </div>
            </div>
            <span className="material-symbols-outlined text-amber-400 group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>

        {/* Featured Card */}
        <div className="px-6 mt-6">
          <div className="relative h-64 rounded-2xl overflow-hidden shadow-sm group">
            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdHSKm206t503Kxo_6iT47qpdrmlI9IIprpR1ItPs684rHLGA5aUYGU1jqcJGA-AWLw1DzZ-7rt6-2bAaGThDFwK1IHJwzHTB13yaKAdi3attHJbyl15KA4hwKciHPH1GCUf_flVCgE39Q_Vusm_X1ctoamh8KqF0SseTgNzuccgD3hyQh9DDnv4NHjHY8zCNuWifbEQe6g-KdEeyghJXa5tPVhm6HuiN9JWoGnRyOQUS7rzXxksAx1qXPfBkbqonXlNq09mNpYaHX')" }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 p-6">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 mb-3 rounded bg-accent text-[#3d2e0f] text-[10px] font-bold">
                <span className="material-symbols-outlined text-[14px]">school</span>
                New Guide
              </span>
              <h2 className="text-2xl font-bold text-white leading-tight">Master Ubutaka in minutes</h2>
              <p className="text-white/80 text-xs mt-1">Simple guides to manage land confidently.</p>
            </div>
          </div>
        </div>

        {/* Interactive Grid */}
        <section className="px-6 mt-8">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Interactive Guides</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: 'swap_horiz', title: 'Transfer Title', sub: 'Step-by-step land transfer', color: 'blue' },
              { icon: 'gavel', title: 'Report Dispute', sub: 'Conflict resolution help', color: 'orange' },
              { icon: 'search_check', title: 'Check Status', sub: 'Verify your land ownership', color: 'purple' },
              { icon: 'headset_mic', title: 'Audio Guides', sub: 'Listen to instructions', color: 'emerald' }
            ].map((guide, idx) => (
              <button key={idx} className="flex flex-col items-start p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-50 dark:border-slate-800 shadow-sm active:scale-95 transition-all text-left">
                <div className={`size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-3 text-slate-600 dark:text-slate-400`}>
                  <span className="material-symbols-outlined">{guide.icon}</span>
                </div>
                <h4 className="text-sm font-bold leading-tight dark:text-white">{guide.title}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">{guide.sub}</p>
              </button>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="px-6 mt-10 mb-8">
          <h3 className="text-lg font-bold mb-4 dark:text-white">Common Questions</h3>
          <div className="space-y-3">
            {[
              "Is my land data safe on this app?",
              "Do I need an agent to sell land?",
              "What if I forget my PIN?"
            ].map((q, idx) => (
              <details key={idx} className="group bg-white dark:bg-surface-dark rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{q}</span>
                  <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
                </summary>
                <div className="px-4 pb-4 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-50 dark:border-slate-800 pt-3">
                  This is a placeholder answer. All data is blockchain verified and managed by NLA Rwanda.
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Support CTA */}
        <div className="px-4 pb-8">
          <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-float p-4 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-slate-800 shadow-sm" style={{ backgroundImage: "url('https://picsum.photos/100/100')" }}></div>
                <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold dark:text-white">Need human help?</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Agents available now</p>
              </div>
            </div>
            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all">
              Call Support
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportScreen;
