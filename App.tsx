
import React, { useState } from 'react';
import { Screen } from './types';
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
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedParcelUpi, setSelectedParcelUpi] = useState<string | null>(null);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing': return <LandingScreen onNavigate={setCurrentScreen} />;
      case 'dashboard': return <DashboardScreen onNavigate={setCurrentScreen} />;
      case 'parcel-details': return <ParcelDetailScreen onNavigate={setCurrentScreen} />;
      case 'transactions': return <TransactionScreen onNavigate={setCurrentScreen} />;
      case 'marketplace': return <MarketplaceScreen onNavigate={setCurrentScreen} />;
      case 'support': return <SupportScreen onNavigate={setCurrentScreen} />;
      case 'profile': return <ProfileScreen onNavigate={setCurrentScreen} />;
      case 'offline': return <OfflineManagerScreen onNavigate={setCurrentScreen} />;
      case 'report-anomaly': return <ReportAnomalyScreen onNavigate={setCurrentScreen} />;
      case 'inheritance': return <InheritanceScreen onNavigate={setCurrentScreen} />;
      case 'register-land': return <RegisterLandScreen onNavigate={setCurrentScreen} />;
      case 'sell-land': return <SellLandScreen onNavigate={setCurrentScreen} />;
      case 'buy-land': return <BuyLandScreen onNavigate={setCurrentScreen} />;
      case 'verification': return <VerificationScreen onNavigate={setCurrentScreen} />;
      default: return <LandingScreen onNavigate={setCurrentScreen} />;
    }
  };

  const showNav = currentScreen !== 'landing' && currentScreen !== 'verification';

  return (
    <div className="flex justify-center bg-slate-100 min-h-screen">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col font-display">
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
