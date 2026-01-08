
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { MOCK_PARCELS } from '../constants';

interface MarketplaceScreenProps {
  onNavigate: (screen: Screen) => void;
}

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable style={styles.headerButton}>
            <MaterialIcons name="sort" size={24} color="#475569" />
          </Pressable>
          <View style={styles.headerTitle}>
            <MaterialIcons name="landscape" size={24} color="#3b82f6" />
            <Text style={styles.headerTitleText}>Land Market</Text>
          </View>
          <Pressable style={styles.headerButton}>
            <MaterialIcons name="filter-list" size={24} color="#475569" />
          </Pressable>
        </View>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#cbd5e1" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Districts, UPI..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Available Parcels</Text>
            <Text style={styles.sectionCount}>128 Results</Text>
          </View>

          {MOCK_PARCELS.map((parcel, idx) => (
            <Pressable
              key={idx}
              onPress={() => onNavigate('buy-land')}
              style={({ pressed }) => [
                styles.parcelCard,
                pressed && styles.pressed
              ]}
            >
              <View style={styles.parcelImageContainer}>
                <Image source={{ uri: parcel.imageUrl }} style={styles.parcelImage} resizeMode="cover" />
                <View style={styles.parcelOverlay} />
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={14} color="#3b82f6" />
                  <Text style={styles.verifiedText}>Registry Verified</Text>
                </View>
              </View>
              <View style={styles.parcelInfo}>
                <Text style={styles.parcelLocation}>{parcel.location}</Text>
                <Text style={styles.parcelDetails}>UPI: {parcel.upi} • {parcel.size}</Text>
                <Text style={styles.parcelPrice}>RWF {parcel.price}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  searchContainer: {
    position: 'relative',
    paddingHorizontal: 20,
  },
  searchIcon: {
    position: 'absolute',
    left: 28,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    width: '100%',
    paddingLeft: 40,
    paddingRight: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  section: {
    gap: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#cbd5e1',
  },
  parcelCard: {
    backgroundColor: '#ffffff',
    borderRadius: 40,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f8fafc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginBottom: 16,
  },
  parcelImageContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 16,
  },
  parcelImage: {
    width: '100%',
    height: '100%',
  },
  parcelOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  parcelInfo: {
    gap: 4,
  },
  parcelLocation: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  parcelDetails: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  parcelPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginTop: 4,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

export default MarketplaceScreen;
