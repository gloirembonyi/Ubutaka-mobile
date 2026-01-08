
import React from 'react';
import { Screen } from '../types';

interface ReportAnomalyScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ReportAnomalyScreen: React.FC<ReportAnomalyScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col bg-background-light">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm p-4 border-b border-slate-100 flex items-center">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="size-10 flex items-center justify-center rounded-full hover:bg-slate-50"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-bold flex-1 text-center pr-10">Report Anomaly</h2>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-32 hide-scrollbar">
        {/* Progress */}
        <div className="flex justify-center gap-3 mb-8">
          <div className="h-2 w-8 rounded-full bg-primary"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200"></div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Something looks wrong?</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Verify land data or report suspicious activity to protect your rights. Your report helps maintain registry integrity.
          </p>
        </div>

        <section className="space-y-6">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">1</div>
              <h3 className="font-bold">Affected Land</h3>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Parcel Identifier (UPI)</label>
              <div className="relative">
                <input className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm font-medium focus:ring-primary" placeholder="e.g. 1/02/03/04/123" />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">grid_3x3</span>
              </div>
            </div>
            <div className="relative flex items-center justify-center py-2">
              <div className="w-full h-px bg-slate-100"></div>
              <span className="absolute bg-white px-2 text-[10px] font-bold text-slate-400">OR</span>
            </div>
            <button className="w-full h-12 rounded-xl bg-primary/5 text-primary font-bold text-sm flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">my_location</span>
              Use Current Location
            </button>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">2</div>
              <h3 className="font-bold">Issue Details</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Anomaly Type</label>
                <select className="w-full h-12 rounded-xl border border-slate-200 px-4 text-sm font-medium focus:ring-primary appearance-none bg-no-repeat bg-[right_1rem_center]" style={{ backgroundImage: "url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23cbd5e1%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')" }}>
                  <option>Select the type of error</option>
                  <option>Incorrect Owner Name</option>
                  <option>Boundary Dispute</option>
                  <option>Fraudulent Transaction</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea className="w-full rounded-xl border border-slate-200 p-4 text-sm font-medium focus:ring-primary min-h-[120px] resize-none" placeholder="Describe the discrepancy in detail..." />
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 items-start">
            <span className="material-symbols-outlined text-amber-500 text-lg">info</span>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-amber-900">Legal Notice</h4>
              <p className="text-[10px] text-amber-800 leading-relaxed">Providing false information to the land registry is punishable by law under Article 24 of the Land Law. Please ensure accuracy.</p>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100">
        <button className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
          Submit Report
          <span className="material-symbols-outlined">send</span>
        </button>
      </div>
    </div>
  );
};

export default ReportAnomalyScreen;
