
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Parcel } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface ParcelDetailScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  parcelData?: Parcel;
}

const ParcelDetailScreen: React.FC<ParcelDetailScreenProps> = ({ onNavigate, parcelData }) => {
  const [viewMode, setViewMode] = useState<'image' | 'map'>('image');
  
  // Fallback if no specific parcel passed (should ideally handle gracefully or fetch default)
  const parcel = parcelData || {
      id: 'unknown',
      upi: 'No Parcel Selected',
      ownerName: 'Unknown',
      status: 'active',
      size: 0,
      use: 'Unknown',
      district: 'Unknown',
      imageUrl: 'https://via.placeholder.com/400x300.png?text=No+Image',
      value: 0
  };

  return (
    <ScrollView style={GlobalStyles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dashboard')} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>My Parcel</Text>
        <Pressable style={styles.headerButton}>
          <MaterialIcons name="share" size={24} color={Colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.toggleContainer}>
          <Pressable
            onPress={() => setViewMode('image')}
            style={[styles.toggleButton, viewMode === 'image' && styles.toggleButtonActive]}
          >
            <MaterialIcons name="image" size={16} color={viewMode === 'image' ? Colors.primary : Colors.textTertiary} />
            <Text style={[styles.toggleText, viewMode === 'image' && styles.toggleTextActive]}>Image</Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('map')}
            style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
          >
            <MaterialIcons name="map" size={16} color={viewMode === 'map' ? Colors.primary : Colors.textTertiary} />
            <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>Map View</Text>
          </Pressable>
        </View>

        <View style={styles.mediaContainer}>
          {viewMode === 'image' ? (
            <Image source={{ uri: parcel.imageUrl }} style={styles.mediaImage} resizeMode="cover" />
          ) : (
            <View style={styles.mapPlaceholder}>
              <MaterialIcons name="map" size={48} color={Colors.border} />
              <Text style={styles.mapText}>Map View</Text>
            </View>
          )}
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified-user" size={18} color={Colors.primary} />
            <Text style={styles.verifiedText}>Registered & Secure</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsLabel}>Unique Parcel Identifier (UPI)</Text>
            <MaterialIcons name="lock" size={16} color={Colors.primary} />
          </View>
          <Text style={styles.upi}>{parcel.upi}</Text>
          <View style={styles.blockchainBadge}>
            <Text style={styles.blockchainText}>Blockchain Verified</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialIcons name="square-foot" size={20} color={Colors.textSecondary} />
            <Text style={styles.statLabel}>Size</Text>
            <Text style={styles.statValue}>{parcel.size}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="home-work" size={20} color={Colors.textSecondary} />
            <Text style={styles.statLabel}>Use</Text>
            <Text style={styles.statValue}>{parcel.use}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="location-city" size={20} color={Colors.textSecondary} />
            <Text style={styles.statLabel}>District</Text>
            <Text style={styles.statValue}>{parcel.district}</Text>
          </View>
        </View>

        <Pressable style={styles.downloadButton}>
          <MaterialIcons name="download" size={20} color={Colors.white} />
          <Text style={styles.downloadText}>Download Title Deed</Text>
        </Pressable>

        <View style={styles.reportingSection}>
            <Text style={styles.sectionTitle}>Issues & Disputes</Text>
            
            <View style={styles.actionRow}>
                <Pressable
                  onPress={() => onNavigate('report-anomaly', { type: 'Dispute', upi: parcel.upi })}
                  style={[styles.actionButton, styles.disputeButton]}
                >
                  <MaterialIcons name="gavel" size={20} color={Colors.white} />
                  <Text style={styles.disputeButtonText}>Report Dispute</Text>
                </Pressable>

                <Pressable
                  onPress={() => onNavigate('report-anomaly', { type: 'Anomaly', upi: parcel.upi })}
                  style={[styles.actionButton, styles.anomalyButtonOutline]}
                >
                   <MaterialIcons name="report-problem" size={20} color={Colors.accent} />
                  <Text style={styles.anomalyButtonTextOutline}>Report Anomaly</Text>
                </Pressable>
            </View>

            <View style={styles.infoBox}>
                <Text style={styles.infoText}>
                    Disputes are handled by Abunzi mediators. Anomalies are data corrections handled by the Land Notary.
                </Text>
            </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: getColorWithOpacity(Colors.background, 0.95),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.borderLight,
    padding: 4,
    borderRadius: 12,
    alignSelf: 'center',
    gap: 4,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: Colors.white,
  },
  toggleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  toggleTextActive: {
    color: Colors.primary,
  },
  mediaContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.backgroundLight,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundLight,
  },
  mapText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: getColorWithOpacity(Colors.white, 0.9),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: getColorWithOpacity(Colors.primary, 0.2),
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  statsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    gap: 12,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  upi: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  blockchainBadge: {
    alignSelf: 'flex-start',
    backgroundColor: getColorWithOpacity(Colors.primary, 0.1),
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: getColorWithOpacity(Colors.primary, 0.2),
  },
  blockchainText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  anomalyCard: {
    flexDirection: 'row',
    backgroundColor: Colors.accentLight,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: getColorWithOpacity(Colors.accent, 0.2),
    gap: 20,
  },
  anomalyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: getColorWithOpacity(Colors.accent, 0.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  anomalyContent: {
    flex: 1,
    gap: 8,
  },
  anomalyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  anomalyText: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  anomalyButton: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: getColorWithOpacity(Colors.accent, 0.3),
    marginTop: 8,
  },
  anomalyButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.accentDark,
  },
  reportingSection: {
      marginTop: 24,
      gap: 16,
      backgroundColor: Colors.white,
      padding: 20,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: Colors.borderLight,
  },
  sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.textPrimary,
  },
  actionRow: {
      flexDirection: 'row',
      gap: 12,
  },
  actionButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 14,
      gap: 8,
  },
  disputeButton: {
      backgroundColor: Colors.error,
      shadowColor: Colors.error,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 3,
  },
  disputeButtonText: {
      color: Colors.white,
      fontWeight: 'bold',
      fontSize: 13,
  },
  anomalyButtonOutline: {
      backgroundColor: Colors.white,
      borderWidth: 1,
      borderColor: Colors.accent,
  },
  anomalyButtonTextOutline: {
      color: Colors.accent,
      fontWeight: 'bold',
      fontSize: 13,
  },
  infoBox: {
      backgroundColor: Colors.backgroundLight,
      padding: 12,
      borderRadius: 12,
  },
  infoText: {
      fontSize: 11,
      color: Colors.textSecondary,
      lineHeight: 16,
      textAlign: 'center',
  },
});

export default ParcelDetailScreen;
