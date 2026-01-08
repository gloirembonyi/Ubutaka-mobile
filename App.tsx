
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, useColorScheme, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const systemColorScheme = useColorScheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [language, setLanguage] = useState<Language>('RW');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Default to system preference, will be updated from AsyncStorage
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    // Load theme from AsyncStorage
    AsyncStorage.getItem('theme').then((saved: string | null) => {
      if (saved === 'light' || saved === 'dark') {
        setTheme(saved);
      } else {
        setTheme(systemColorScheme === 'dark' ? 'dark' : 'light');
      }
    });
  }, []);

  useEffect(() => {
    // Save theme to AsyncStorage
    AsyncStorage.setItem('theme', theme);
  }, [theme]);

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

  const backgroundColor = theme === 'dark' ? '#020617' : '#f1f5f9';
  const containerBg = theme === 'dark' ? '#0a0f1a' : '#ffffff';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top', 'left', 'right']}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={backgroundColor}
        translucent={false}
      />
      <View style={[styles.appContainer, { backgroundColor: containerBg }]}>
        
        {/* Floating Language Switcher */}
        {showNav && (
          <SafeAreaView style={styles.languageSwitcher} edges={['top']}>
            <Pressable 
              onPress={toggleLanguage}
              style={({ pressed }) => [
                styles.languageButton,
                { opacity: pressed ? 0.7 : 1 }
              ]}
            >
              <Text style={[styles.languageText, language === 'RW' && styles.languageTextActive, { marginRight: 8 }]}>RW</Text>
              <View style={styles.languageDivider} />
              <Text style={[styles.languageText, language === 'EN' && styles.languageTextActive, { marginLeft: 8, marginRight: 8 }]}>EN</Text>
              <Text style={styles.translateIcon}>🌐</Text>
            </Pressable>
          </SafeAreaView>
        )}

        <View style={[styles.screenContainer, showNav && styles.screenContainerWithNav]}>
          {renderScreen()}
        </View>
        
        {showNav && (
          <BottomNav current={currentScreen} onNavigate={setCurrentScreen} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appContainer: {
    width: '100%',
    maxWidth: 400,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  languageSwitcher: {
    position: 'absolute',
    top: 0,
    right: 24,
    zIndex: 60,
    alignItems: 'flex-end',
    paddingTop: 8,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  languageText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
  },
  languageTextActive: {
    color: '#3b82f6',
  },
  languageDivider: {
    width: 1,
    height: 12,
    backgroundColor: '#e2e8f0',
  },
  translateIcon: {
    fontSize: 16,
  },
  screenContainer: {
    flex: 1,
  },
  screenContainerWithNav: {
    paddingBottom: 96,
  },
});

export default App;
