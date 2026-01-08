
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';

interface VerificationScreenProps {
  onNavigate: (screen: Screen) => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ onNavigate }) => {
  const [status, setStatus] = useState<'scanning' | 'success' | 'failed'>('scanning');

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('success');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white">
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {status === 'scanning' && (
          <div className="space-y-8 animate-pulse">
            <div className="relative size-48">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-primary/5 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-6xl text-primary">face</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">NIDA Verification</h1>
              <p className="text-slate-500 mt-2">Connecting to Rwanda Identification Agency... Please stay still.</p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            <div className="size-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Identity Verified</h1>
              <p className="text-slate-500 mt-2">Biometric authentication successful. Transaction authorized on blockchain.</p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-full bg-slate-200" />
                <div>
                  <p className="text-sm font-bold">Jean-Claude M.</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">NID: 1 1990 8 00***</p>
                </div>
              </div>
              <div className="h-px bg-slate-200 mb-3" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Hash Status</span>
                <span className="text-[10px] font-mono text-primary font-bold">0x71c...a492</span>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('dashboard')}
              className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all mt-4"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default VerificationScreen;
