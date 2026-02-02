
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Pressable, useColorScheme, StatusBar } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen, Language, User } from './types';
import SyncService from './services/SyncService';
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
import DocumentVaultScreen from './screens/DocumentVaultScreen';
import BottomNav from './components/BottomNav';

import AuthScreen from './screens/AuthScreen';
import AbunziDashboardScreen from './screens/AbunziDashboardScreen';
import MyParcelsScreen from './screens/MyParcelsScreen';
import ProfileCompletionScreen from './screens/ProfileCompletionScreen';
import { isProfileComplete } from './utils/profileCompletion';


const App: React.FC = () => {
  const systemColorScheme = useColorScheme();
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [language, setLanguage] = useState<Language>('RW');
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load theme and session from AsyncStorage
    const initialize = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'dark') {
          setTheme('dark');
        } else {
          // Default to light for everything else (including 'light' or null)
          setTheme('light');
        }

        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          if (parsedUser.role === 'ABUNZI') {
            setCurrentScreen('abunzi-dashboard');
          } else {
            setCurrentScreen('dashboard');
          }
        }
      } catch (err) {
        console.error('Failed to initialize app:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
    SyncService.init();

    // Fetch initial data from API
    fetchUsers();
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    AsyncStorage.setItem('user', JSON.stringify(userData));
    if (userData.role === 'ABUNZI') {
      setCurrentScreen('abunzi-dashboard');
    } else {
      setCurrentScreen('dashboard');
    }
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
      const url = API_ENDPOINTS.USERS;
      console.log('Fetching users from:', url);
      const response = await fetch(url);
      if (!response.ok) {
        console.error('Failed to fetch users:', response.status, response.statusText);
        return;
      }
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

  const toggleTheme = () => setTheme((prev: 'light' | 'dark') => prev === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => setLanguage((prev: Language) => prev === 'RW' ? 'EN' : 'RW');

  const navigateToDispute = (id: string) => {
    setSelectedDisputeId(id);
    setCurrentScreen('dispute-detail');
  };

  const [navParams, setNavParams] = useState<any>(null);

  const handleNavigate = (screen: Screen, params?: any) => {
    // Check if action requires profile completion
    const requiresProfile = ['register-land', 'sell-land', 'buy-land', 'marketplace'].includes(screen);
    
    if (requiresProfile && user && !isProfileComplete(user)) {
      // Show profile completion screen instead
      setNavParams({ returnTo: screen, returnParams: params });
      setCurrentScreen('profile-completion');
      return;
    }
    
    setNavParams(params || null);
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing': return <LandingScreen onNavigate={handleNavigate} />;
      case 'login': return <AuthScreen onNavigate={handleNavigate} onLogin={handleLogin} type="login" />;
      case 'signup': return <AuthScreen onNavigate={handleNavigate} onLogin={handleLogin} type="signup" />;
      case 'dashboard': return <DashboardScreen onNavigate={handleNavigate} user={user} onRefreshUser={refreshUser} />;
      case 'my-parcels': return <MyParcelsScreen onNavigate={handleNavigate} user={user} />;
      case 'parcel-details': return <ParcelDetailScreen onNavigate={handleNavigate} parcelData={navParams?.parcel} />;
      case 'transactions': return <TransactionScreen onNavigate={handleNavigate} user={user} />;
      case 'marketplace': return <MarketplaceScreen onNavigate={handleNavigate} />;
      case 'support': return <SupportScreen onNavigate={handleNavigate} />;
      case 'profile': return <ProfileScreen onNavigate={handleNavigate} theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} user={user} />;
      case 'offline': return <OfflineManagerScreen onNavigate={handleNavigate} user={user} />;
      case 'profile-completion': {
        const returnTo = navParams?.returnTo as Screen;
        const returnParams = navParams?.returnParams;
        return (
          <ProfileCompletionScreen 
            onNavigate={handleNavigate} 
            user={user} 
            onComplete={async () => {
              await refreshUser();
              if (returnTo) {
                handleNavigate(returnTo, returnParams);
              } else {
                handleNavigate('dashboard');
              }
            }} 
          />
        );
      }
      case 'report-anomaly': return <ReportAnomalyScreen onNavigate={handleNavigate} user={user} params={navParams} />;
      case 'inheritance': return <InheritanceScreen onNavigate={handleNavigate} />;
      case 'register-land' : return <RegisterLandScreen onNavigate={handleNavigate} />;
      case 'sell-land': return <SellLandScreen onNavigate={handleNavigate} />;
      case 'buy-land': return <BuyLandScreen onNavigate={handleNavigate} params={navParams} />;
      case 'verification': return <VerificationScreen onNavigate={handleNavigate} />;
      case 'dispute-list': return <DisputeListScreen onNavigate={handleNavigate} onSelectDispute={navigateToDispute} user={user} />;
      case 'dispute-detail': return <DisputeDetailScreen onNavigate={handleNavigate} disputeId={selectedDisputeId} user={user} />;
      case 'mediation-room': return <MediationRoomScreen onNavigate={handleNavigate} disputeId={selectedDisputeId} user={user} />;
      case 'settings': return <SettingsScreen onNavigate={handleNavigate} theme={theme} toggleTheme={toggleTheme} language={language} toggleLanguage={toggleLanguage} onLogout={handleLogout} />;
      case 'tax-payment': return <TaxPaymentScreen onNavigate={handleNavigate} />;
      case 'certificate': return <CertificateScreen onNavigate={handleNavigate} parcelData={navParams?.parcel} />;
      case 'qr-scanner': return <QRScannerScreen onNavigate={handleNavigate} />;
      case 'land-map': return <LandMapScreen onNavigate={handleNavigate} />;
      case 'abunzi-dashboard': return <AbunziDashboardScreen onNavigate={handleNavigate} user={user} />;
      case 'land-vault': return <DocumentVaultScreen onNavigate={handleNavigate} user={user} />;
      default: return <LandingScreen onNavigate={handleNavigate} />;
    }
  };

  const isPublicScreen = (screen: Screen) => {
    return screen === 'landing' || screen === 'login' || screen === 'signup';
  };

  useEffect(() => {
    // If user is logged in and tries to access public screens, redirect to dashboard
    if (user && isPublicScreen(currentScreen)) {
       if (user.role === 'ABUNZI') {
        setCurrentScreen('abunzi-dashboard');
       } else {
        setCurrentScreen('dashboard');
       }
    }
    
    // If user is NOT logged in and tries to access private screens, redirect to landing
    if (!user && !isPublicScreen(currentScreen)) {
      setCurrentScreen('landing');
    }
  }, [user, currentScreen]);

  const showNav = !isPublicScreen(currentScreen) && 
                  !['verification', 'mediation-room', 'register-land', 'sell-land', 'buy-land', 'report-anomaly', 'tax-payment', 'qr-scanner'].includes(currentScreen) &&
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
            onNavigate={handleNavigate} 
            user={user}
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
