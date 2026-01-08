
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

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

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
      default: return <LandingScreen onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="flex justify-center bg-slate-100 min-h-screen">
      <div className="w-full max-w-md bg-background-light min-h-screen relative shadow-2xl overflow-x-hidden flex flex-col font-display">
        {renderScreen()}
      </div>
    </div>
  );
};

export default App;
