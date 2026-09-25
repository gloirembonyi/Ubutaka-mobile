
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Parcel, Transaction } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';
import { decryptData } from '../utils/encryption';

interface ParcelDetailScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  parcelData?: Parcel;
}

const ParcelDetailScreen: React.FC<ParcelDetailScreenProps> = ({ onNavigate, parcelData }) => {
  const [viewMode, setViewMode] = useState<'image' | 'map'>('image');
  const [history, setHistory] = useState<Transaction[]>([]);
  
  // Fallback if no specific parcel passed (should ideally handle gracefully or fetch default)
  const parcel = parcelData || ({
      id: 'unknown',
      upi: 'No Parcel Selected',
      ownerName: 'Unknown',
      status: 'active',
      size: '0 sqm',
      use: 'Unknown',
      district: 'Unknown',
      location: 'Unknown',
      imageUrl: 'https://via.placeholder.com/400x300.png?text=No+Image',
      value: 0
  } as unknown as Parcel);

  React.useEffect(() => {
     if (parcel.upi) {
         fetch(API_ENDPOINTS.TRANSACTIONS)
             .then(r => r.json())
             .then(data => {
                 if (Array.isArray(data)) {
                   // Filter for this parcel and sort by date desc
                   const relevant = data.filter((t: any) => t.upi === parcel.upi || t.upi === '1/03/04/05/1230'); // Demo fallback
                   setHistory(typeof relevant === 'object' ? relevant : []);
                 }
             })
             .catch(e => console.log(e));
     }
  }, [parcel.upi]);

  // Decrypt partners and children
  const partners = React.useMemo(() => {
    try {
      if (!parcel.partners) return [];
      const decrypted = decryptData(parcel.partners);
      return JSON.parse(decrypted);
    } catch (e) {
      console.log('Error decrypting partners:', e);
      return [];
    }
  }, [parcel.partners]);

  const children = React.useMemo(() => {
    try {
      if (!parcel.children) return [];
      const decrypted = decryptData(parcel.children);
      return JSON.parse(decrypted);
    } catch (e) {
      console.log('Error decrypting children:', e);
      return [];
    }
  }, [parcel.children]);

  return (
    <ScrollView style={GlobalStyles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
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
            <Image source={{ uri: parcel.imageUrl || "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800" }} style={styles.mediaImage} resizeMode="cover" />
          ) : (
            <View style={styles.mapPlaceholder}>
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200" }} 
                style={[styles.mediaImage, { opacity: 0.6 }]} 
              />
              <View style={styles.polygonOverlay}>
                  <View style={styles.polygon}>
                     <Text style={styles.polygonText}>{parcel.upi}</Text>
                  </View>
              </View>
              <View style={styles.mapBadge}>
                <Text style={styles.mapBadgeText}>GPS VERIFIED</Text>
              </View>
            </View>
          )}
          <View style={styles.verifiedBadge}>
            <MaterialIcons 
              name={parcel.status === 'Verified' ? "verified-user" : "hourglass-empty"} 
              size={18} 
              color={parcel.status === 'Verified' ? Colors.success : Colors.accent} 
            />
            <Text style={[styles.verifiedText, parcel.status === 'Verified' && { color: Colors.success }]}>
              {parcel.status === 'Verified' ? 'Verified & Secure' : 'Pending Review'}
            </Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsLabel}>Unique Parcel Identifier (UPI)</Text>
            <MaterialIcons 
              name={parcel.status === 'Verified' ? "lock" : "lock-open"} 
              size={16} 
              color={parcel.status === 'Verified' ? Colors.success : Colors.accent} 
            />
          </View>
          <Text style={styles.upi}>{parcel.upi}</Text>
          <View style={[styles.blockchainBadge, parcel.status === 'Verified' ? { backgroundColor: getColorWithOpacity(Colors.success, 0.1), borderColor: Colors.success } : { backgroundColor: getColorWithOpacity(Colors.accent, 0.1), borderColor: Colors.accent }]}>
            <Text style={[styles.blockchainText, parcel.status === 'Verified' ? { color: Colors.success } : { color: Colors.accent }]}>
              {parcel.status === 'Verified' ? 'Blockchain Verified' : 'Awaiting Confirmation'}
            </Text>
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

        {/* Ownership Details Section */}
        {(partners.length > 0 || children.length > 0) && (
          <View style={styles.familySection}>
            <Text style={styles.sectionTitle}>Shared Ownership & Family</Text>
            
            {partners.length > 0 && (
              <View style={styles.familyGroup}>
                <Text style={styles.familyLabel}>Joint Owners / Partners</Text>
                {partners.map((p: any, i: number) => (
                  <View key={i} style={styles.familyItem}>
                    <MaterialIcons name="person-outline" size={16} color={Colors.primary} />
                    <Text style={styles.familyName}>{p.name}</Text>
                    <Text style={styles.familyId}>ID: {p.id}</Text>
                  </View>
                ))}
              </View>
            )}

            {children.length > 0 && (
              <View style={styles.familyGroup}>
                <Text style={styles.familyLabel}>Children / Dependents</Text>
                {children.map((c: any, i: number) => (
                  <View key={i} style={styles.familyItem}>
                    <MaterialIcons name="child-care" size={16} color={Colors.primary} />
                    <Text style={styles.familyName}>{c.name}</Text>
                    <Text style={styles.familyId}>{c.age} yrs</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {parcel.status === 'Verified' ? (
          <Pressable 
            style={styles.downloadButton}
            onPress={() => onNavigate('certificate', { parcel })}
          >
            <MaterialIcons name="card-membership" size={22} color={Colors.white} />
            <Text style={styles.downloadText}>View Digital Title (e-Title)</Text>
          </Pressable>
        ) : (
          <View style={[styles.downloadButton, { backgroundColor: Colors.borderLight, shadowOpacity: 0 }]}>
            <MaterialIcons name="hourglass-top" size={20} color={Colors.textTertiary} />
            <Text style={[styles.downloadText, { color: Colors.textTertiary }]}>Verification In Progress</Text>
          </View>
        )}

        <View style={styles.historySection}>
            <View style={styles.sectionHeaderRow}>
               <Text style={styles.sectionTitle}>Ownership Chain & History</Text>
               <Pressable onPress={() => onNavigate('land-vault', { upi: parcel.upi })}>
                  <Text style={styles.vaultLink}>View Archive</Text>
               </Pressable>
            </View>
            
            {history.length === 0 ? (
                <View style={styles.emptyHistory}>
                   <MaterialIcons name="history" size={32} color={Colors.border} />
                   <Text style={styles.noHistory}>Digital chain starts with you.</Text>
                </View>
            ) : (
                <View style={styles.timelineContainer}>
                    {history.map((tx, idx) => (
                        <View key={idx} style={styles.historyItem}>
                            <View style={styles.timelineSide}>
                                <Image 
                                    source={{ uri: `https://ui-avatars.com/api/?name=${tx.buyerName}&background=random` }} 
                                    style={styles.ownerThumb} 
                                />
                                {idx < history.length - 1 && <View style={styles.chainLink} />}
                            </View>
                            <View style={styles.historyBody}>
                                <View style={styles.historyHeader}>
                                    <Text style={styles.historyRole}>{idx === 0 ? 'Current Owner' : 'Previous Owner'}</Text>
                                    <Text style={styles.historyDate}>{new Date(tx.date).getFullYear()}</Text>
                                </View>
                                <Text style={styles.ownerNameText}>{tx.buyerName}</Text>
                                <Text style={styles.historyTxType}>{tx.type} via Ubutaka</Text>
                                
                                <View style={styles.blockchainPill}>
                                    <MaterialIcons name="verified" size={12} color={Colors.success} />
                                    <Text style={styles.hashPillText} numberOfLines={1}>
                                        {tx.txHash || 'Verified on Chain'}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>

        <View style={styles.reportingSection}>
            <Text style={styles.sectionTitle}>Issues & Disputes</Text>
            
            <View style={styles.actionRow}>
                <Pressable
                  onPress={() => onNavigate('report-anomaly', { 
                    type: 'Dispute', 
                    upi: parcel.upi,
                    district: parcel.district,
                    sector: parcel.sector,
                    cell: parcel.cell,
                    village: parcel.village
                  })}
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
    backgroundColor: '#e3f2fd',
  },
  polygonOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  polygon: {
    width: 140,
    height: 140,
    borderWidth: 3,
    borderColor: Colors.primary,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.2),
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  polygonText: {
    color: Colors.primary,
    fontWeight: '900',
    fontSize: 14,
  },
  mapBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  mapBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: Colors.textSecondary,
    letterSpacing: 1,
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
  historySection: {
      backgroundColor: Colors.white,
      padding: 24,
      borderRadius: 32,
      borderWidth: 1,
      borderColor: Colors.borderLight,
      marginTop: 16,
  },
  sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
  },
  vaultLink: {
      fontSize: 12,
      color: Colors.primary,
      fontWeight: 'bold',
      textDecorationLine: 'underline',
  },
  timelineContainer: {
      gap: 0,
  },
  historyItem: {
      flexDirection: 'row',
      gap: 16,
  },
  timelineSide: {
      alignItems: 'center',
      width: 40,
  },
  ownerThumb: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors.borderLight,
  },
  chainLink: {
      width: 2,
      flex: 1,
      backgroundColor: Colors.borderLight,
      marginVertical: 4,
  },
  historyBody: {
      flex: 1,
      paddingBottom: 24,
  },
  historyHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
  },
  historyRole: {
      fontSize: 10,
      fontWeight: 'bold',
      color: Colors.textTertiary,
      textTransform: 'uppercase',
  },
  historyDate: {
      fontSize: 10,
      color: Colors.textTertiary,
  },
  ownerNameText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: Colors.textPrimary,
  },
  historyTxType: {
      fontSize: 12,
      color: Colors.textSecondary,
      marginBottom: 8,
  },
  blockchainPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: '#F0FDF4',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      alignSelf: 'flex-start',
  },
  hashPillText: {
      fontSize: 10,
      color: Colors.success,
      fontFamily: 'monospace',
      maxWidth: 150,
  },
  emptyHistory: {
      alignItems: 'center',
      padding: 20,
      gap: 12,
  },
  noHistory: {
      fontSize: 13,
      color: Colors.textTertiary,
      fontStyle: 'italic',
  },
  familySection: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginTop: 16,
    gap: 16,
  },
  familyGroup: {
    gap: 8,
  },
  familyLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  familyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.backgroundLight,
    padding: 12,
    borderRadius: 12,
  },
  familyName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  familyId: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});

export default ParcelDetailScreen;
