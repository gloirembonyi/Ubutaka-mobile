import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Parcel } from '../types';
import { Colors } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';

interface MarketplaceScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
}

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ onNavigate }) => {
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
    // In real app, fetch from API where status='For Sale'
    setTimeout(() => {
        setParcels(MOCK_MARKET);
        setLoading(false);
    }, 1000);
  }, []);

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

      <View style={styles.searchBar}>
        <MaterialIcons name="search" size={20} color={Colors.textTertiary} />
        <Text style={styles.searchText}>Search by location, size, or price...</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
           <ActivityIndicator size="large" color={Colors.primary} />
           <Text style={styles.loadingText}>Finding available land...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
           {parcels.map((parcel, index) => (
             <Pressable 
               key={index}
               style={styles.card}
               onPress={() => onNavigate('parcel-details', { parcel })}
             >
               <Image source={{ uri: parcel.imageUrl }} style={styles.cardImage} />
               <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardPrice}>{parcel.price}</Text>
                    {parcel.isVerified && (
                      <View style={styles.verifiedBadge}>
                        <MaterialIcons name="verified" size={12} color={Colors.white} />
                        <Text style={styles.verifiedText}>Verified</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.cardLocation}>{parcel.district}, {parcel.location}</Text>
                  <Text style={styles.cardDetails}>{parcel.size} • {parcel.use}</Text>
                  <Text style={styles.cardOwner}>Owned by {parcel.ownerName}</Text>

                  <Pressable 
                    style={styles.buyButton}
                    onPress={() => handleBuy(parcel)}
                  >
                    <Text style={styles.buyButtonText}>Purchase</Text>
                    <MaterialIcons name="shopping-cart" size={16} color={Colors.white} />
                  </Pressable>
               </View>
             </Pressable>
           ))}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    margin: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
  },
  searchText: { color: Colors.textTertiary },
  content: { padding: 16, gap: 16, paddingBottom: 160 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 12, color: Colors.textSecondary },
  
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardImage: { width: '100%', height: 180 },
  cardContent: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  cardPrice: { fontSize: 20, fontWeight: '900', color: Colors.primary },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.success, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  verifiedText: { color: Colors.white, fontSize: 10, fontWeight: 'bold' },
  
  cardLocation: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
  cardDetails: { fontSize: 14, color: Colors.textSecondary, marginBottom: 8 },
  cardOwner: { fontSize: 12, color: Colors.textTertiary, marginBottom: 16 },
  
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  buyButtonText: { color: Colors.white, fontWeight: 'bold', fontSize: 14 },
});

export default MarketplaceScreen;
