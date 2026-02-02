
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Screen } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import SyncService, { SyncItem } from '../services/SyncService';
import { API_ENDPOINTS } from '../config/api';

interface OfflineManagerScreenProps {
  onNavigate: (screen: Screen) => void;
  user?: any;
}

const QUEUE_KEY = '@sync_queue';

const OfflineManagerScreen: React.FC<OfflineManagerScreenProps> = ({ onNavigate, user }) => {
  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([]);
  const [downloading, setDownloading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [downloadedParcels, setDownloadedParcels] = useState<any[]>([]);

  useEffect(() => {
    loadSyncQueue();
    loadDownloadedData();
    
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      setIsOffline(!state.isConnected);
      if (state.isConnected) {
        // Auto-sync when coming back online
        handleSyncNow();
      }
    });

    return () => unsubscribe();
  }, []);

  const loadSyncQueue = async () => {
    try {
      const data = await AsyncStorage.getItem(QUEUE_KEY);
      const queue = data ? JSON.parse(data) : [];
      setSyncQueue(queue);
    } catch (err) {
      console.error('Error loading sync queue:', err);
    }
  };

  const loadDownloadedData = async () => {
    try {
      const data = await AsyncStorage.getItem('@downloaded_parcels');
      const parcels = data ? JSON.parse(data) : [];
      setDownloadedParcels(parcels);
    } catch (err) {
      console.error('Error loading downloaded data:', err);
    }
  };

  const handleDownload = async () => {
    if (!user) {
      Alert.alert('Error', 'Please login first');
      return;
    }

    setDownloading(true);
    try {
      // Fetch user's parcels
      const resp = await fetch(`${API_ENDPOINTS.PARCELS}?ownerName=${encodeURIComponent(user.name)}`);
      if (resp.ok) {
        const data = await resp.json();
        // Store locally for offline access
        await AsyncStorage.setItem('@downloaded_parcels', JSON.stringify(data));
        setDownloadedParcels(data);
        Alert.alert("Success", `Downloaded ${data.length} parcels for offline use.`);
      } else {
        Alert.alert('Error', 'Failed to download parcels. Please check your connection.');
      }
    } catch (err) {
      console.error('Download error:', err);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setDownloading(false);
    }
  };

  const handleSyncNow = async () => {
    if (isOffline) {
      Alert.alert('Offline', 'You are currently offline. Please connect to the internet to sync.');
      return;
    }

    setSyncing(true);
    try {
      await SyncService.processQueue();
      await loadSyncQueue(); // Refresh queue after sync
      Alert.alert('Success', 'Sync completed successfully!');
    } catch (err) {
      console.error('Sync error:', err);
      Alert.alert('Error', 'Some items failed to sync. Please try again.');
    } finally {
      setSyncing(false);
    }
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
              <Text style={styles.cardTitle}>
                {downloading ? 'Downloading...' : `Download My Parcels (${downloadedParcels.length} cached)`}
              </Text>
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
              <Text style={styles.cardSub}>{syncQueue.length} pending items in sync queue.</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.textTertiary} />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sync Queue</Text>
            {syncQueue.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{syncQueue.length}</Text>
              </View>
            )}
          </View>
          
          {syncQueue.length === 0 ? (
            <View style={styles.emptyQueue}>
              <MaterialIcons name="check-circle" size={32} color={Colors.success} />
              <Text style={styles.emptyQueueText}>No pending sync items</Text>
              <Text style={styles.emptyQueueSub}>All data is up to date</Text>
            </View>
          ) : (
            syncQueue.map((item, index) => (
              <View key={item.id || index} style={styles.syncItem}>
                <MaterialIcons 
                  name={isOffline ? "cloud-off" : "sync"} 
                  size={20} 
                  color={isOffline ? Colors.error : Colors.warning} 
                />
                <View style={styles.syncText}>
                  <Text style={styles.syncTitle}>
                    {item.method} {item.url.split('/').pop()}
                  </Text>
                  <Text style={styles.syncSub}>
                    {isOffline 
                      ? 'Waiting for internet connection...' 
                      : `Queued at ${new Date(item.timestamp).toLocaleTimeString()}`}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>

        {isOffline && (
          <View style={styles.offlineBanner}>
            <MaterialIcons name="wifi-off" size={16} color={Colors.white} />
            <Text style={styles.offlineText}>You are currently offline</Text>
          </View>
        )}

        <Pressable 
          style={[styles.syncButton, (syncing || isOffline) && styles.syncButtonDisabled]} 
          onPress={handleSyncNow}
          disabled={syncing || isOffline}
        >
          {syncing ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <MaterialIcons name="refresh" size={20} color={Colors.white} />
              <Text style={styles.syncBtnText}>Sync Now</Text>
            </>
          )}
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
  syncText: { flex: 1, marginLeft: 16 },
  syncTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary },
  syncSub: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  emptyQueue: { alignItems: 'center', padding: 32, gap: 8 },
  emptyQueueText: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary },
  emptyQueueSub: { fontSize: 12, color: Colors.textSecondary },
  offlineBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.error, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 12, gap: 8, marginHorizontal: 20, marginBottom: 16 },
  offlineText: { color: Colors.white, fontSize: 12, fontWeight: 'bold' },
  
  syncButton: { margin: 20, backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 8 },
  syncButtonDisabled: { backgroundColor: Colors.border, opacity: 0.5 },
  syncBtnText: { color: Colors.white, fontWeight: 'bold', fontSize: 16 },
});

export default OfflineManagerScreen;
