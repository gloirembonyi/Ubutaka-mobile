
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, useColorScheme, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen, Language, User } from './types';
import { Colors } from './styles/colors';
import { API_ENDPOINTS } from './config/api';
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
import SettingsScreen from './screens/SettingsScreen';
import TaxPaymentScreen from './screens/TaxPaymentScreen';
import CertificateScreen from './screens/CertificateScreen';
import QRScannerScreen from './screens/QRScannerScreen';
import LandMapScreen from './screens/LandMapScreen';
import BottomNav from './components/BottomNav';

import AuthScreen from './screens/AuthScreen';

const App: React.FC = () => {
  const systemColorScheme = useColorScheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [language, setLanguage] = useState<Language>('RW');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Default to system preference, will be updated from AsyncStorage
    return systemColorScheme === 'dark' ? 'dark' : 'light';
  });

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load theme and session from AsyncStorage
    const initialize = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        } else {
          setTheme(systemColorScheme === 'dark' ? 'dark' : 'light');
        }

        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          setCurrentScreen('dashboard');
        }
      } catch (err) {
        console.error('Failed to initialize app:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();

    // Fetch initial data from API
    fetchUsers();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    AsyncStorage.setItem('user', JSON.stringify(userData));
    setCurrentScreen('dashboard');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('user');
    setUser(null);
    setCurrentScreen('landing');
  };

  const refreshUser = async () => {
    const savedUser = await AsyncStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USERS);
      if (!response.ok) return;
      const data = await response.json();
      console.log('Fetched users:', data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

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
      case 'login': return <AuthScreen onNavigate={setCurrentScreen} onLogin={handleLogin} type="login" />;
      case 'signup': return <AuthScreen onNavigate={setCurrentScreen} onLogin={handleLogin} type="signup" />;
      case 'dashboard': return <DashboardScreen onNavigate={setCurrentScreen} user={user} onRefreshUser={refreshUser} />;
      case 'parcel-details': return <ParcelDetailScreen onNavigate={setCurrentScreen} />;
      case 'transactions': return <TransactionScreen onNavigate={setCurrentScreen} />;
      case 'marketplace': return <MarketplaceScreen onNavigate={setCurrentScreen} />;
      case 'support': return <SupportScreen onNavigate={setCurrentScreen} />;
      case 'profile': return <ProfileScreen onNavigate={setCurrentScreen} theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} user={user} />;
      case 'offline': return <OfflineManagerScreen onNavigate={setCurrentScreen} />;
      case 'report-anomaly': return <ReportAnomalyScreen onNavigate={setCurrentScreen} />;
      case 'inheritance': return <InheritanceScreen onNavigate={setCurrentScreen} />;
      case 'register-land' : return <RegisterLandScreen onNavigate={setCurrentScreen} />;
      case 'sell-land': return <SellLandScreen onNavigate={setCurrentScreen} />;
      case 'buy-land': return <BuyLandScreen onNavigate={setCurrentScreen} />;
      case 'verification': return <VerificationScreen onNavigate={setCurrentScreen} />;
      case 'dispute-list': return <DisputeListScreen onNavigate={setCurrentScreen} onSelectDispute={navigateToDispute} />;
      case 'dispute-detail': return <DisputeDetailScreen onNavigate={setCurrentScreen} disputeId={selectedDisputeId} />;
      case 'mediation-room': return <MediationRoomScreen onNavigate={setCurrentScreen} disputeId={selectedDisputeId} />;
      case 'settings': return <SettingsScreen onNavigate={setCurrentScreen} theme={theme} toggleTheme={toggleTheme} language={language} toggleLanguage={toggleLanguage} onLogout={handleLogout} />;
      case 'tax-payment': return <TaxPaymentScreen onNavigate={setCurrentScreen} />;
      case 'certificate': return <CertificateScreen onNavigate={setCurrentScreen} />;
      case 'qr-scanner': return <QRScannerScreen onNavigate={setCurrentScreen} />;
      case 'land-map': return <LandMapScreen onNavigate={setCurrentScreen} />;
      default: return <LandingScreen onNavigate={setCurrentScreen} />;
    }
  };

  const showNav = currentScreen !== 'landing' && 
                  currentScreen !== 'login' && 
                  currentScreen !== 'signup' && 
                  currentScreen !== 'verification' && 
                  currentScreen !== 'mediation-room' &&
                  user !== null;

  const backgroundColor = theme === 'dark' ? Colors.backgroundDark : Colors.backgroundLight;
  const containerBg = theme === 'dark' ? Colors.surfaceDark : Colors.background;

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: containerBg }]}>
        <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>Ubutaka...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.container, { backgroundColor }]} edges={showNav ? ['top', 'left', 'right'] : ['top', 'left', 'right', 'bottom']}>
        <StatusBar 
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
          backgroundColor={backgroundColor}
          translucent={false}
        />
        <View style={[styles.appContainer, { backgroundColor: containerBg }]}>
          


          <View style={{ flex: 1 }}>
            {renderScreen()}
          </View>
        </View>
        {showNav && (
          <BottomNav 
            current={currentScreen} 
            onNavigate={setCurrentScreen} 
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
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
    shadowColor: Colors.shadow,
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
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  languageText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textSecondary,
  },
  languageTextActive: {
    color: Colors.primary,
  },
  languageDivider: {
    width: 1,
    height: 12,
    backgroundColor: Colors.border,
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
