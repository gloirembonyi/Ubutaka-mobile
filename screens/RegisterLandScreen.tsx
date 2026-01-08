
import React, { useState } from 'react';
import { Screen } from '../types';

interface RegisterLandScreenProps {
  onNavigate: (screen: Screen) => void;
}

const RegisterLandScreen: React.FC<RegisterLandScreenProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <header className="sticky top-0 z-30 bg-white p-4 border-b border-slate-100 flex items-center">
        <button onClick={() => onNavigate('dashboard')} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-50">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10">Register New Land</h2>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-slate-100'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Locate your parcel</h1>
              <p className="text-slate-500 text-sm mt-1">Provide the UPI or use your current GPS location.</p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white focus-within:border-primary transition-colors">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">UPI Number</label>
                <input type="text" className="w-full border-none p-0 text-lg font-bold focus:ring-0 placeholder:text-slate-200" placeholder="5/03/12/04/..." />
              </div>

              <div className="relative py-4 flex items-center gap-4">
                <div className="flex-1 h-px bg-slate-100"></div>
                <span className="text-[10px] font-bold text-slate-300 uppercase">Or use GPS</span>
                <div className="flex-1 h-px bg-slate-100"></div>
              </div>

              <button className="w-full h-16 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
                <span className="material-symbols-outlined">my_location</span>
                Detect My Location
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Upload Documents</h1>
              <p className="text-slate-500 text-sm mt-1">We need proof of acquisition or inheritance.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-primary/50 hover:text-primary transition-all cursor-pointer">
                <span className="material-symbols-outlined text-4xl mb-2">add_a_photo</span>
                <p className="text-sm font-bold">Sales Agreement / Contract</p>
                <p className="text-[10px] mt-1 uppercase">PDF or JPG (Max 10MB)</p>
              </div>
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 opacity-60">
                <span className="material-symbols-outlined text-4xl mb-2">history_edu</span>
                <p className="text-sm font-bold">Neighborhood Witness Signatures</p>
                <p className="text-[10px] mt-1 uppercase">Required for first-time reg</p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300 text-center py-8">
            <div className="size-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
              <span className="material-symbols-outlined text-5xl">fact_check</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Ready to Submit</h1>
            <p className="text-slate-500 text-sm">Your application will be verified by the District Land Officer and recorded on the blockchain.</p>
            
            <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400">Processing Fee</span>
                <span className="text-sm font-bold">RWF 5,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">Est. Time</span>
                <span className="text-sm font-bold text-primary">3-5 Working Days</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="p-4 border-t border-slate-100 bg-white">
        {step < 3 ? (
          <button 
            onClick={() => setStep(step + 1)}
            className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            Continue
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        ) : (
          <button 
            onClick={() => onNavigate('dashboard')}
            className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            Pay & Submit Application
          </button>
        )}
      </footer>
    </div>
  );
};

export default RegisterLandScreen;
