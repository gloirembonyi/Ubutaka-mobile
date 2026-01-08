
import React from 'react';
import { Screen } from '../types';
import { MOCK_PARCELS } from '../constants';

interface MarketplaceScreenProps {
  onNavigate: (screen: Screen) => void;
}

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col bg-white overflow-y-auto hide-scrollbar">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-50">
            <span className="material-symbols-outlined">sort</span>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[24px] material-symbols-filled">landscape</span>
            <h1 className="text-lg font-bold">Land Market</h1>
          </div>
          <button className="size-10 flex items-center justify-center bg-slate-50 rounded-full">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
        <div className="px-5 py-3">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors">search</span>
            <input 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all" 
              placeholder="Search Districts, UPI..." 
              type="text" 
            />
          </div>
        </div>
      </header>

      <main className="px-5 py-6 space-y-8 flex-1">
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Available Parcels</p>
            <span className="text-xs font-bold text-slate-300">128 Results</span>
          </div>

          <div className="space-y-6">
            {MOCK_PARCELS.map((parcel, idx) => (
              <article 
                key={idx} 
                onClick={() => onNavigate('buy-land')}
                className="group bg-white rounded-[2.5rem] p-3 shadow-sm hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 cursor-pointer border border-slate-50"
              >
                <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-4">
                  <img src={parcel.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 bg-white/95 px-3 py-1.5 rounded-full shadow-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm material-symbols-filled">verified</span>
                    <span className="text-[10px] font-bold text-slate-900 uppercase">Registry Verified</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                    <div>
                      <p className="text-xs font-bold text-white/80 uppercase mb-1">{parcel.district}</p>
                      <h3 className="text-xl font-bold leading-none">{parcel.location}</h3>
                    </div>
                    <div className="bg-primary px-4 py-2 rounded-2xl shadow-lg">
                      <p className="text-sm font-bold">RWF {parcel.price?.split(',')[0]}M</p>
                    </div>
                  </div>
                </div>
                
                <div className="px-3 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-slate-300 text-lg">square_foot</span>
                      <span className="text-[11px] font-bold text-slate-600">{parcel.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-slate-300 text-lg">home_work</span>
                      <span className="text-[11px] font-bold text-slate-600">{parcel.use}</span>
                    </div>
                  </div>
                  <div className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:bg-primary/5 transition-all">
                    <span className="material-symbols-outlined text-xl">favorite</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      <div className="fixed bottom-24 right-6 z-40">
        <button 
          onClick={() => onNavigate('sell-land')}
          className="bg-primary text-white px-6 py-4 rounded-3xl font-bold shadow-2xl shadow-primary/30 flex items-center gap-2 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined">sell</span>
          Sell Yours
        </button>
      </div>
    </div>
  );
};

export default MarketplaceScreen;
