import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, Parcel } from '../types';
import { Colors as AppColors } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SyncService from '../services/SyncService';

interface BuyLandScreenProps {
  onNavigate: (screen: Screen) => void;
  // params should be injected by the navigator in App.tsx but simplified here for direct access via params prop in App.tsx
  // We'll rely on global user state context in a real app, here we fetch from storage
}

// Mocking params injection via navigation wrapper
// For now assuming we have access to the parcel via some global state or passed props if refactored
// But simpler to just use what we have. 
// I will assume the parent passes 'params.parcel' which we can access if we typed it.

const BuyLandScreen: React.FC<any> = ({ onNavigate, params }) => {
  const parcel = params?.parcel as Parcel;
  const [loading, setLoading] = useState(false);

  if (!parcel) {
      return (
          <View style={[GlobalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
              <Text>No parcel selected</Text>
              <Pressable onPress={() => onNavigate('marketplace')}><Text style={{color: AppColors.primary}}>Go Back</Text></Pressable>
          </View>
      )
  }

  const handlePurchase = async () => {
    setLoading(true);
    try {
        const userStr = await AsyncStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;

        const payload = {
          title: `Purchase of ${parcel.upi}`,
          upi: parcel.upi,
          type: 'SALE',
          status: 'PENDING_SELLER_APPROVAL',
          date: new Date().toISOString(),
          step: 'Awaiting Seller Approval',
          progress: 20,
          sellerName: parcel.ownerName,
          buyerName: user?.name || "Me",
          price: parcel.price
        };

        const response = await SyncService.fetchWithSync(API_ENDPOINTS.TRANSACTIONS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }) as any;
          
        if (response.ok) {
            // Also mark the parcel as pending sale so it's removed from marketplace
            if (!response.queued) {
                try {
                    await fetch(`${API_ENDPOINTS.PARCELS}/${encodeURIComponent(parcel.upi)}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ status: 'Pending Sale' })
                    });
                } catch(err) {
                    console.log("Failed to update parcel status", err);
                }
            }

            Alert.alert(
                response.queued ? "Offline Mode" : "Offer Submitted", 
                response.queued 
                    ? "You are currently offline. Your purchase offer has been saved and will be sent automatically when you have signal."
                    : "Your purchase offer has been sent to the seller. Once the seller approves, you'll be able to proceed with payment."
            );
            onNavigate('dashboard');
        } else {
            Alert.alert("Error", "Could not submit offer.");
        }
    } catch (e) {
        Alert.alert("Error", "Network error");
    } finally {
        setLoading(false);
    }
  }

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('marketplace')} style={styles.backButton}>
          <MaterialIcons name="close" size={24} color={AppColors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Confirm Purchase</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 150 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: parcel.imageUrl }} style={styles.image} />
          <View style={styles.imageOverlay}>
              <View style={styles.priceBadge}>
                <Text style={styles.priceBadgeText}>{parcel.price}</Text>
              </View>
          </View>
        </View>
        
        <View style={styles.detailsCard}>
           <View style={styles.detailsHeader}>
             <Text style={styles.upiLabel}>UPI: {parcel.upi}</Text>
             <View style={styles.idBadge}>
               <Text style={styles.idBadgeText}>REGISTERED</Text>
             </View>
           </View>
           
           <Text style={styles.priceMain}>{parcel.price}</Text>
           
           <View style={styles.divider} />
           
           <View style={styles.infoGrid}>
             <View style={styles.infoItem}>
                 <Text style={styles.label}>Location</Text>
                 <Text style={styles.value} numberOfLines={1}>{parcel.district}, {parcel.location}</Text>
             </View>
             <View style={styles.infoItem}>
                 <Text style={styles.label}>Size</Text>
                 <Text style={styles.value}>{parcel.size}</Text>
             </View>
             <View style={styles.infoItem}>
                 <Text style={styles.label}>Seller</Text>
                 <Text style={[styles.value, { color: AppColors.success }]}>Verified Seller</Text>
             </View>
           </View>
           
           <Pressable 
                style={styles.historyBtn}
                onPress={() => onNavigate('parcel-details', { parcel: parcel })}
           >
                <MaterialIcons name="history" size={20} color={AppColors.primary} />
                <Text style={styles.historyBtnText}>Check Ownership History & Disputes</Text>
                <MaterialIcons name="chevron-right" size={18} color={AppColors.primary} />
           </Pressable>
        </View>

        <View style={styles.trustCard}>
            <View style={styles.trustHeader}>
              <MaterialIcons name="security" size={28} color={AppColors.success} />
              <Text style={styles.trustTitle}>Blockchain Secured</Text>
            </View>
            <Text style={styles.trustText}>
                Your purchase offer will be immutably recorded. Transfer of title happens automatically upon final notary and seller verification.
            </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
         <Pressable style={styles.button} onPress={handlePurchase} disabled={loading}>
            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Confirm Purchase Offer</Text>}
         </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      backgroundColor: AppColors.white,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  backButton: { padding: 4 },
  content: { padding: 20 },
  imageContainer: {
    width: '100%',
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  image: { width: '100%', height: '100%' },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  priceBadge: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  priceBadgeText: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailsCard: {
      backgroundColor: AppColors.white,
      padding: 24,
      borderRadius: 24,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: '#F1F5F9',
      marginBottom: 20
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  upiLabel: { fontSize: 13, color: AppColors.textTertiary, fontWeight: '600' },
  idBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  idBadgeText: { fontSize: 9, fontWeight: 'bold', color: AppColors.textSecondary },
  priceMain: { fontSize: 28, fontWeight: '900', color: AppColors.primary, marginBottom: 20 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 20 },
  infoGrid: { gap: 16 },
  infoItem: { gap: 4 },
  label: { color: AppColors.textTertiary, fontSize: 12, fontWeight: '500' },
  value: { fontWeight: '700', color: AppColors.textPrimary, fontSize: 15 },
  historyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      padding: 16,
      backgroundColor: '#F8FAFC',
      borderRadius: 16,
      marginTop: 24,
      borderWidth: 1,
      borderColor: '#E2E8F0',
  },
  historyBtnText: {
      color: AppColors.primary,
      fontWeight: 'bold',
      fontSize: 14,
      flex: 1,
  },
  
  trustCard: {
      backgroundColor: '#F0FDF4',
      padding: 24,
      borderRadius: 24,
      gap: 12,
      borderWidth: 1,
      borderColor: '#DCFCE7',
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trustTitle: { fontSize: 17, fontWeight: 'bold', color: '#166534' },
  trustText: { color: '#166534', fontSize: 14, lineHeight: 22 },
  
  footer: { 
    padding: 20, 
    paddingBottom: 40, 
    backgroundColor: AppColors.white, 
    borderTopWidth: 1, 
    borderColor: '#F1F5F9' 
  },
  button: {
      backgroundColor: AppColors.primary,
      padding: 18,
      borderRadius: 20,
      alignItems: 'center',
      shadowColor: AppColors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 6,
  },
  buttonText: { color: '#FFF', fontWeight: '800', fontSize: 17 }
});

export default BuyLandScreen;
