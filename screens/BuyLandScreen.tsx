
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Screen } from '../types';
import { MOCK_PARCELS } from '../constants';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface BuyLandScreenProps {
  onNavigate: (screen: Screen) => void;
}

const BuyLandScreen: React.FC<BuyLandScreenProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const parcel = MOCK_PARCELS[0];

  return (
    <View style={GlobalStyles.container}>
      <SafeAreaView edges={['top']} style={GlobalStyles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => onNavigate('marketplace')} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Review Purchase</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.parcelCard}>
            <Image source={{ uri: parcel.imageUrl }} style={styles.image} resizeMode="cover" />
            <View style={styles.parcelInfo}>
              <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: getColorWithOpacity(Colors.primary, 0.1) }]}>
                  <Text style={[styles.badgeText, { color: Colors.primary }]}>{parcel.district}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: getColorWithOpacity(Colors.success, 0.1) }]}>
                  <Text style={[styles.badgeText, { color: Colors.success }]}>Registered</Text>
                </View>
              </View>
              <Text style={styles.parcelTitle}>{parcel.location} Parcel</Text>
              <Text style={styles.parcelUpi}>UPI: {parcel.upi}</Text>
            </View>
          </View>

          <View style={styles.detailsSection}>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="square-foot" size={20} color={Colors.textSecondary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Total Area</Text>
                <Text style={styles.detailValue}>{parcel.size}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <View style={styles.detailIcon}>
                <MaterialIcons name="person" size={20} color={Colors.textSecondary} />
              </View>
              <View>
                <Text style={styles.detailLabel}>Current Owner</Text>
                <Text style={styles.detailValue}>{parcel.ownerName}</Text>
              </View>
            </View>
          </View>

          <View style={styles.paymentCard}>
            <Text style={styles.paymentTitle}>Payment Summary</Text>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Property Value</Text>
              <Text style={styles.paymentValue}>RWF {parcel.price}</Text>
            </View>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Transfer Fee (2%)</Text>
              <Text style={styles.paymentValue}>RWF 500,000</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.paymentRow}>
              <Text style={styles.totalLabel}>Total Payable</Text>
              <Text style={styles.totalValue}>RWF 25,500,000</Text>
            </View>
          </View>

          <View style={styles.guaranteeBox}>
            <MaterialIcons name="verified-user" size={20} color={Colors.success} />
            <Text style={styles.guaranteeText}>
              Title deed verification complete. Funds are held in escrow until title transfer is confirmed.
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable 
            onPress={() => onNavigate('verification')}
            style={styles.payButton}
          >
            <Text style={styles.payButtonText}>Authorize Purchase</Text>
            <MaterialIcons name="lock" size={20} color={Colors.white} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '900', color: Colors.textPrimary },
  scrollContent: {
    padding: 24,
    gap: 24,
    paddingBottom: 200,
  },
  parcelCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
  },
  parcelInfo: {
    padding: 20,
    gap: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  parcelTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  parcelUpi: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  detailsSection: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  detailIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  paymentCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 24,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.primary,
  },
  guaranteeBox: {
    flexDirection: 'row',
    backgroundColor: getColorWithOpacity(Colors.success, 0.05),
    padding: 16,
    borderRadius: 16,
    gap: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: getColorWithOpacity(Colors.success, 0.1),
  },
  guaranteeText: {
    flex: 1,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    position: 'absolute',
    bottom: 85,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  payButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 12,
  },
  payButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BuyLandScreen;
