
import React, { useState } from 'react';
import { Screen } from '../types';

interface OfflineManagerScreenProps {
  onNavigate: (screen: Screen) => void;
}

const OfflineManagerScreen: React.FC<OfflineManagerScreenProps> = ({ onNavigate }) => {
  const [parcelsOff, setParcelsOff] = useState(true);
  const [txOff, setTxOff] = useState(true);
  const [disputeOff, setDisputeOff] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-background-light overflow-hidden">
      <header className="flex items-center p-5 pt-8 bg-white border-b border-slate-100">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10">Offline Manager</h2>
      </header>

      <main className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {/* Sync Status */}
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="size-2.5 rounded-full bg-primary animate-pulse"></div>
                <span className="text-primary font-bold text-xs uppercase tracking-widest">Online</span>
              </div>
              <h3 className="text-2xl font-bold">Data Synchronized</h3>
            </div>
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl">cloud_done</span>
            </div>
          </div>
          <div className="space-y-1 mb-4">
            <p className="text-sm text-slate-500 font-medium">Last synced: <span className="text-slate-900 font-bold">Today, 10:42 AM</span></p>
            <p className="text-xs text-slate-400">Next auto-sync: 11:42 AM</p>
          </div>
          <div className="w-full h-32 rounded-2xl overflow-hidden bg-slate-200">
            <img src="https://picsum.photos/400/200" className="w-full h-full object-cover grayscale opacity-60" alt="" />
          </div>
        </div>

        <button className="w-full h-14 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">sync</span>
          Sync Data Now
        </button>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Offline Features</h3>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded">45MB USED</span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'parcels', label: 'My Land Parcels', sub: 'View deed plans offline.', state: parcelsOff, set: setParcelsOff, tag: 'Ready' },
              { id: 'tx', label: 'Draft Transactions', sub: 'Continue agreements offline.', state: txOff, set: setTxOff, tag: '2 Saved', tagColor: 'amber' },
              { id: 'dispute', label: 'Dispute Resolution', sub: 'Access community forms.', state: disputeOff, set: setDisputeOff, tag: 'Not Downloaded', tagColor: 'slate' }
            ].map((item) => (
              <div key={item.id} className="p-4 bg-white rounded-2xl border border-slate-50 shadow-sm flex items-start gap-4">
                <div 
                  onClick={() => item.set(!item.state)}
                  className={`shrink-0 w-11 h-6 rounded-full relative transition-colors cursor-pointer ${item.state ? 'bg-primary' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${item.state ? 'right-1' : 'left-1'}`}></div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm">{item.label}</h4>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase bg-${item.tagColor || 'primary'}/10 text-${item.tagColor || 'primary'}`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-2">
            <span>DEVICE STORAGE</span>
            <span>45MB / 2GB ALLOCATED</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full w-[15%]"></div>
          </div>
          <button className="w-full mt-6 text-red-500 text-xs font-bold hover:underline">Clear Offline Cache</button>
        </div>
      </main>
    </div>
  );
};

export default OfflineManagerScreen;
