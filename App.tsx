
import React, { useState, useEffect } from 'react';
import { Screen, Language } from './types';
import LandingScreen from './screens/LandingScreen';
import DashboardScreen from './screens/DashboardScreen';
import ParcelDetailScreen from './screens/ParcelDetailScreen';
import TransactionScreen from './screens/TransactionScreen';
import MarketplaceScreen from './screens/MarketplaceScreen';
import SupportScreen from './screens/SupportScreen';
import ProfileScreen from './screens/ProfileScreen';
import OfflineManagerScreen from './screens/OfflineManagerScreen';
import ReportAnomalyScreen from './screens/ReportAnomalyScreen';
import InheritanceScreen from './screens/InheritanceScreen';
import RegisterLandScreen from './screens/RegisterLandScreen';
import SellLandScreen from './screens/SellLandScreen';
import BuyLandScreen from './screens/BuyLandScreen';
import VerificationScreen from './screens/VerificationScreen';
import DisputeListScreen from './screens/DisputeListScreen';
import DisputeDetailScreen from './screens/DisputeDetailScreen';
import MediationRoomScreen from './screens/MediationRoomScreen';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [language, setLanguage] = useState<Language>('RW');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => setLanguage(prev => prev === 'RW' ? 'EN' : 'RW');

  const navigateToDispute = (id: string) => {
    setSelectedDisputeId(id);
    setCurrentScreen('dispute-detail');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing': return <LandingScreen onNavigate={setCurrentScreen} />;
      case 'dashboard': return <DashboardScreen onNavigate={setCurrentScreen} />;
      case 'parcel-details': return <ParcelDetailScreen onNavigate={setCurrentScreen} />;
      case 'transactions': return <TransactionScreen onNavigate={setCurrentScreen} />;
      case 'marketplace': return <MarketplaceScreen onNavigate={setCurrentScreen} />;
      case 'support': return <SupportScreen onNavigate={setCurrentScreen} />;
      case 'profile': return <ProfileScreen onNavigate={setCurrentScreen} theme={theme} toggleTheme={toggleTheme} />;
      case 'offline': return <OfflineManagerScreen onNavigate={setCurrentScreen} />;
      case 'report-anomaly': return <ReportAnomalyScreen onNavigate={setCurrentScreen} />;
      case 'inheritance': return <InheritanceScreen onNavigate={setCurrentScreen} />;
      case 'register-land': return <RegisterLandScreen onNavigate={setCurrentScreen} />;
      case 'sell-land': return <SellLandScreen onNavigate={setCurrentScreen} />;
      case 'buy-land': return <BuyLandScreen onNavigate={setCurrentScreen} />;
      case 'verification': return <VerificationScreen onNavigate={setCurrentScreen} />;
      case 'dispute-list': return <DisputeListScreen onNavigate={setCurrentScreen} onSelectDispute={navigateToDispute} />;
      case 'dispute-detail': return <DisputeDetailScreen onNavigate={setCurrentScreen} disputeId={selectedDisputeId} />;
      case 'mediation-room': return <MediationRoomScreen onNavigate={setCurrentScreen} disputeId={selectedDisputeId} />;
      default: return <LandingScreen onNavigate={setCurrentScreen} />;
    }
  };

  const showNav = currentScreen !== 'landing' && currentScreen !== 'verification' && currentScreen !== 'mediation-room';

  return (
    <div className="flex justify-center bg-slate-100 dark:bg-slate-950 min-h-screen transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-background-dark min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col font-display transition-colors duration-300">
        
        {/* Floating Language Switcher */}
        {showNav && (
          <div className="fixed top-6 right-6 z-[60] flex justify-end pointer-events-none w-full max-w-md">
            <button 
              onClick={toggleLanguage}
              className="pointer-events-auto flex items-center gap-2 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-slate-100 dark:border-slate-800 group active:scale-95 transition-all mr-6"
            >
              <span className={`text-[10px] font-bold transition-colors ${language === 'RW' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>RW</span>
              <div className="h-3 w-[1px] bg-slate-200 dark:bg-slate-700"></div>
              <span className={`text-[10px] font-bold transition-colors ${language === 'EN' ? 'text-primary' : 'text-slate-400 dark:text-slate-500'}`}>EN</span>
              <span className="material-symbols-outlined text-[16px] text-slate-400 group-hover:text-primary">translate</span>
            </button>
          </div>
        )}

        <div className={`flex-1 flex flex-col ${showNav ? 'pb-24' : ''}`}>
          {renderScreen()}
        </div>
        
        {showNav && (
          <BottomNav current={currentScreen} onNavigate={setCurrentScreen} />
        )}
      </div>
    </div>
  );
};

export default App;
