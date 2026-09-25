import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator, TextInput } from 'react-native';
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
  const [filteredParcels, setFilteredParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Land');

  const [error, setError] = useState<string | null>(null);
  const [sortByPrice, setSortByPrice] = useState(false);

  useEffect(() => {
    fetchMarketplaceParcels();
  }, []);

  const parsePrice = (price?: string | null): number => {
    const n = parseFloat(String(price ?? '').replace(/[^0-9.]/g, ''));
    return isNaN(n) ? 0 : n;
  };

  const isOwnParcel = (parcel: Parcel) =>
    !!user && ((!!parcel.userId && parcel.userId === user.id) || parcel.ownerName === user.name);

  const fetchMarketplaceParcels = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_ENDPOINTS.PARCELS}?status=${encodeURIComponent('For Sale')}`);
      if (!response.ok) throw new Error(`Server responded ${response.status}`);
      const data: Parcel[] = await response.json();
      const listings = (Array.isArray(data) ? data : [])
        .filter(p => p.status === 'For Sale' && !!p.price && !isOwnParcel(p));
      setParcels(listings);
      setFilteredParcels(listings);
    } catch (err: any) {
      console.error("Marketplace fetch error", err);
      setError(err?.message || 'Could not load listings');
      setParcels([]);
      setFilteredParcels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, activeCategory, parcels, sortByPrice]);

  const applyFilters = () => {
    let result = [...parcels];

    if (activeCategory !== 'All Land') {
      result = result.filter(p => p.use?.includes(activeCategory) || p.use === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.upi?.toLowerCase().includes(query) || 
        p.location?.toLowerCase().includes(query) || 
        p.district?.toLowerCase().includes(query)
      );
    }

    if (sortByPrice) {
      result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    }

    setFilteredParcels(result);
  };

  const handleBuy = (parcel: Parcel) => {
    onNavigate('buy-land', { parcel });
  };

  const averagePrice = filteredParcels.length > 0
    ? filteredParcels.reduce((sum, p) => sum + parsePrice(p.price), 0) / filteredParcels.length
    : 0;
  const formatShort = (n: number) =>
    n >= 1e9 ? `${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(0)}K` : n > 0 ? `${Math.round(n)}` : '-';

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Land Marketplace</Text>
        <Pressable style={styles.headerButton} onPress={fetchMarketplaceParcels}>
          <MaterialIcons name="refresh" size={24} color={Colors.primary} />
        </Pressable>
      </View>

      <View style={styles.marketStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{filteredParcels.length}</Text>
          <Text style={styles.statLabel}>Active listings</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{formatShort(averagePrice)}</Text>
          <Text style={styles.statLabel}>Avg Price (RWF)</Text>
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color={Colors.textTertiary} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search area or UPI..."
              placeholderTextColor={Colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <MaterialIcons name="cancel" size={20} color={Colors.textTertiary} />
              </Pressable>
            )}
        </View>
        <Pressable
          style={[styles.filterButton, sortByPrice && { opacity: 0.7 }]}
          onPress={() => setSortByPrice(prev => !prev)}
        >
          <MaterialIcons name={sortByPrice ? 'sort' : 'tune'} size={24} color={Colors.white} />
        </Pressable>
      </View>

      <View style={styles.filterChips}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsContent}>
            {['All Land', 'Residential', 'Agricultural', 'Commercial', 'Industrial'].map((chip) => (
                <Pressable 
                  key={chip} 
                  onPress={() => setActiveCategory(chip)}
                  style={[styles.chip, activeCategory === chip && styles.chipActive]}
                >
                    <Text style={[styles.chipText, activeCategory === chip && styles.chipTextActive]}>{chip}</Text>
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
           {filteredParcels.length > 0 ? filteredParcels.map((parcel, index) => {
             return (
              <Pressable 
                key={parcel.upi || index}
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
                      {parcel.isVerified || parcel.status !== 'Pending Verification' ? "Verified Seller" : "Seller"}
                    </Text>

                    <Pressable 
                      style={styles.buyButton}
                      onPress={() => handleBuy(parcel)}
                    >
                      <Text style={styles.buyButtonText}>Purchase</Text>
                      <MaterialIcons name="shopping-cart" size={16} color={Colors.white} />
                    </Pressable>
                </View>
              </Pressable>
             );
           }) : (
             <View style={styles.emptyContainer}>
                <MaterialIcons name="search-off" size={64} color={Colors.border} />
                <Text style={styles.emptyText}>
                  {error
                    ? `Could not load listings: ${error}`
                    : parcels.length === 0
                      ? 'No land is currently listed for sale.'
                      : 'No land matches your search filters.'}
                </Text>
                {error || parcels.length === 0 ? (
                  <Pressable onPress={fetchMarketplaceParcels} style={styles.resetButton}>
                    <Text style={styles.resetText}>Refresh</Text>
                  </Pressable>
                ) : (
                  <Pressable onPress={() => {setSearchQuery(''); setActiveCategory('All Land');}} style={styles.resetButton}>
                    <Text style={styles.resetText}>Clear All Filters</Text>
                  </Pressable>
                )}
             </View>
           )}
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
    width: 56,
    height: 56,
    backgroundColor: '#FBBF24', // Yellow color from image
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
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
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: 13, paddingVertical: 0 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 80, gap: 16 },
  emptyText: { color: Colors.textSecondary, fontSize: 15, fontWeight: '500' },
  resetButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, backgroundColor: Colors.backgroundLight, borderWidth: 1, borderColor: Colors.border },
  resetText: { color: Colors.primary, fontWeight: 'bold', fontSize: 13 },
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
