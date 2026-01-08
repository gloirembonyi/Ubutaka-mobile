
import React, { useState } from 'react';
import { Screen } from '../types';
import { MOCK_PARCELS } from '../constants';

interface SellLandScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SellLandScreen: React.FC<SellLandScreenProps> = ({ onNavigate }) => {
  const [selectedParcel, setSelectedParcel] = useState(MOCK_PARCELS[0].upi);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <header className="sticky top-0 z-30 bg-white p-4 border-b border-slate-100 flex items-center">
        <button onClick={() => onNavigate('transactions')} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-50">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10">List Land for Sale</h2>
      </header>

      <main className="flex-1 p-6 overflow-y-auto space-y-8">
        <section>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Select Parcel to Sell</h3>
          <div className="space-y-3">
            {MOCK_PARCELS.map((p) => (
              <div 
                key={p.upi}
                onClick={() => setSelectedParcel(p.upi)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${selectedParcel === p.upi ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-200'}`}
              >
                <div className="size-12 rounded-xl overflow-hidden shrink-0">
                  <img src={p.imageUrl} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{p.location} {p.use}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{p.upi}</p>
                </div>
                {selectedParcel === p.upi && (
                  <span className="material-symbols-outlined text-primary">check_circle</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pricing & Terms</h3>
          
          <div className="p-4 rounded-2xl border border-slate-200 bg-white focus-within:border-primary transition-colors">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asking Price (RWF)</label>
            <input type="number" className="w-full border-none p-0 text-2xl font-bold focus:ring-0" placeholder="0" />
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="material-symbols-outlined text-slate-400">info</span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upon listing, a smart contract will be created. A 1% platform fee applies only when the sale is completed.
            </p>
          </div>
        </section>
      </main>

      <footer className="p-4 border-t border-slate-100 bg-white">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          Publish to Marketplace
        </button>
      </footer>
    </div>
  );
};

export default SellLandScreen;
