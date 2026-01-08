
import React from 'react';
import { Screen } from '../types';

interface LandingScreenProps {
  onNavigate: (screen: Screen) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  return (
    <div className="relative h-screen flex flex-col overflow-hidden">
      {/* Top Floating Logo & Language */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 pt-8">
        <div className="flex items-center gap-2 bg-surface-light/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm">
          <span className="material-symbols-outlined text-primary">landscape</span>
          <span className="text-sm font-bold tracking-tight">Ubutaka</span>
        </div>
        <button className="flex items-center gap-2 bg-surface-light/80 backdrop-blur-md pl-4 pr-3 py-2 rounded-full shadow-sm">
          <span className="text-sm font-bold text-primary">RW</span>
          <div className="h-4 w-[1px] bg-slate-200"></div>
          <span className="text-sm font-medium text-slate-500">EN</span>
          <span className="material-symbols-outlined text-[18px] text-slate-400">expand_more</span>
        </button>
      </div>

      {/* Hero Image */}
      <div className="relative w-full h-[55vh] shrink-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDYF4pTZHPbJY-j7K1SLqbu45KRndjCyS6AKYHu9IHKxskoPebsagTx0v_Pok13PZRKU_WEbhwpAQgglvK1MDY2uJPeNtmkKY_dZn38ysaHjIFUdOgO-liBV_YaDzbyQ1u8A148UCrPkt7HbWa1ilEvgVdPlmYCZVjEPPnpWwPS3C43pg88vXVTzq7bRkrIqrOwyvg8V1nf8pYlRKSNMNoyB9sC6TkJw-A5xdUhWNhpYJ1aWjCJC6QvOIOBMK5sW2hz1reD1NW3Fwtf')" }}></div>
        <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
      </div>

      {/* Bottom Sheet */}
      <div className="relative flex-1 flex flex-col bg-background-light -mt-10 rounded-t-[2.5rem] z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] overflow-y-auto">
        <div className="w-full flex justify-center pt-4 pb-2">
          <div className="w-12 h-1.5 rounded-full bg-slate-200"></div>
        </div>
        <div className="flex-1 flex flex-col px-8 pb-8 pt-2">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-extrabold text-slate-900 leading-[1.15] mb-3">
              Secure Land,<br /><span className="text-primary">Peaceful Future</span>
            </h1>
            <p className="text-slate-500 text-base font-body leading-relaxed max-w-xs mx-auto">
              Rwanda's secure, paperless platform for land management and citizen services.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {[
              { icon: 'verified_user', title: 'Verify Ownership', sub: 'Instant title checks & verification' },
              { icon: 'swap_horiz', title: 'Transfer Securely', sub: 'Paperless sales and inheritance' },
              { icon: 'gavel', title: 'Resolve Disputes', sub: 'Transparent community resolution' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-[20px]">{item.icon}</span>
                </div>
                <div>
                  <h3 className="text-slate-900 font-bold text-sm">{item.title}</h3>
                  <p className="text-slate-500 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <button 
              onClick={() => onNavigate('dashboard')}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold text-lg py-4 rounded-xl shadow-[0_4px_14px_0_rgba(10,127,114,0.39)] transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Get Started
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <button className="w-full bg-transparent hover:bg-slate-50 text-slate-600 font-semibold text-base py-3 rounded-xl transition-colors">
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
