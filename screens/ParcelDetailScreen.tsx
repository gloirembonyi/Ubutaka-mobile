
import React, { useState } from 'react';
import { Screen } from '../types';
import { MOCK_PARCELS } from '../constants';

interface ParcelDetailScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ParcelDetailScreen: React.FC<ParcelDetailScreenProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'image' | 'map'>('image');
  const parcel = MOCK_PARCELS[0];

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-y-auto hide-scrollbar transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md px-5 py-4 justify-between border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="text-slate-800 dark:text-white flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-slate-900 dark:text-white text-lg font-bold">My Parcel</h2>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-white">
          <span className="material-symbols-outlined">share</span>
        </button>
      </header>

      <main className="pb-8">
        {/* Media Section with Toggle */}
        <div className="px-4 pt-4 pb-2 space-y-3">
          {/* View Toggle */}
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit mx-auto shadow-inner">
            <button 
              onClick={() => setViewMode('image')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'image' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
            >
              <span className="material-symbols-outlined text-[16px]">image</span>
              Image
            </button>
            <button 
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${viewMode === 'map' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-400'}`}
            >
              <span className="material-symbols-outlined text-[16px]">map</span>
              Map View
            </button>
          </div>

          <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-soft group border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
            {viewMode === 'image' ? (
              <div className="h-full w-full animate-in fade-in zoom-in-95 duration-500">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-1000 group-hover:scale-110" 
                  style={{ backgroundImage: `url('${parcel.imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-primary bg-primary/10 rounded-2xl shadow-[0_0_30px_rgba(10,127,114,0.3)] animate-pulse"></div>
              </div>
            ) : (
              <div className="h-full w-full animate-in fade-in zoom-in-95 duration-500 bg-slate-100 dark:bg-slate-900 relative">
                {/* Mock Interactive Map SVG */}
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-200 dark:text-slate-800" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Neighboring Plots */}
                  <path d="M 50 50 L 150 50 L 150 150 L 50 150 Z" fill="currentColor" className="text-slate-200 dark:text-slate-800" />
                  <text x="75" y="105" className="fill-slate-400 dark:fill-slate-600 font-mono text-[8px]">UPI: ...110</text>
                  
                  <path d="M 250 150 L 350 150 L 350 250 L 250 250 Z" fill="currentColor" className="text-slate-200 dark:text-slate-800" />
                  <text x="275" y="205" className="fill-slate-400 dark:fill-slate-600 font-mono text-[8px]">UPI: ...112</text>
                  
                  {/* Main Plot */}
                  <g className="cursor-pointer">
                    {/* Fixed duplicate className attribute by consolidating styles into one attribute and using fillOpacity */}
                    <path 
                      d="M 155 55 L 245 55 L 245 145 L 155 145 Z" 
                      fill="currentColor" 
                      fillOpacity="0.1"
                      stroke="currentColor" 
                      strokeWidth="3"
                      strokeDasharray="4 2"
                      className="text-primary"
                    />
                    <circle cx="200" cy="100" r="5" className="fill-primary" />
                    <text x="165" y="105" className="fill-primary font-bold text-[10px]">CURRENT PARCEL</text>
                  </g>
                </svg>
                
                {/* Map Overlays */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <p className="text-[8px] font-bold text-slate-400 uppercase">Registry Reference</p>
                    <p className="text-xs font-mono font-bold dark:text-white">GASABO_KACY_002</p>
                  </div>
                </div>

                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <button className="bg-white dark:bg-surface-dark size-10 rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-200 border border-slate-100 dark:border-slate-800">
                    <span className="material-symbols-outlined">add</span>
                  </button>
                  <button className="bg-white dark:bg-surface-dark size-10 rounded-full shadow-lg flex items-center justify-center text-slate-600 dark:text-slate-200 border border-slate-100 dark:border-slate-800">
                    <span className="material-symbols-outlined">remove</span>
                  </button>
                  <button className="bg-primary size-10 rounded-full shadow-lg flex items-center justify-center text-white">
                    <span className="material-symbols-outlined">my_location</span>
                  </button>
                </div>
              </div>
            )}
            
            <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-primary/20 pointer-events-none">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
              <span className="text-primary font-bold text-[10px] uppercase tracking-wide">Registered & Secure</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-4 space-y-4">
          <div className="w-full p-6 rounded-[2rem] bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute -top-4 -right-4 size-24 bg-primary/5 rounded-full group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest">Unique Parcel Identifier (UPI)</p>
                <span className="material-symbols-outlined text-primary text-[16px]">lock</span>
              </div>
              <p className="text-slate-900 dark:text-white text-3xl font-extrabold tracking-tight">{parcel.upi}</p>
              <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                Blockchain Verified
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Size', value: parcel.size, icon: 'square_foot' },
              { label: 'Use', value: parcel.use, icon: 'home_work' },
              { label: 'District', value: parcel.district, icon: 'location_city' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col p-4 rounded-2xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 text-slate-400">
                  <span className="material-symbols-outlined text-sm">{stat.icon}</span>
                  <p className="text-[8px] font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
                <p className="text-slate-900 dark:text-white text-sm font-bold truncate">{stat.value}</p>
              </div>
            ))}
          </div>

          <button className="w-full h-16 flex items-center justify-center gap-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-2xl shadow-xl shadow-primary/20 active:scale-[0.98] transition-all">
            <span className="material-symbols-outlined">download</span>
            <span>Download Title Deed</span>
          </button>
        </div>

        <div className="h-px w-full bg-slate-100 dark:bg-slate-800 my-4"></div>

        {/* History */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold">Registry Timeline</h3>
            <button className="text-primary text-xs font-bold uppercase tracking-widest">Full History</button>
          </div>
          <div className="relative pl-4">
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-100 dark:bg-slate-800"></div>
            <div className="flex gap-6 items-start relative z-10 pb-8">
              <div className="size-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 border-4 border-white dark:border-background-dark shadow-md">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-slate-900 dark:text-white text-sm font-bold">Annual Tax Cleared</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">RRA Reference: #99281-X</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">2d ago</span>
            </div>
            <div className="flex gap-6 items-start relative z-10">
              <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 border-4 border-white dark:border-background-dark shadow-sm">
                <span className="material-symbols-outlined text-[20px]">handshake</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-slate-900 dark:text-white text-sm font-bold opacity-70">Ownership Transfer</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">From: Jean Mutabazi</p>
              </div>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Feb 2021</span>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="py-6">
          <h3 className="px-6 text-slate-900 dark:text-white text-lg font-bold mb-4">Blockchain Documents</h3>
          <div className="flex overflow-x-auto gap-4 px-6 pb-4 hide-scrollbar">
            {[
              { title: 'Land Title', size: '2.4 MB', type: 'PDF', img: 'https://picsum.photos/400/600?1' },
              { title: 'Site Plan', size: '5.1 MB', type: 'PDF', img: 'https://picsum.photos/400/601?2' },
              { title: 'Survey Report', size: '1.2 MB', type: 'PDF', img: 'https://picsum.photos/400/602?3' }
            ].map((doc, idx) => (
              <div key={idx} className="shrink-0 w-44 h-56 rounded-3xl relative overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-sm border border-slate-50 dark:border-slate-700 group cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700" style={{ backgroundImage: `url('${doc.img}')` }}></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-0 p-4 w-full">
                  <div className="size-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-2">
                    <span className="material-symbols-outlined text-lg">description</span>
                  </div>
                  <p className="text-white text-sm font-bold truncate">{doc.title}</p>
                  <p className="text-slate-300 text-[10px] font-bold uppercase tracking-tight">{doc.type} • {doc.size}</p>
                </div>
              </div>
            ))}
            <div className="shrink-0 w-32 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 hover:border-primary/50 hover:text-primary transition-all cursor-pointer">
               <span className="material-symbols-outlined text-3xl mb-2">add</span>
               <span className="text-[10px] font-bold uppercase tracking-widest">Request Copy</span>
            </div>
          </div>
        </div>

        {/* Anomaly Card */}
        <div className="px-6">
          <div className="rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 p-6 flex gap-5">
            <div className="bg-amber-100 dark:bg-amber-900/40 p-3 h-fit rounded-2xl text-amber-700 dark:text-amber-400">
              <span className="material-symbols-outlined text-2xl">report_problem</span>
            </div>
            <div className="flex-1">
              <h4 className="text-slate-900 dark:text-white text-base font-bold mb-2 tracking-tight">Data Discrepancy?</h4>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mb-4 font-medium">If boundary markers or owner information appears incorrect, report an anomaly to the Land Registry.</p>
              <button 
                onClick={() => onNavigate('report-anomaly')}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 rounded-xl bg-white dark:bg-amber-950 active:scale-95 transition-all shadow-sm"
              >
                Start Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParcelDetailScreen;
