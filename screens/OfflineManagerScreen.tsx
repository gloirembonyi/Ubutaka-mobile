
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface OfflineManagerScreenProps {
  onNavigate: (screen: Screen) => void;
}

const OfflineManagerScreen: React.FC<OfflineManagerScreenProps> = ({ onNavigate }) => {
  const [syncCount, setSyncCount] = useState(2);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert("Land data downloaded for offline use.");
    }, 2000);
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Offline Access</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="wifi-off" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Rural Access Mode</Text>
          <Text style={styles.subtitle}>
            Continue your transactions even without internet. Your data will sync automatically when you&apos;re back online.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Local Data Management</Text>
          
          <Pressable style={styles.actionCard} onPress={handleDownload}>
            <View style={styles.cardIcon}>
              <MaterialIcons name="cloud-download" size={24} color={Colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{downloading ? 'Downloading...' : 'Download My Parcels'}</Text>
              <Text style={styles.cardSub}>Save details, maps, and history for offline review.</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.textTertiary} />
          </Pressable>

          <View style={styles.actionCard}>
            <View style={styles.cardIcon}>
              <MaterialIcons name="edit-note" size={24} color={Colors.primary} />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>Offline Drafts</Text>
              <Text style={styles.cardSub}>0 pending drafts created locally.</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.textTertiary} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sync Queue</Text>
            {syncCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{syncCount}</Text></View>}
          </View>
          
          <View style={styles.syncItem}>
            <MaterialIcons name="sync" size={20} color={Colors.warning} />
            <View style={styles.syncText}>
              <Text style={styles.syncTitle}>Sale Initiation - UPI 1/02/03</Text>
              <Text style={styles.syncSub}>Awaiting connection to blockchain...</Text>
            </View>
          </View>

          <View style={styles.syncItem}>
            <MaterialIcons name="sync" size={20} color={Colors.warning} />
            <View style={styles.syncText}>
              <Text style={styles.syncTitle}>Document Upload - ID Copy</Text>
              <Text style={styles.syncSub}>Queued for synchronization.</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.syncButton} onPress={() => alert("Syncing data...")}>
          <MaterialIcons name="refresh" size={20} color={Colors.white} />
          <Text style={styles.syncBtnText}>Sync Now</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight, backgroundColor: Colors.white },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'center' },
  
  scroll: { flex: 1 },
  hero: { alignItems: 'center', padding: 40, backgroundColor: Colors.white },
  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: getColorWithOpacity(Colors.primary, 0.1), alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  
  section: { padding: 20 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 16 },
  badge: { backgroundColor: Colors.error, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, marginBottom: 16 },
  badgeText: { color: Colors.white, fontSize: 10, fontWeight: 'bold' },
  
  actionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.borderLight },
  cardIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: getColorWithOpacity(Colors.primary, 0.05), alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  cardSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  
  syncItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: Colors.white, borderRadius: 16, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: Colors.warning, borderWidth: 1, borderColor: Colors.borderLight },
  syncText: { marginLeft: 16 },
  syncTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary },
  syncSub: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  
  syncButton: { margin: 20, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 8 },
  syncBtnText: { color: Colors.white, fontWeight: 'bold', fontSize: 16 },
});

export default OfflineManagerScreen;
