
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { MOCK_PARCELS } from '../constants';

interface ParcelDetailScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ParcelDetailScreen: React.FC<ParcelDetailScreenProps> = ({ onNavigate }) => {
  const [viewMode, setViewMode] = useState<'image' | 'map'>('image');
  const parcel = MOCK_PARCELS[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dashboard')} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.headerTitle}>My Parcel</Text>
        <Pressable style={styles.headerButton}>
          <MaterialIcons name="share" size={24} color="#1e293b" />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.toggleContainer}>
          <Pressable
            onPress={() => setViewMode('image')}
            style={[styles.toggleButton, viewMode === 'image' && styles.toggleButtonActive]}
          >
            <MaterialIcons name="image" size={16} color={viewMode === 'image' ? '#3b82f6' : '#94a3b8'} />
            <Text style={[styles.toggleText, viewMode === 'image' && styles.toggleTextActive]}>Image</Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('map')}
            style={[styles.toggleButton, viewMode === 'map' && styles.toggleButtonActive]}
          >
            <MaterialIcons name="map" size={16} color={viewMode === 'map' ? '#3b82f6' : '#94a3b8'} />
            <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>Map View</Text>
          </Pressable>
        </View>

        <View style={styles.mediaContainer}>
          {viewMode === 'image' ? (
            <Image source={{ uri: parcel.imageUrl }} style={styles.mediaImage} resizeMode="cover" />
          ) : (
            <View style={styles.mapPlaceholder}>
              <MaterialIcons name="map" size={48} color="#cbd5e1" />
              <Text style={styles.mapText}>Map View</Text>
            </View>
          )}
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified-user" size={18} color="#3b82f6" />
            <Text style={styles.verifiedText}>Registered & Secure</Text>
          </View>
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsLabel}>Unique Parcel Identifier (UPI)</Text>
            <MaterialIcons name="lock" size={16} color="#3b82f6" />
          </View>
          <Text style={styles.upi}>{parcel.upi}</Text>
          <View style={styles.blockchainBadge}>
            <Text style={styles.blockchainText}>Blockchain Verified</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <MaterialIcons name="square-foot" size={20} color="#64748b" />
            <Text style={styles.statLabel}>Size</Text>
            <Text style={styles.statValue}>{parcel.size}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="home-work" size={20} color="#64748b" />
            <Text style={styles.statLabel}>Use</Text>
            <Text style={styles.statValue}>{parcel.use}</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialIcons name="location-city" size={20} color="#64748b" />
            <Text style={styles.statLabel}>District</Text>
            <Text style={styles.statValue}>{parcel.district}</Text>
          </View>
        </View>

        <Pressable style={styles.downloadButton}>
          <MaterialIcons name="download" size={20} color="#ffffff" />
          <Text style={styles.downloadText}>Download Title Deed</Text>
        </Pressable>

        <Pressable
          onPress={() => onNavigate('report-anomaly')}
          style={styles.anomalyCard}
        >
          <View style={styles.anomalyIcon}>
            <MaterialIcons name="report-problem" size={32} color="#d97706" />
          </View>
          <View style={styles.anomalyContent}>
            <Text style={styles.anomalyTitle}>Data Discrepancy?</Text>
            <Text style={styles.anomalyText}>
              If boundary markers or owner information appears incorrect, report an anomaly to the Land Registry.
            </Text>
            <Pressable style={styles.anomalyButton}>
              <Text style={styles.anomalyButtonText}>Start Report</Text>
            </Pressable>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
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
    color: '#0f172a',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
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
    backgroundColor: '#ffffff',
  },
  toggleText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  toggleTextActive: {
    color: '#3b82f6',
  },
  mediaContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
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
    backgroundColor: '#f8fafc',
  },
  mapText: {
    marginTop: 8,
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3b82f6',
    textTransform: 'uppercase',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
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
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  upi: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 1,
  },
  blockchainBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  blockchainText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 8,
  },
  statLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  anomalyCard: {
    flexDirection: 'row',
    backgroundColor: '#fffbeb',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#fef3c7',
    gap: 20,
  },
  anomalyIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#fef3c7',
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
    color: '#0f172a',
  },
  anomalyText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  anomalyButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
    marginTop: 8,
  },
  anomalyButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d97706',
  },
});

export default ParcelDetailScreen;
