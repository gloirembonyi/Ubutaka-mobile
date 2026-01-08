
import React from 'react';
import { Screen } from '../types';

interface InheritanceScreenProps {
  onNavigate: (screen: Screen) => void;
}

const InheritanceScreen: React.FC<InheritanceScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col bg-background-light">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md p-4 border-b border-slate-100 flex items-center justify-between">
        <button onClick={() => onNavigate('transactions')} className="size-10 flex items-center justify-center rounded-full hover:bg-slate-50">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold">Inheritance Transfer</h2>
        <button className="size-10 flex items-center justify-center">
          <span className="material-symbols-outlined">help</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-32 hide-scrollbar">
        <div className="bg-gradient-to-br from-[#18375d] to-[#2a4e7a] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <span className="material-symbols-outlined text-5xl">shield_lock</span>
          </div>
          <span className="inline-flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full text-[8px] font-bold uppercase mb-4 backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
            Not Started
          </span>
          <h1 className="text-2xl font-bold mb-2">Secure Transfer</h1>
          <p className="text-blue-100 text-xs leading-relaxed">Initiate a transparent, immutable land title transfer to heirs using approved smart contracts.</p>
        </div>

        <section className="space-y-6">
          <h3 className="font-bold text-lg">Process Overview</h3>
          <div className="relative pl-6 space-y-8">
            <div className="absolute left-[7px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
            {[
              { icon: 'fingerprint', title: 'Identity Verification', sub: 'Authenticate via NIDA system to prove kinship.' },
              { icon: 'upload_file', title: 'Document Upload', sub: 'Submit death certificate and council minutes.' },
              { icon: 'gavel', title: 'Smart Contract execution', sub: 'Automated validation of rules and dispute check.' }
            ].map((step, i) => (
              <div key={i} className="flex gap-4 items-start relative z-10">
                <div className={`size-4 rounded-full flex items-center justify-center ring-4 ring-white ${i === 0 ? 'bg-primary' : 'bg-slate-100'}`}></div>
                <div>
                  <h4 className={`text-sm font-bold ${i === 0 ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{step.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h3 className="font-bold text-lg mb-4">Required Documents</h3>
          <div className="space-y-3">
            {[
              { icon: 'badge', title: 'Applicant National ID', status: 'Ready to fetch' },
              { icon: 'description', title: 'Death Certificate', status: 'Upload Required' },
              { icon: 'groups', title: 'Family Council Minutes', status: 'Upload PDF' }
            ].map((doc, i) => (
              <div key={i} className="p-4 border-2 border-dashed border-slate-200 rounded-2xl flex items-center gap-4 active:bg-slate-50 transition-colors cursor-pointer">
                <div className="size-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined">{doc.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{doc.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.status}</p>
                </div>
                <div className="size-5 rounded-full border-2 border-slate-200"></div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 flex flex-col gap-3">
        <div className="flex justify-center items-center gap-2 text-green-600 font-bold text-[10px] uppercase">
          <span className="material-symbols-outlined text-sm">lock</span>
          Secured by National Land Blockchain
        </div>
        <button className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all">Start Transfer Process</button>
      </div>
    </div>
  );
};

export default InheritanceScreen;
