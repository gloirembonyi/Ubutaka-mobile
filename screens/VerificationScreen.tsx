
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
    }, 4500); // Slightly longer for better "scanning" feel
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-background-dark transition-colors duration-500">
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        {status === 'scanning' && (
          <div className="w-full flex flex-col items-center">
            {/* Advanced Scanning Graphic */}
            <div className="relative size-64 mb-12 flex items-center justify-center">
              {/* Outer Glow/Ring */}
              <div className="absolute inset-0 rounded-full border border-primary/5 animate-[ping_3s_ease-in-out_infinite]"></div>
              
              {/* Concentric Rings */}
              <div className="absolute inset-2 rounded-full border-[1.5px] border-primary/10"></div>
              <div className="absolute inset-6 rounded-full border-[1px] border-primary/20"></div>
              
              {/* Main Visual Circle */}
              <div className="absolute inset-10 rounded-full bg-primary/[0.03] dark:bg-primary/[0.05] border-[2px] border-primary/30 flex items-center justify-center overflow-hidden shadow-[0_0_40px_rgba(10,127,114,0.05)]">
                {/* Scanning Bar Animation */}
                <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent top-0 animate-[scan_2.5s_ease-in-out_infinite]"></div>
                
                {/* Face Icon */}
                <span className="material-symbols-outlined text-[80px] text-primary/80 material-symbols-filled">
                  face
                </span>
              </div>

              {/* Rotating Accents */}
              <div className="absolute inset-8 rounded-full border-t-2 border-primary/40 animate-[spin_4s_linear_infinite]"></div>
              <div className="absolute inset-4 rounded-full border-b-2 border-primary/20 animate-[spin_6s_linear_infinite_reverse]"></div>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                NIDA Verification
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-3 text-sm leading-relaxed max-w-[240px] mx-auto font-medium">
                Connecting to Rwanda Identification Agency... Please stay still.
              </p>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-8 animate-in zoom-in-95 fade-in duration-500">
            <div className="relative size-32 mx-auto">
              <div className="absolute inset-0 bg-green-500/10 rounded-full animate-ping"></div>
              <div className="relative size-32 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30">
                <span className="material-symbols-outlined text-6xl">check_circle</span>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Identity Verified</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Biometric authentication successful.</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-surface-dark p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 text-left shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="size-12 rounded-2xl bg-slate-200 dark:bg-slate-700 bg-cover bg-center" style={{ backgroundImage: "url('https://picsum.photos/100/100')" }} />
                <div>
                  <p className="text-sm font-bold dark:text-white">Jean-Claude M.</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Citizen ID Verified</p>
                </div>
              </div>
              <div className="h-px bg-slate-200 dark:bg-slate-800 mb-4" />
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Blockchain Ref</span>
                  <span className="text-[10px] font-mono text-primary font-bold">0x71c...a492</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">NIDA Token</span>
                  <span className="text-[10px] font-mono text-slate-500 font-bold">AUTH_7729_VALID</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onNavigate('dashboard')}
              className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all mt-4"
            >
              Confirm & Continue
            </button>
          </div>
        )}
      </main>

      {/* Global CSS for the scanning animation */}
      <style>{`
        @keyframes scan {
          0% { top: -10%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default VerificationScreen;
