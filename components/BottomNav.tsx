
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors } from '../styles/colors';

interface BottomNavProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ current, onNavigate }) => {
  const insets = useSafeAreaInsets();
  
  const getActiveTab = (screen: Screen): Screen => {
    if (['dashboard', 'parcel-details', 'report-anomaly', 'register-land'].includes(screen)) return 'dashboard';
    if (['marketplace', 'offline', 'buy-land', 'sell-land'].includes(screen)) return 'marketplace';
    if (['transactions', 'inheritance'].includes(screen)) return 'transactions';
    if (['support', 'dispute-list', 'dispute-detail', 'mediation-room'].includes(screen)) return 'support';
    if (['profile', 'settings'].includes(screen)) return 'profile';
    return screen;
  };

  const activeTab = getActiveTab(current);

  const items = [
    { id: 'dashboard' as Screen, icon: 'home', label: 'Home' },
    { id: 'marketplace' as Screen, icon: 'map', label: 'Market' },
    { id: 'transactions' as Screen, icon: 'add', label: 'Actions', center: true },
    { id: 'support' as Screen, icon: 'school', label: 'Learn' },
    { id: 'profile' as Screen, icon: 'person', label: 'Profile' }
  ];

  return (
    <View style={styles.navContainer}>
      <View style={styles.nav}>
        {items.map((item) => {
           const isActive = activeTab === item.id;
           
           if (item.center) {
             return (
              <Pressable 
                key={item.id} 
                onPress={() => onNavigate('sell-land')}
                style={({ pressed }) => [
                  styles.centerButton,
                  pressed && styles.buttonPressed
                ]}
              >
                <View style={styles.centerIconContainer}>
                  <MaterialIcons name="add" size={32} color={Colors.white} />
                </View>
                <Text style={[styles.centerLabel, isActive && styles.labelActive]}>
                  {item.label}
                </Text>
              </Pressable>
             );
           }
           
           return (
            <Pressable 
              key={item.id} 
              onPress={() => onNavigate(item.id)}
              style={({ pressed }) => [
                styles.navItem,
                pressed && styles.buttonPressed
              ]}
            >
              <MaterialIcons 
                name={item.icon as any} 
                size={24} 
                color={isActive ? Colors.primary : Colors.textTertiary} 
              />
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {item.label}
              </Text>
            </Pressable>
           );
        })}
      </View>
      {/* Spacer for System Navigation (Safe Area) */}
      <View style={{ backgroundColor: Colors.white, height: insets.bottom }} />
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 100,
    elevation: 20, // High elevation to sit above other content
  },
  nav: {
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    height: 70,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  // ... rest of styles remain the same
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    gap: 4,
  },
  centerButton: {
    alignItems: 'center',
    marginTop: -40,
    gap: 4,
  },
  centerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: Colors.white,
  },
  label: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  centerLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontWeight: '500',
    marginTop: 4,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});

export default BottomNav;
