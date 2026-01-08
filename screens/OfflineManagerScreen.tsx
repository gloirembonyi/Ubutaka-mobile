
import React, { useState, useEffect } from 'react';
import { Screen } from '../types';

interface OfflineManagerScreenProps {
  onNavigate: (screen: Screen) => void;
}

const OfflineManagerScreen: React.FC<OfflineManagerScreenProps> = ({ onNavigate }) => {
  const [parcelsOff, setParcelsOff] = useState(true);
  const [txOff, setTxOff] = useState(true);
  const [disputeOff, setDisputeOff] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDisputeToggle = () => {
    if (!disputeOff) {
      setIsDownloading(true);
      // Simulate download progress
      setTimeout(() => {
        setIsDownloading(false);
        setDisputeOff(true);
      }, 2000);
    } else {
      setDisputeOff(false);
    }
  };

  const features = [
    { 
      id: 'parcels', 
      label: 'My Land Parcels', 
      sub: 'View deed plans offline.', 
      state: parcelsOff, 
      set: () => setParcelsOff(!parcelsOff), 
      tag: parcelsOff ? 'Ready' : 'Not Saved', 
      tagColor: parcelsOff ? 'primary' : 'slate' 
    },
    { 
      id: 'tx', 
      label: 'Draft Transactions', 
      sub: 'Continue agreements offline.', 
      state: txOff, 
      set: () => setTxOff(!txOff), 
      tag: txOff ? '2 Saved' : 'Not Saved', 
      tagColor: txOff ? 'amber' : 'slate' 
    },
    { 
      id: 'dispute', 
      label: 'Dispute Resolution', 
      sub: 'Access case details & mediation forms.', 
      state: disputeOff, 
      set: handleDisputeToggle, 
      tag: isDownloading ? 'Downloading...' : (disputeOff ? 'Ready' : 'Not Downloaded'), 
      tagColor: isDownloading ? 'blue' : (disputeOff ? 'primary' : 'slate') 
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-background-light dark:bg-background-dark overflow-hidden transition-colors">
      <header className="flex items-center p-5 pt-8 bg-white dark:bg-surface-dark border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="material-symbols-outlined dark:text-white">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10 dark:text-white">Offline Manager</h2>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-6 space-y-6 hide-scrollbar">
        {/* Sync Status */}
        <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="size-2.5 rounded-full bg-primary animate-pulse"></div>
                <span className="text-primary font-bold text-xs uppercase tracking-widest">System Online</span>
              </div>
              <h3 className="text-2xl font-bold dark:text-white">Data Synchronized</h3>
            </div>
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">cloud_done</span>
            </div>
          </div>
          <div className="space-y-1 mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Last synced: <span className="text-slate-900 dark:text-slate-200 font-bold">Today, 10:42 AM</span></p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Blockchain state verified at Block #882,901</p>
          </div>
          <div className="w-full h-32 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 relative">
            <img src="https://picsum.photos/400/200" className="w-full h-full object-cover grayscale opacity-40 dark:opacity-20" alt="" />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="material-symbols-outlined text-4xl text-white/50">map</span>
            </div>
          </div>
        </div>

        <button className="w-full h-14 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">sync</span>
          Manual Sync
        </button>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold dark:text-white">Offline Features</h3>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">
              {disputeOff ? '62MB USED' : '45MB USED'}
            </span>
          </div>

          <div className="space-y-3">
            {features.map((item) => (
              <div key={item.id} className="p-4 bg-white dark:bg-surface-dark rounded-2xl border border-slate-50 dark:border-slate-800 shadow-sm flex items-start gap-4 transition-colors">
                <div 
                  onClick={item.set}
                  className={`shrink-0 w-11 h-6 rounded-full relative transition-colors cursor-pointer ${item.state ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                  <div className={`absolute top-1 size-4 bg-white rounded-full shadow-sm transition-all ${item.state ? 'right-1' : 'left-1'}`}></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm dark:text-slate-200">{item.label}</h4>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-tighter ${
                      item.tagColor === 'primary' ? 'bg-primary/10 text-primary' :
                      item.tagColor === 'amber' ? 'bg-amber-100 text-amber-700' :
                      item.tagColor === 'blue' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.sub}</p>
                  
                  {item.id === 'dispute' && !item.state && !isDownloading && (
                    <button 
                      onClick={handleDisputeToggle}
                      className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase"
                    >
                      <span className="material-symbols-outlined text-sm">download_for_offline</span>
                      Download Dispute Case Details
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2">
            <span>DEVICE STORAGE ALLOCATION</span>
            <span>{disputeOff ? '3%' : '2%'} OF 2GB</span>
          </div>
          <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full bg-primary rounded-full transition-all duration-1000 ${disputeOff ? 'w-[3%]' : 'w-[2%]'}`}></div>
          </div>
          <button className="w-full mt-6 text-red-500 text-xs font-bold hover:underline active:scale-95 transition-transform">Clear Offline Cache</button>
        </div>
      </main>
    </div>
  );
};

export default OfflineManagerScreen;
