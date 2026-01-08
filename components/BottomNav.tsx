
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';

interface BottomNavProps {
  current: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ current, onNavigate }) => {
  const getActiveTab = (screen: Screen): Screen => {
    if (['dashboard', 'parcel-details', 'report-anomaly', 'register-land'].includes(screen)) return 'dashboard';
    if (['marketplace', 'offline', 'buy-land'].includes(screen)) return 'marketplace';
    if (['transactions', 'inheritance', 'sell-land'].includes(screen)) return 'transactions';
    if (['support'].includes(screen)) return 'support';
    if (['profile'].includes(screen)) return 'profile';
    return screen;
  };

  const activeTab = getActiveTab(current);

  const items = [
    { id: 'dashboard' as Screen, icon: 'home', label: 'Home' },
    { id: 'marketplace' as Screen, icon: 'map', label: 'Market' },
    { id: 'transactions' as Screen, icon: 'receipt-long', label: 'Actions', center: true },
    { id: 'support' as Screen, icon: 'school', label: 'Learn' },
    { id: 'profile' as Screen, icon: 'person', label: 'Profile' }
  ];

  return (
    <SafeAreaView style={styles.navContainer} edges={['bottom']}>
      <View style={styles.nav}>
        {items.map((item) => (
        item.center ? (
          <Pressable 
            key={item.id} 
            onPress={() => onNavigate(item.id)}
            style={({ pressed }) => [
              styles.centerButton,
              pressed && styles.buttonPressed
            ]}
          >
            <View style={[
              styles.centerIconContainer,
              activeTab === item.id ? styles.centerIconActive : styles.centerIconInactive
            ]}>
              <MaterialIcons 
                name={activeTab === item.id ? 'layers' : 'add'} 
                size={28} 
                color="#ffffff" 
              />
            </View>
            <Text style={[
              styles.centerLabel,
              activeTab === item.id && styles.centerLabelActive
            ]}>
              {item.label}
            </Text>
          </Pressable>
        ) : (
          <Pressable 
            key={item.id} 
            onPress={() => onNavigate(item.id)}
            style={({ pressed }) => [
              styles.navItem,
              pressed && styles.buttonPressed
            ]}
          >
            <View style={[
              styles.iconContainer,
              activeTab === item.id && styles.iconContainerActive
            ]}>
              <MaterialIcons 
                name={item.icon as any} 
                size={24} 
                color={activeTab === item.id ? '#3b82f6' : '#64748b'} 
              />
            </View>
            <Text style={[
              styles.label,
              activeTab === item.id && styles.labelActive
            ]}>
              {item.label}
            </Text>
          </Pressable>
        )
      ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
  },
  nav: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 10,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    width: 56,
    gap: 4,
  },
  iconContainer: {
    padding: 4,
    borderRadius: 20,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748b',
  },
  labelActive: {
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  centerButton: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: -32,
    gap: 4,
  },
  centerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  centerIconActive: {
    backgroundColor: '#3b82f6',
    shadowColor: '#3b82f6',
  },
  centerIconInactive: {
    backgroundColor: '#94a3b8',
    shadowColor: '#cbd5e1',
  },
  centerLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 4,
  },
  centerLabelActive: {
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});

export default BottomNav;
