
import React from 'react';
import { Screen } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import BottomNav from '../components/BottomNav';

interface TransactionScreenProps {
  onNavigate: (screen: Screen) => void;
}

const TransactionScreen: React.FC<TransactionScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex-1 flex flex-col pb-24 bg-background-light">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md px-5 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <button className="size-10 flex items-center justify-center rounded-full hover:bg-slate-100">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h2 className="text-lg font-bold">Land Services</h2>
          <button className="size-10 flex items-center justify-center relative">
            <span className="material-symbols-outlined text-primary">notifications</span>
            <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-3xl font-extrabold tracking-tight">Manage Your Land</h1>
          <p className="text-slate-500 text-sm mt-2">Secure, paperless transactions powered by smart contracts.</p>
        </div>

        {/* Action Panel */}
        <div className="p-4">
          <div className="bg-white rounded-2xl p-5 border border-primary/10 shadow-soft relative overflow-hidden flex flex-col gap-4 group cursor-pointer active:scale-[0.99] transition-all">
            <div className="flex items-start justify-between z-10">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <h3 className="font-bold">Link Digital ID</h3>
                </div>
                <p className="text-slate-500 text-xs leading-relaxed">Ensure your Irembo ID is linked for faster processing.</p>
              </div>
              <button className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm">Link Now</button>
            </div>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 size-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-all"></div>
          </div>
        </div>

        {/* In Progress */}
        <section className="mb-6">
          <div className="flex items-center justify-between px-6 mb-4">
            <h3 className="text-lg font-bold">In Progress</h3>
            <button className="text-primary text-xs font-bold">View All</button>
          </div>
          <div className="flex overflow-x-auto px-6 pb-2 gap-4 hide-scrollbar">
            {MOCK_TRANSACTIONS.map((tx) => (
              <div key={tx.id} className="shrink-0 w-[85%] bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 items-center">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">{tx.title === 'Voluntary Sale' ? 'handshake' : 'account_balance'}</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{tx.title}</p>
                      <p className="text-sm font-bold">Plot UPI {tx.upi}</p>
                    </div>
                  </div>
                  {tx.status === 'action_required' && (
                    <span className="bg-yellow-100 text-yellow-700 text-[8px] font-bold px-2 py-1 rounded-full uppercase">Action Required</span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${tx.progress}%` }}></div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Current Step</p>
                    <p className="text-xs font-bold text-slate-700 mt-0.5">{tx.step}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Transactions Grid */}
        <section className="px-6 mb-8">
          <h3 className="text-lg font-bold mb-4">New Transaction</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: 'payments', title: 'Voluntary Sale', sub: 'Securely sell land', screen: 'transactions' },
              { icon: 'family_history', title: 'Inheritance', sub: 'Transfer to heirs', screen: 'inheritance' },
              { icon: 'account_balance', title: 'Mortgage', sub: 'Register collateral', screen: 'transactions' },
              { icon: 'gavel', title: 'Lease', sub: 'Rental agreement', screen: 'transactions' }
            ].map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => onNavigate(item.screen as Screen)}
                className="flex flex-col items-start gap-3 p-4 rounded-xl bg-white border border-slate-50 shadow-sm active:scale-95 transition-all text-left"
              >
                <div className="size-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm">{item.title}</h4>
                  <p className="text-[10px] text-slate-500">{item.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      <BottomNav current="transactions" onNavigate={onNavigate} />
    </div>
  );
};

export default TransactionScreen;
