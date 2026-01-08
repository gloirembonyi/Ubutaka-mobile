
import React, { useState } from 'react';
import { Screen } from '../types';
import { MOCK_DISPUTES } from '../constants';

interface DisputeDetailScreenProps {
  onNavigate: (screen: Screen) => void;
  disputeId: string | null;
}

const DisputeDetailScreen: React.FC<DisputeDetailScreenProps> = ({ onNavigate, disputeId }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'evidence' | 'timeline'>('details');
  const dispute = MOCK_DISPUTES.find(d => d.id === disputeId) || MOCK_DISPUTES[0];

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm p-4 border-b border-slate-100 dark:border-slate-800 flex items-center">
        <button 
          onClick={() => onNavigate('dispute-list')}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span className="material-symbols-outlined dark:text-white">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10 dark:text-white">Case Details</h2>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 hide-scrollbar">
        {/* Case Summary */}
        <div className="p-6 bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
              {dispute.status}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Opened {dispute.dateOpened}
            </span>
          </div>
          <h1 className="text-2xl font-bold dark:text-white mb-2">{dispute.type} Dispute</h1>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span className="material-symbols-outlined text-sm">grid_3x3</span>
            <p className="text-xs font-mono font-bold">{dispute.upi}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          {['details', 'evidence', 'timeline'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-4 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-slate-400'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          {activeTab === 'details' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <section className="space-y-2">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</h3>
                <p className="text-sm dark:text-slate-300 leading-relaxed">{dispute.description}</p>
              </section>

              <section className="space-y-3">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Involved Parties</h3>
                <div className="space-y-2">
                  {dispute.parties.map((party, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-surface-dark rounded-xl border border-slate-50 dark:border-slate-800">
                      <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-400 text-sm">person</span>
                      </div>
                      <span className="text-sm font-bold dark:text-white">{party}</span>
                    </div>
                  ))}
                </div>
              </section>

              <div className="p-5 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                <div className="flex gap-3 items-center mb-2">
                  <span className="material-symbols-outlined text-blue-600">info</span>
                  <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300">Community Mediation</h4>
                </div>
                <p className="text-[10px] text-blue-800 dark:text-blue-400 leading-relaxed">
                  A mediation meeting is scheduled at the Local Cell Office for next Tuesday. Please ensure all physical title deeds are present.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
              <div className="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 gap-2 cursor-pointer hover:border-primary transition-all">
                <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">Add Evidence</span>
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden shadow-sm relative group">
                <img src="https://picsum.photos/300/300" className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">visibility</span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-white/90 dark:bg-surface-dark/90 p-2 rounded-lg">
                  <p className="text-[8px] font-bold text-slate-900 dark:text-white truncate">Survey_Map_2023.jpg</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="space-y-6 animate-in fade-in duration-300 relative pl-4">
              <div className="absolute left-[19px] top-4 bottom-4 w-px bg-slate-100 dark:bg-slate-800"></div>
              {[
                { title: 'Case Resolved', date: 'Sept 15', desc: 'Ownership updated on blockchain.', status: 'done', color: 'primary' },
                { title: 'Village Elder Hearing', date: 'Sept 10', desc: 'Mediation session held in Kacyiru.', status: 'done', color: 'primary' },
                { title: 'Evidence Required', date: 'Sept 06', desc: 'Neighbor X requested to upload survey.', status: 'pending', color: 'amber' },
                { title: 'Case Opened', date: 'Sept 05', desc: 'Anomaly reported via Ubutaka App.', status: 'done', color: 'primary' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start relative z-10">
                  <div className={`size-3 rounded-full mt-1.5 ring-4 ring-background-light dark:ring-background-dark bg-${item.color}`}></div>
                  <div>
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="text-sm font-bold dark:text-white">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 font-bold">{item.date}</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-40">
        {dispute.status === 'Mediation' ? (
          <button 
            onClick={() => onNavigate('mediation-room')}
            className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Enter Mediation Room
            <span className="material-symbols-outlined">forum</span>
          </button>
        ) : (
          <button className="w-full h-14 bg-slate-900 dark:bg-primary text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2">
            Request Mediator Call
            <span className="material-symbols-outlined">support_agent</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default DisputeDetailScreen;
