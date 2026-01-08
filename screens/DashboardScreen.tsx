
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { MOCK_USER } from '../constants';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface DashboardScreenProps {
  onNavigate: (screen: Screen) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const actions = [
    { icon: 'add-location-alt', label: 'Register Land', screen: 'register-land' },
    { icon: 'shopping-cart', label: 'Buy Land', screen: 'marketplace' },
    { icon: 'sell', label: 'Sell Land', screen: 'sell-land' },
    { icon: 'account-tree', label: 'Inheritance', screen: 'inheritance' }
  ];

  return (
    <View style={GlobalStyles.container}>
      <SafeAreaView edges={['top']} style={GlobalStyles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={GlobalStyles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
            <View style={styles.verifiedBadge}>
              <MaterialIcons name="check" size={14} color={Colors.white} />
            </View>
          </View>
          <View style={styles.userText}>
            <Text style={styles.greeting}>Muraho,</Text>
            <Text style={styles.userName}>{MOCK_USER.name}</Text>
          </View>
        </View>
        <Pressable style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color={Colors.textSecondary} />
          <View style={styles.notificationBadge} />
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* Verification Status Banner */}
        <Pressable 
          onPress={() => onNavigate('verification')}
          style={({ pressed }) => [
            styles.verificationBanner,
            pressed && GlobalStyles.pressed
          ]}
        >
          <View style={styles.verificationContent}>
            <View style={styles.verificationIcon}>
              <MaterialIcons name="fingerprint" size={24} color={Colors.primary} />
            </View>
            <View style={styles.verificationText}>
              <Text style={styles.verificationTitle}>Biometric Identity</Text>
              <Text style={styles.verificationSubtitle}>Active & Verified</Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={Colors.neutral} />
        </Pressable>

        {/* Hero Card */}
        <Pressable 
          onPress={() => onNavigate('parcel-details')}
          style={({ pressed }) => [
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
                <Text style={styles.heroTitle}>3 Parcels</Text>
                <View style={styles.heroLocation}>
                  <MaterialIcons name="location-on" size={14} color={Colors.accent} />
                  <Text style={styles.heroLocationText}>Karongi & Gasabo Districts</Text>
                </View>
              </View>
              <View style={styles.heroIconContainer}>
                <MaterialIcons name="map" size={32} color={Colors.white} />
              </View>
            </View>
            <View style={styles.heroButtons}>
              <Pressable style={styles.heroButtonPrimary}>
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
            {actions.map((action, idx) => (
              <Pressable 
                key={idx} 
                onPress={() => onNavigate(action.screen as Screen)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: Colors.background,
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
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.white,
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
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 20,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.error,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
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
});

export default DashboardScreen;
