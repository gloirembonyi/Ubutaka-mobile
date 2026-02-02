
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import { Screen, User, Parcel } from '../types';
import { MOCK_USER } from '../constants';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainHeader from '../components/MainHeader';

interface DashboardScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  user: User | null;
  onRefreshUser?: () => void;
}

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=0D8ABC&color=fff&bold=true&name=';

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate, user, onRefreshUser }) => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  
  const displayUser = user || MOCK_USER;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOffline(!state.isConnected);
    });
    fetchParcels();
    return () => unsubscribe();
  }, [user]);

  // Refresh parcels when screen comes into focus (after registration)
  useEffect(() => {
    // This will be called when component mounts or user changes
    const interval = setInterval(() => {
      fetchParcels();
    }, 5000); // Refresh every 5 seconds for real-time feel

    return () => clearInterval(interval);
  }, [user]);

  const fetchParcels = async () => {
    if (!displayUser.name) return;
    try {
      const url = `${API_ENDPOINTS.PARCELS}?ownerName=${encodeURIComponent(displayUser.name)}`;
      console.log('Dashboard: Fetching parcels from:', url);
      const resp = await fetch(url);
      if (resp.ok) {
        const data = await resp.json();
        console.log('Dashboard: Fetched parcels:', data.length);
        setParcels(data);
      } else {
        console.error('Dashboard: Failed to fetch parcels:', resp.status);
      }
    } catch (err) {
      console.error('Dashboard: Fetch parcels error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricVerify = async () => {
    if (displayUser.isVerified) return;
    
    setVerifying(true);
    // Simulate biometric scan delay
    setTimeout(async () => {
      try {
        const resp = await fetch(`${API_ENDPOINTS.USERS}/${displayUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isVerified: true })
        });
        
        if (resp.ok) {
          const updatedUser = await resp.json();
          // Update AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
          // Notify parent to refresh state
          if (onRefreshUser) onRefreshUser();
          
          Alert.alert("Success", "Biometric Identity Verified successfully!");
        } else {
          Alert.alert("Error", "Failed to verify identity. Please try again.");
        }
      } catch (err) {
        console.error('Verify error:', err);
        Alert.alert("Error", "Network error during verification.");
      } finally {
        setVerifying(false);
      }
    }, 2000);
  };

  const actions = [
    { icon: 'add-location-alt', label: 'Register Land', screen: 'register-land' },
    { icon: 'shopping-cart', label: 'Buy Land', screen: 'marketplace' },
    { icon: 'sell', label: 'Sell Land', screen: 'sell-land' },
    { icon: 'qr-code-scanner', label: 'Verify Title', screen: 'qr-scanner' },
    { icon: 'receipt-long', label: 'Transactions', screen: 'transactions' },
    { icon: 'account-tree', label: 'Inheritance', screen: 'inheritance' },
    { icon: 'wifi-off', label: 'Offline Mode', screen: 'offline' },
    { icon: 'gavel', label: 'Report Dispute', screen: 'report-anomaly', params: { type: 'Dispute' } },
    { icon: 'report-problem', label: 'Report Anomaly', screen: 'report-anomaly', params: { type: 'Anomaly' } }
  ];

  return (
    <View style={GlobalStyles.container}>
      <SafeAreaView edges={['top']} style={GlobalStyles.safeArea}>
        <MainHeader user={displayUser} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {isOffline && (
            <View style={styles.offlineBanner}>
               <MaterialIcons name="cloud-off" size={16} color={Colors.white} />
               <Text style={styles.offlineText}>Working Offline. Data will sync when connected.</Text>
            </View>
          )}
          <View style={styles.content}>
            {/* Verification Status Banner */}
            <Pressable 
              onPress={handleBiometricVerify}
              style={({ pressed }: { pressed: boolean }) => [
                styles.verificationBanner,
                pressed && GlobalStyles.pressed,
                displayUser.isVerified && styles.verificationBannerActive
              ]}
            >
              <View style={styles.verificationContent}>
                <View style={[styles.verificationIcon, displayUser.isVerified && styles.verificationIconActive]}>
                  <MaterialIcons 
                    name="fingerprint" 
                    size={24} 
                    color={displayUser.isVerified ? Colors.success : Colors.primary} 
                  />
                </View>
                <View style={styles.verificationText}>
                  <Text style={styles.verificationTitle}>Biometric Identity</Text>
                  <Text style={[styles.verificationSubtitle, displayUser.isVerified && { color: Colors.success }]}>
                    {displayUser.isVerified ? "Active & Verified" : "Action Required: Tap to Verify"}
                  </Text>
                </View>
              </View>
              <MaterialIcons 
                name={displayUser.isVerified ? "check-circle" : "chevron-right"} 
                size={24} 
                color={displayUser.isVerified ? Colors.success : Colors.neutral} 
              />
            </Pressable>

        {/* Hero Card */}
        <Pressable 
          onPress={() => onNavigate('my-parcels')}
          style={({ pressed }: { pressed: boolean }) => [
            styles.heroCard,
            pressed && GlobalStyles.pressed
          ]}
        >
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBg3B2S4GgGnOLWO9G9snLyexmgoP8BoMiJYbNlHRmhhpZt-0LM2yKADDK40N_L83tq28leenpgC-0ZHu32zftdaKAWXOZXHV2FujdyWeNC3DVte7JcpPM9SphFSyhqaqVLT3u1uZ1NuGYlH4Ecd1klMuQZiEXqpiR2tvUH7LY3xiA_QmawIgGFRj2MlPoO1rWZyBb0Bx-ZctaP-MC0TRnujB-CfwWoi-0VYqeaLZw985AbeB37zg5cevXUbaF0lVUPs-Ra-rZdBGR3' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <View style={styles.heroHeader}>
              <View>
                <Text style={styles.heroLabel}>Total Holdings</Text>
                <Text style={styles.heroTitle}>{loading ? '...' : `${parcels.length} ${parcels.length === 1 ? 'Parcel' : 'Parcels'}`}</Text>
                <View style={styles.heroLocation}>
                  <MaterialIcons name="location-on" size={14} color={Colors.accent} />
                  <Text style={styles.heroLocationText}>
                    {loading ? 'Fetching location...' : 
                     parcels.length > 0 ? Array.from(new Set(parcels.map((p: Parcel) => p.district))).join(' & ') + ' Districts' : 
                     'No parcels registered'}
                  </Text>
                </View>
              </View>
              <View style={styles.heroIconContainer}>
                <MaterialIcons name="map" size={32} color={Colors.white} />
              </View>
            </View>
            <View style={styles.heroButtons}>
              <Pressable 
                onPress={(e) => { e.stopPropagation(); onNavigate('certificate'); }}
                style={styles.heroButtonPrimary}
              >
                <Text style={styles.heroButtonText}>Land Certificates</Text>
              </Pressable>
              <Pressable 
                onPress={(e) => { e.stopPropagation(); onNavigate('register-land'); }}
                style={styles.heroButtonSecondary}
              >
                <Text style={styles.heroButtonSecondaryText}>Register New</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Land Actions</Text>
          <View style={styles.actionsGrid}>
            {actions.map((action, idx: number) => (
              <Pressable 
                key={idx} 
                onPress={() => onNavigate(action.screen as Screen, (action as any).params)}
                style={({ pressed }) => [
                  styles.actionCard,
                  pressed && GlobalStyles.pressed
                ]}
              >
                <View style={styles.actionIcon}>
                  <MaterialIcons name={action.icon as any} size={28} color={Colors.primary} />
                </View>
                <View style={styles.actionText}>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Text style={styles.actionSub}>Paperless Flow</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Services</Text>
            <Pressable onPress={() => onNavigate('transactions')}>
              <Text style={styles.sectionLink}>History</Text>
            </Pressable>
          </View>
          <View style={styles.transactionCard}>
            <View style={styles.transactionContent}>
              <View style={styles.transactionIcon}>
                <MaterialIcons name="payments" size={20} color={Colors.accent} />
              </View>
              <View>
                <Text style={styles.transactionTitle}>Tax Payment</Text>
                <Text style={styles.transactionSub}>Parcel 5/03/...111</Text>
              </View>
            </View>
            <Text style={styles.transactionDate}>Oct 24</Text>
          </View>
        </View>
      </View>
        </ScrollView>
      </SafeAreaView>

      {/* Verification Overlay */}
      {verifying && (
        <View style={styles.overlay}>
           <View style={styles.scanModal}>
              <View style={styles.scanCircle}>
                 <MaterialIcons name="fingerprint" size={80} color={Colors.primary} />
                 {/* This would be an animation in a real app */}
                 <View style={styles.scanLine} />
              </View>
              <Text style={styles.scanTitle}>Identity Verification</Text>
              <Text style={styles.scanSubtitle}>Scanning fingerprint or face...</Text>
              <ActivityIndicator color={Colors.primary} style={{marginTop: 20}} />
           </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: Colors.white,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  langText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textTertiary,
  },
  langTextActive: {
    fontSize: 10,
    fontWeight: 'black',
    color: Colors.textPrimary,
  },
  langDivider: {
    width: 1,
    height: 10,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  globeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.05),
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.border,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 2,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userText: {
    flexDirection: 'column',
  },
  greeting: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'black',
    color: Colors.textPrimary,
    lineHeight: 22,
    maxWidth: 150,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 10,
    gap: 24,
  },
  verificationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
  },
  verificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationText: {
    flexDirection: 'column',
  },
  verificationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  verificationSubtitle: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  verificationBannerActive: {
    borderColor: Colors.success,
    backgroundColor: getColorWithOpacity(Colors.success, 0.05),
  },
  verificationIconActive: {
    backgroundColor: getColorWithOpacity(Colors.success, 0.1),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  scanModal: {
    width: 280,
    backgroundColor: Colors.white,
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  scanCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.05),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 2,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  scanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  scanSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  heroCard: {
    position: 'relative',
    borderRadius: 24,
    overflow: 'hidden',
    minHeight: 220,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    backgroundColor: Colors.primaryDark,
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.15,
  },
  heroOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: getColorWithOpacity(Colors.primaryDark, 0.85),
  },
  heroContent: {
    position: 'relative',
    zIndex: 10,
    padding: 24,
    gap: 20,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: Colors.white,
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  heroLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  heroLocationText: {
    fontSize: 13,
    color: getColorWithOpacity(Colors.white, 0.75),
    fontWeight: '600',
  },
  heroIconContainer: {
    backgroundColor: getColorWithOpacity(Colors.primary, 0.2),
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: getColorWithOpacity(Colors.primary, 0.3),
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  heroButtonPrimary: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  heroButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroButtonSecondary: {
    flex: 1,
    backgroundColor: getColorWithOpacity(Colors.white, 0.15),
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: getColorWithOpacity(Colors.white, 0.2),
  },
  heroButtonSecondaryText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.05),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    gap: 4,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  actionSub: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  transactionsSection: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 20,
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  transactionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: getColorWithOpacity(Colors.accent, 0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  transactionSub: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
  transactionDate: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textTertiary,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F59E0B', // Amber
    paddingVertical: 8,
    gap: 8,
  },
  offlineText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default DashboardScreen;
