import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Parcel } from '../types';
import { Colors } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';

interface MarketplaceScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  user: any; // Using any to avoid import circles if User type issue, but preferably User
}

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ onNavigate, user }) => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock available parcels for demo
  const MOCK_MARKET: Parcel[] = [
    {
      upi: "5/03/12/05/991",
      size: "800 sqm",
      use: "Residential (R2)",
      district: "Kicukiro",
      location: "Niboye",
      status: "Verified",
      ownerName: "KALISA Peter",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      price: "12,000,000 RWF",
      isVerified: true,
      verifiedAt: new Date().toISOString()
    },
    {
       upi: "2/01/08/04/442",
       size: "5 Hectares",
       use: "Agricultural",
       district: "Rwamagana",
       location: "Karenge",
       status: "Verified",
       ownerName: "MUKAMANA Sarah",
       imageUrl: "https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
       price: "45,000,000 RWF",
       isVerified: true,
       verifiedAt: new Date().toISOString()
    }
  ];

  useEffect(() => {
    fetchMarketplaceParcels();
  }, []);

  const fetchMarketplaceParcels = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.PARCELS}?status=For Sale`);
      if (response.ok) {
        const data = await response.json();
        setParcels(data);
      } else {
        // Fallback or error handling
        setParcels(MOCK_MARKET);
      }
    } catch (error) {
       console.error("Marketplace fetch error", error);
       setParcels(MOCK_MARKET);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = (parcel: Parcel) => {
    onNavigate('buy-land', { parcel });
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Land Marketplace</Text>
        <Pressable style={styles.headerButton}>
          <MaterialIcons name="filter-list" size={24} color={Colors.primary} />
        </Pressable>
      </View>

      <View style={styles.marketStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{parcels.length}</Text>
          <Text style={styles.statLabel}>Active listings</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>~2.4M</Text>
          <Text style={styles.statLabel}>Avg Price (RWF)</Text>
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
            <MaterialIcons name="search" size={20} color={Colors.textTertiary} />
            <Text style={styles.searchText}>Search area or UPI...</Text>
        </View>
        <Pressable style={styles.filterButton}>
          <MaterialIcons name="tune" size={20} color={Colors.white} />
        </Pressable>
      </View>

      <View style={styles.filterChips}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContent}>
            {['All Land', 'Residential', 'Agricultural', 'Commercial', 'Industrial'].map((chip, i) => (
                <Pressable key={chip} style={[styles.chip, i === 0 && styles.chipActive]}>
                    <Text style={[styles.chipText, i === 0 && styles.chipTextActive]}>{chip}</Text>
                </Pressable>
            ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
           <ActivityIndicator size="large" color={Colors.primary} />
           <Text style={styles.loadingText}>Finding available land...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
           {parcels.map((parcel, index) => {
             const isOwner = user?.name === parcel.ownerName;
             
             return (
              <Pressable 
                key={index}
                style={styles.card}
                onPress={() => onNavigate('parcel-details', { parcel })}
              >
                <Image source={{ uri: parcel.imageUrl }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardPrice}>{parcel.price}</Text>
                      {(parcel.isVerified || parcel.status === 'Verified') && (
                        <View style={styles.verifiedBadge}>
                          <MaterialIcons name="verified" size={12} color={Colors.white} />
                          <Text style={styles.verifiedText}>Verified</Text>
                        </View>
                      )}
                    </View>
                    
                    <Text style={styles.cardLocation}>{parcel.district}, {parcel.location}</Text>
                    <Text style={styles.cardDetails}>{parcel.size} • {parcel.use}</Text>
                    
                    {/* Hide sensitive info */}
                    <Text style={styles.cardOwner}>
                      {isOwner ? "Owned by Me" : "Verified Seller"}
                    </Text>

                    {isOwner ? (
                       <View style={[styles.buyButton, { backgroundColor: Colors.border }]}>
                         <Text style={styles.buyButtonText}>Your Listing</Text>
                         <MaterialIcons name="edit" size={16} color={Colors.white} />
                       </View>
                    ) : (
                      <Pressable 
                        style={styles.buyButton}
                        onPress={() => handleBuy(parcel)}
                      >
                        <Text style={styles.buyButtonText}>Purchase</Text>
                        <MaterialIcons name="shopping-cart" size={16} color={Colors.white} />
                      </Pressable>
                    )}
                </View>
              </Pressable>
             );
           })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  backButton: { width: 40, alignItems: 'center' },
  headerButton: { width: 40, alignItems: 'center' },
  marketStats: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  searchSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 16,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChips: {
    marginTop: 16,
  },
  chipsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.white,
  },
  searchText: { color: Colors.textTertiary, fontSize: 13 },
  content: { padding: 16, gap: 16, paddingBottom: 160 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: Colors.textSecondary },
  
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImage: { width: '100%', height: 200 },
  cardContent: { padding: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardPrice: { fontSize: 22, fontWeight: '900', color: Colors.primary },
  verifiedBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: Colors.success, 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 12, 
    gap: 4 
  },
  verifiedText: { color: Colors.white, fontSize: 10, fontWeight: 'bold' },
  
  cardLocation: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginBottom: 4 },
  cardDetails: { fontSize: 14, color: Colors.textSecondary, marginBottom: 12 },
  cardOwner: { 
    fontSize: 12, 
    color: Colors.textTertiary, 
    marginBottom: 20,
    backgroundColor: Colors.backgroundLight,
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start'
  },
  
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 16,
    gap: 10,
  },
  buyButtonText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
});

export default MarketplaceScreen;
