
import React from 'react';
import { Screen } from '../types';
import { MOCK_DISPUTES } from '../constants';

interface DisputeListScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectDispute: (id: string) => void;
}

const DisputeListScreen: React.FC<DisputeListScreenProps> = ({ onNavigate, onSelectDispute }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Investigation': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Mediation': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Resolved': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-sm p-4 border-b border-slate-100 dark:border-slate-800 flex items-center">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <span className="material-symbols-outlined dark:text-white">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10 dark:text-white">Community Disputes</h2>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-24 hide-scrollbar">
        <div className="mb-6">
          <h1 className="text-2xl font-bold dark:text-white tracking-tight">Active Cases</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Community-led mediation for land disputes. Transparent and immutable.
          </p>
        </div>

        <div className="space-y-4">
          {MOCK_DISPUTES.map((dispute) => (
            <button 
              key={dispute.id}
              onClick={() => onSelectDispute(dispute.id)}
              className="w-full text-left bg-white dark:bg-surface-dark p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-100 dark:border-slate-700 dark:text-slate-400">
                  Case {dispute.id}
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(dispute.status)}`}>
                  {dispute.status}
                </span>
              </div>
              
              <h3 className="text-lg font-bold dark:text-white mb-1">{dispute.type} Dispute</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{dispute.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-sm">location_on</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{dispute.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-primary uppercase">Details</span>
                  <span className="material-symbols-outlined text-primary text-sm">chevron_right</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10">
          <div className="flex gap-4 items-center mb-3">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">how_to_reg</span>
            </div>
            <h3 className="font-bold dark:text-white">Community Mediators</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Cases are reviewed by verified village elders and land officers. Resolution decisions are recorded on the Ubutaka blockchain.
          </p>
        </div>
      </main>
    </div>
  );
};

export default DisputeListScreen;
