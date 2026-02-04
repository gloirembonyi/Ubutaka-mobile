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
          status: 'PENDING_PAYMENT',
          date: new Date().toISOString(),
          step: 'Payment Verification',
          progress: 40,
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
                    : "The seller has been notified. Please proceed to payment."
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

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 150 }]}>
        <Image source={{ uri: parcel.imageUrl }} style={styles.image} />
        
        <View style={styles.detailsCard}>
           <Text style={styles.upi}>UPI: {parcel.upi}</Text>
           <Text style={styles.price}>{parcel.price}</Text>
           
           <View style={styles.divider} />
           
           <View style={styles.row}>
               <Text style={styles.label}>Location</Text>
               <Text style={styles.value}>{parcel.district}, {parcel.location}</Text>
           </View>
           <View style={styles.row}>
               <Text style={styles.label}>Size</Text>
               <Text style={styles.value}>{parcel.size}</Text>
           </View>
           <View style={styles.row}>
               <Text style={styles.label}>Seller</Text>
               <Text style={styles.value}>Verified Seller (Hidden)</Text>
           </View>
           
           <Pressable 
                style={styles.historyBtn}
                onPress={() => onNavigate('parcel-detail', { parcelData: parcel })}
           >
                <MaterialIcons name="history" size={18} color={AppColors.primary} />
                <Text style={styles.historyBtnText}>Check Ownership History & Disputes</Text>
           </Pressable>
        </View>

        <View style={styles.trustCard}>
            <MaterialIcons name="security" size={32} color={AppColors.success} />
            <Text style={styles.trustTitle}>Blockchain Secured</Text>
            <Text style={styles.trustText}>
                This transaction will be immutably recorded on the Ubutaka Blockchain. Ownership transfer is guaranteed upon payment.
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
  image: { width: '100%', height: 200, borderRadius: 16, marginBottom: 20 },
  detailsCard: {
      backgroundColor: AppColors.white,
      padding: 20,
      borderRadius: 16,
      elevation: 2,
      marginBottom: 20
  },
  upi: { fontSize: 14, color: AppColors.textSecondary, marginBottom: 4 },
  price: { fontSize: 24, fontWeight: 'bold', color: AppColors.primary, marginBottom: 16 },
  divider: { height: 1, backgroundColor: AppColors.borderLight, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { color: AppColors.textSecondary },
  value: { fontWeight: 'bold', color: AppColors.textPrimary },
  historyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      padding: 12,
      backgroundColor: '#F1F5F9',
      borderRadius: 12,
      marginTop: 20
  },
  historyBtnText: {
      color: AppColors.primary,
      fontWeight: 'bold',
      fontSize: 13
  },
  
  trustCard: {
      backgroundColor: '#F0FDF4',
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
      gap: 12,
      borderWidth: 1,
      borderColor: AppColors.success
  },
  trustTitle: { fontSize: 16, fontWeight: 'bold', color: AppColors.success },
  trustText: { textAlign: 'center', color: '#166534', fontSize: 13, lineHeight: 20 },
  
  footer: { padding: 20, paddingBottom: 40, backgroundColor: AppColors.white, borderTopWidth: 1, borderColor: AppColors.borderLight },
  button: {
      backgroundColor: AppColors.primary,
      padding: 16,
      borderRadius: 16,
      alignItems: 'center'
  },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default BuyLandScreen;
