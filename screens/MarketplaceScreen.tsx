
import React from 'react';
import { Screen } from '../types';
import { MOCK_PARCELS } from '../constants';
import BottomNav from '../components/BottomNav';

interface MarketplaceScreenProps {
  onNavigate: (screen: Screen) => void;
}

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col pb-24 bg-slate-50">
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <button className="size-10 flex items-center justify-center rounded-full bg-slate-50">
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[24px] material-symbols-filled">landscape</span>
            <h1 className="text-lg font-bold">Land Market</h1>
          </div>
          <button className="size-10 flex items-center justify-center relative bg-slate-50 rounded-full">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>
        <div className="px-5 py-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="w-full pl-10 pr-4 py-3 bg-slate-100 border-none rounded-2xl text-sm font-medium focus:ring-primary/20" 
              placeholder="Search by District, UPI, or Price..." 
              type="text" 
            />
          </div>
        </div>
        <div className="px-5 pb-4 flex gap-2 overflow-x-auto hide-scrollbar">
          {['All Parcels', 'Residential', 'Agricultural', 'Commercial'].map((cat, i) => (
            <button key={i} className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold ${i === 0 ? 'bg-primary text-white' : 'bg-white text-slate-500 border border-slate-200'}`}>
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="px-5 py-6 space-y-6 flex-1 overflow-y-auto hide-scrollbar">
        <div className="flex justify-between items-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recently Added</p>
          <button 
            onClick={() => onNavigate('offline')}
            className="flex items-center gap-1 text-primary text-xs font-bold"
          >
            View on Map <span className="material-symbols-outlined text-sm">map</span>
          </button>
        </div>

        {MOCK_PARCELS.map((parcel, idx) => (
          <article 
            key={idx} 
            onClick={() => onNavigate('parcel-details')}
            className="bg-white rounded-3xl p-3 shadow-sm active:scale-[0.98] transition-all cursor-pointer border border-slate-50"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-3">
              <img src={parcel.imageUrl} className="w-full h-full object-cover" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-white/95 px-2 py-1 rounded-lg shadow-sm">
                <span className="material-symbols-outlined text-primary text-sm material-symbols-filled">verified</span>
                <span className="text-[9px] font-bold text-primary">VERIFIED</span>
              </div>
              <button className="absolute top-2.5 right-2.5 size-8 rounded-full bg-black/20 backdrop-blur-sm text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">favorite</span>
              </button>
              <div className="absolute bottom-3 left-3">
                <p className="text-white text-lg font-bold">RWF {parcel.price?.toLocaleString() || '45M'}</p>
              </div>
            </div>
            <div className="px-1">
              <h3 className="font-bold text-slate-900">{parcel.location} {parcel.use} Plot</h3>
              <div className="flex items-center gap-1 text-slate-500 mt-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span className="text-xs font-medium">Kigali City, {parcel.district}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-50">
                {[
                  { icon: 'square_foot', val: parcel.size },
                  { icon: 'home_work', val: parcel.use },
                  { icon: 'policy', val: 'Freehold' }
                ].map((item, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl py-2 flex flex-col items-center">
                    <span className="material-symbols-outlined text-primary text-lg mb-0.5">{item.icon}</span>
                    <span className="text-[9px] font-bold text-slate-700">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </main>

      <div className="fixed bottom-24 right-6 pointer-events-none">
        <button 
          onClick={() => onNavigate('inheritance')}
          className="pointer-events-auto bg-primary text-white px-5 py-3.5 rounded-full font-bold shadow-xl flex items-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">add</span>
          Sell Land
        </button>
      </div>

      <BottomNav current="marketplace" onNavigate={onNavigate} />
    </div>
  );
};

export default MarketplaceScreen;
