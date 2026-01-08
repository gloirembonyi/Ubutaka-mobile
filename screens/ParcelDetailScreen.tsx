
import React from 'react';
import { Screen } from '../types';
import { MOCK_PARCELS } from '../constants';

interface ParcelDetailScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ParcelDetailScreen: React.FC<ParcelDetailScreenProps> = ({ onNavigate }) => {
  const parcel = MOCK_PARCELS[0];

  return (
    <div className="flex-1 flex flex-col bg-background-light overflow-y-auto hide-scrollbar">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center bg-white/95 backdrop-blur-md px-5 py-4 justify-between border-b border-slate-100">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="text-slate-800 flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-slate-900 text-lg font-bold">My Parcel</h2>
        <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 text-slate-800">
          <span className="material-symbols-outlined">share</span>
        </button>
      </header>

      <main className="pb-8">
        {/* Map Section */}
        <div className="px-4 pt-4 pb-2">
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-sm group">
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
              style={{ backgroundImage: `url('${parcel.imageUrl}')` }}
            />
            <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-primary bg-primary/20 rounded-lg shadow-[0_0_15px_rgba(10,127,114,0.5)]"></div>
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm border border-primary/20">
              <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
              <span className="text-primary font-bold text-xs uppercase tracking-wide">Registered & Secure</span>
            </div>
            <button className="absolute bottom-3 right-3 bg-white text-slate-700 p-2 rounded-lg shadow-md">
              <span className="material-symbols-outlined">fullscreen</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="px-4 py-4 space-y-4">
          <div className="w-full p-4 rounded-xl bg-white border border-primary/30 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10">
              <span className="material-symbols-outlined text-6xl text-primary">fingerprint</span>
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">UPI Number</p>
                <span className="material-symbols-outlined text-primary text-[16px]">lock</span>
              </div>
              <p className="text-slate-900 text-2xl font-bold tracking-tight">{parcel.upi}</p>
              <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
                Blockchain Verified
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Size', value: parcel.size },
              { label: 'Use', value: parcel.use },
              { label: 'District', value: parcel.district }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col justify-center p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                <p className="text-slate-500 text-[10px] font-medium uppercase mb-1">{stat.label}</p>
                <p className="text-slate-900 text-sm font-bold truncate">{stat.value}</p>
              </div>
            ))}
          </div>

          <button className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all">
            <span className="material-symbols-outlined">download</span>
            <span>Download Title Deed</span>
          </button>
        </div>

        <div className="h-px w-full bg-slate-100 my-2"></div>

        {/* History */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-900 text-lg font-bold">History</h3>
            <button className="text-primary text-sm font-semibold">View All</button>
          </div>
          <div className="relative pl-2">
            <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-100"></div>
            <div className="flex gap-4 items-start relative z-10 pb-6">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
                <span className="material-symbols-outlined text-[20px]">payments</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-slate-900 text-sm font-bold">Tax Cleared</p>
                <p className="text-slate-500 text-xs">RRA Reference: #99281-X</p>
              </div>
              <span className="text-xs font-medium text-slate-400 mt-1">2d ago</span>
            </div>
            <div className="flex gap-4 items-start relative z-10">
              <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0 border-4 border-white">
                <span className="material-symbols-outlined text-[20px]">handshake</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-slate-900 text-sm font-bold opacity-70">Ownership Transfer</p>
                <p className="text-slate-500 text-xs">From: J. Mutabazi</p>
              </div>
              <span className="text-xs font-medium text-slate-400 mt-1">2021</span>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="py-4">
          <h3 className="px-5 text-slate-900 text-lg font-bold mb-3">Documents</h3>
          <div className="flex overflow-x-auto gap-4 px-5 pb-4 hide-scrollbar">
            <div className="shrink-0 w-40 h-52 rounded-2xl relative overflow-hidden bg-slate-100 shadow-sm border border-slate-50 group cursor-pointer">
               <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform" style={{ backgroundImage: "url('https://picsum.photos/400/600')" }}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
               <div className="absolute bottom-0 p-3 w-full">
                <span className="material-symbols-outlined text-white mb-1">description</span>
                <p className="text-white text-sm font-bold">Land Title</p>
                <p className="text-gray-300 text-[10px]">PDF • 2.4 MB</p>
               </div>
            </div>
            <div className="shrink-0 w-40 h-52 rounded-2xl relative overflow-hidden bg-slate-100 shadow-sm border border-slate-50 group cursor-pointer">
               <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform" style={{ backgroundImage: "url('https://picsum.photos/400/601')" }}></div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
               <div className="absolute bottom-0 p-3 w-full">
                <span className="material-symbols-outlined text-white mb-1">map</span>
                <p className="text-white text-sm font-bold">Site Plan</p>
                <p className="text-gray-300 text-[10px]">PDF • 5.1 MB</p>
               </div>
            </div>
            <div className="shrink-0 w-24 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 text-slate-400">
               <span className="material-symbols-outlined mb-1">add</span>
               <span className="text-[10px] font-bold">Request</span>
            </div>
          </div>
        </div>

        {/* Anomaly Card */}
        <div className="px-5">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex gap-4">
            <div className="bg-amber-100 p-2 h-fit rounded-full text-amber-700">
              <span className="material-symbols-outlined text-[20px]">report_problem</span>
            </div>
            <div>
              <h4 className="text-slate-900 text-sm font-bold mb-1">Information incorrect?</h4>
              <p className="text-slate-600 text-xs leading-relaxed mb-3">Report boundaries or ownership details discrepancies immediately.</p>
              <button 
                onClick={() => onNavigate('report-anomaly')}
                className="text-xs font-bold text-amber-800 border border-amber-300 px-3 py-1.5 rounded-lg bg-white active:bg-amber-50 transition-colors"
              >
                Report Anomaly
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParcelDetailScreen;
