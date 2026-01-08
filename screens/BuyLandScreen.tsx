
import React, { useState } from 'react';
import { Screen } from '../types';
import { MOCK_PARCELS } from '../constants';

interface BuyLandScreenProps {
  onNavigate: (screen: Screen) => void;
}

const BuyLandScreen: React.FC<BuyLandScreenProps> = ({ onNavigate }) => {
  const parcel = MOCK_PARCELS[0];
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <header className="sticky top-0 z-30 bg-white p-4 border-b border-slate-100 flex items-center">
        <button onClick={() => onNavigate('marketplace')} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-50">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10">Confirm Purchase</h2>
      </header>

      <main className="flex-1 p-6 overflow-y-auto space-y-6">
        <div className="rounded-3xl overflow-hidden shadow-sm aspect-video mb-4">
          <img src={parcel.imageUrl} className="w-full h-full object-cover" alt="" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">{parcel.location} Parcel</h1>
          <p className="text-slate-500 font-medium">UPI: {parcel.upi} • {parcel.size}</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-500">Price</span>
            <span className="text-lg font-extrabold text-slate-900">RWF {parcel.price}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-400">Transfer Tax (5%)</span>
            <span className="text-sm font-bold">RWF 2,250,000</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs font-bold text-slate-400">Registration Fee</span>
            <span className="text-sm font-bold">RWF 27,500</span>
          </div>
        </div>

        <section className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verification Status</h3>
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
            <span className="material-symbols-outlined text-green-600">verified</span>
            <div>
              <p className="text-xs font-bold text-green-800 uppercase">Registry Verified</p>
              <p className="text-[10px] text-green-700">No active disputes recorded for this UPI.</p>
            </div>
          </div>
        </section>

        <label className="flex gap-3 cursor-pointer p-2">
          <input 
            type="checkbox" 
            className="rounded text-primary focus:ring-primary size-5" 
            checked={agreed}
            onChange={() => setAgreed(!agreed)}
          />
          <span className="text-xs text-slate-500 leading-relaxed font-medium">
            I agree to the electronic transfer of ownership and the digital signing of the sales agreement via my biometric ID.
          </span>
        </label>
      </main>

      <footer className="p-4 border-t border-slate-100 bg-white">
        <button 
          disabled={!agreed}
          onClick={() => onNavigate('verification')}
          className={`w-full h-14 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${agreed ? 'bg-primary text-white shadow-primary/20 active:scale-95' : 'bg-slate-100 text-slate-400'}`}
        >
          Secure Buy Now
          <span className="material-symbols-outlined">lock</span>
        </button>
      </footer>
    </div>
  );
};

export default BuyLandScreen;
