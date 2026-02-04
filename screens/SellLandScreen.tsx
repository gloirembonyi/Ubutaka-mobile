import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator, Alert, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, User, Parcel } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SellLandScreenProps {
  onNavigate: (screen: Screen) => void;
  params?: any;
  user?: User | null;
}

const SellLandScreen: React.FC<SellLandScreenProps> = ({ onNavigate, params, user: propUser }) => {
  // If a parcel was passed, start at step 2
  const initialStep = params?.parcel ? 2 : 1;
  const [step, setStep] = useState(initialStep);
  
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(propUser || null);
  const [myParcels, setMyParcels] = useState<Parcel[]>([]);
  
  const [formData, setFormData] = useState({
    selectedParcel: (params?.parcel as Parcel) || null,
    price: '',
    buyerId: '',
    buyerName: '',
  });
  const [saleType, setSaleType] = useState<'marketplace' | 'private'>('marketplace');

  const steps = ['PARCEL', 'DETAILS', 'REVIEW'];

  useEffect(() => {
    loadUserAndParcels();
  }, [propUser]);

  const loadUserAndParcels = async () => {
    try {
      let currentUser = propUser;
      
      if (!currentUser) {
        const savedUser = await AsyncStorage.getItem('user');
        if (savedUser) {
           currentUser = JSON.parse(savedUser);
           setUser(currentUser || null);
        }
      }

      if (currentUser) {
        // Fetch specific parcels from API to ensure fresh list
        // Note: If we passed a parcel, we might not strictly need the full list immediately,
        // but it's good to have if the user goes "Back" to step 1.
        try {
            const resp = await fetch(`${API_ENDPOINTS.PARCELS}?ownerName=${encodeURIComponent(currentUser.name)}`);
            if (resp.ok) {
              const data = await resp.json();
              setMyParcels(data);
            }
        } catch (fetchErr) {
            console.warn("Failed to fetch parcels in Sell screen", fetchErr);
            // If we have a passed parcel, at least show that in the list if fetch fails
            if (params?.parcel) {
                setMyParcels([params.parcel]);
            }
        }
      }
    } catch (e) {
      console.error("Error loading initial data", e);
    }
  };
  const handleSubmit = async () => {
    if (!formData.selectedParcel || !formData.price) {
      Alert.alert("Missing Info", "Please enter a price.");
      return;
    }

    if (saleType === 'private' && !formData.buyerId) {
      Alert.alert("Missing Info", "Please enter Buyer ID for private sale.");
      return;
    }

    setLoading(true);
    try {
      if (saleType === 'marketplace') {
        // List on Marketplace
        // We use the new dynamic route for this: /api/parcels/[upi]
        const response = await fetch(`${API_ENDPOINTS.PARCELS}/${encodeURIComponent(formData.selectedParcel.upi)}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'For Sale',
            price: `${formData.price} RWF`,
            // fees, etc. could be calculated here
          })
        });

        if (response.ok) {
           Alert.alert("Listed!", "Your parcel is now listed on the Marketplace.");
           onNavigate('marketplace');
        } else {
           Alert.alert("Error", "Failed to list parcel.");
        }
      } else {
        // Private Sale (Existing Transaction Logic)
        const response = await fetch(API_ENDPOINTS.TRANSACTIONS, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Sale of Parcel ${formData.selectedParcel.upi}`,
            upi: formData.selectedParcel.upi,
            type: 'SALE',
            status: 'PENDING_NOTARY',
            date: new Date().toISOString(),
            step: 'Notary Verification',
            progress: 20,
            sellerName: user?.name,
            buyerName: formData.buyerId, 
            price: `${formData.price} RWF`
          })
        });

        if (response.ok) {
          Alert.alert("Success", "Smart Transfer Initiated! The buyer and Notary have been notified.");
          onNavigate('dashboard');
        } else {
          Alert.alert("Error", "Failed to initiate transfer.");
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const StepCircle = ({ s, label }: { s: number, label: string }) => (
    <View style={styles.stepHeader}>
      <View style={[styles.stepCircle, step >= s && styles.stepCircleActive]}>
        <Text style={[styles.stepNumber, step >= s && styles.stepNumberActive]}>{s}</Text>
      </View>
      <Text style={[styles.stepLabel, step >= s && styles.stepLabelActive]}>{label}</Text>
    </View>
  );

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => step > 1 ? setStep(step - 1) : onNavigate('dashboard')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Sell Land (Smart Flow)</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.progressContainer}>
        {steps.map((label, idx) => (
          <View key={idx} style={styles.progressStep}>
             <View style={[styles.progressBar, idx + 1 <= step && styles.progressBarActive]} />
          </View>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {step === 1 && (
          <View>
            <StepCircle s={1} label="Select Parcel" />
            <Text style={styles.subtext}>Choose the land parcel you wish to transfer.</Text>
            
            {myParcels.length === 0 ? (
               <Text style={styles.emptyText}>No parcels found.</Text>
            ) : (
              myParcels.map((parcel: Parcel) => (
                <Pressable 
                  key={parcel.upi}
                  style={[styles.parcelCard, formData.selectedParcel?.upi === parcel.upi && styles.parcelCardActive]}
                  onPress={() => setFormData({...formData, selectedParcel: parcel})}
                >
                  <Image source={{ uri: parcel.imageUrl }} style={styles.parcelImage} />
                  <View style={styles.parcelInfo}>
                     <Text style={styles.parcelTitle}>UPI: {parcel.upi}</Text>
                     <Text style={styles.parcelSub}>{parcel.size} • {parcel.location}</Text>
                     <Text style={[styles.parcelSub, {color: parcel.status === 'Verified' ? Colors.success : Colors.accent}]}>{parcel.status}</Text>
                  </View>
                  <View style={styles.radio}>
                     {formData.selectedParcel?.upi === parcel.upi && <View style={styles.radioInner} />}
                  </View>
                </Pressable>
              ))
            )}
            
            <View style={{ height: 100 }} />
          </View>
        )}

        {step === 2 && (
          <View>
            <StepCircle s={2} label="Sale Details" />
            
            {/* Sale Type Selector */}
            <View style={styles.typeSelector}>
                <Pressable 
                    style={[styles.typeOption, saleType === 'marketplace' && styles.typeOptionActive]}
                    onPress={() => setSaleType('marketplace')}
                >
                    <MaterialIcons name="storefront" size={24} color={saleType === 'marketplace' ? Colors.primary : Colors.textTertiary} />
                    <Text style={[styles.typeText, saleType === 'marketplace' && styles.typeTextActive]}>List on Marketplace</Text>
                </Pressable>
                <Pressable 
                    style={[styles.typeOption, saleType === 'private' && styles.typeOptionActive]}
                    onPress={() => setSaleType('private')}
                >
                    <MaterialIcons name="person" size={24} color={saleType === 'private' ? Colors.primary : Colors.textTertiary} />
                    <Text style={[styles.typeText, saleType === 'private' && styles.typeTextActive]}>Private Sale</Text>
                </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>SALE PRICE (RWF)</Text>
              <TextInput 
                style={styles.input}
                placeholder="e.g. 15,000,000"
                keyboardType="numeric"
                value={formData.price}
                onChangeText={(t: string) => setFormData({...formData, price: t})}
              />
            </View>

            {saleType === 'private' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>BUYER NATIONAL ID</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="1 1990 8 0000 000 0 00"
                    keyboardType="numeric"
                    value={formData.buyerId}
                    onChangeText={(t: string) => setFormData({...formData, buyerId: t})}
                  />
                </View>
            )}

            <View style={styles.infoBox}>
              <MaterialIcons name="info" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>
                {saleType === 'marketplace' 
                    ? "Your parcel will be listed publicly on the marketplace. Buyers can send offers directly." 
                    : "The buyer will be notified to accept the price. Once accepted, the smart contract will lock the process."}
              </Text>
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <StepCircle s={3} label="Review & Confirm" />
            
            <View style={styles.summaryCard}>
               <Text style={styles.summaryTitle}>Transaction Summary</Text>
               
               <View style={styles.summaryRow}>
                 <Text style={styles.summaryLabel}>Type</Text>
                 <Text style={styles.summaryValue}>{saleType === 'marketplace' ? 'Public Listing' : 'Private Sale'}</Text>
               </View>
               <View style={styles.summaryRow}>
                 <Text style={styles.summaryLabel}>Property</Text>
                 <Text style={styles.summaryValue}>{formData.selectedParcel?.upi}</Text>
               </View>
               <View style={styles.summaryRow}>
                 <Text style={styles.summaryLabel}>Sale Price</Text>
                 <Text style={styles.summaryValue}>{formData.price} RWF</Text>
               </View>
               {saleType === 'private' && (
                 <View style={styles.summaryRow}>
                   <Text style={styles.summaryLabel}>Buyer ID</Text>
                   <Text style={styles.summaryValue}>{formData.buyerId}</Text>
                 </View>
               )}
               <View style={styles.summaryRow}>
                 <Text style={styles.summaryLabel}>Listing Fee</Text>
                 <Text style={styles.summaryValue}>5,000 RWF</Text>
               </View>
            </View>

            <View style={styles.blockchainPreview}>
               <MaterialIcons name="link" size={24} color={Colors.white} />
               <View>
                 <Text style={styles.blockchainTitle}>Blockchain Record Preview</Text>
                 <Text style={styles.blockchainHash}>
                   Next Block: #89210 • Hash: 0x8f...2a9
                 </Text>
               </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step < 3 ? (
           <Pressable 
             style={[styles.button, (!formData.selectedParcel && step === 1) && styles.buttonDisabled]} 
             disabled={!formData.selectedParcel && step === 1}
             onPress={() => setStep(step + 1)}
           >
             <Text style={styles.buttonText}>Continue</Text>
             <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />
           </Pressable>
        ) : (
           <Pressable style={styles.button} onPress={handleSubmit}>
             {loading ? <ActivityIndicator color={Colors.white} /> : (
               <>
                 <Text style={styles.buttonText}>{saleType === 'marketplace' ? 'List Land' : 'Initiate Transfer'}</Text>
                 <MaterialIcons name={saleType === 'marketplace' ? "store" : "fingerprint"} size={20} color={Colors.white} />
               </>
             )}
           </Pressable>
        )}
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
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  backButton: { padding: 8 },
  content: { padding: 20 },
  progressContainer: { flexDirection: 'row', gap: 4, paddingHorizontal: 20, paddingTop: 20 },
  progressStep: { flex: 1, height: 4, backgroundColor: Colors.borderLight, borderRadius: 2 },
  progressBar: { flex: 1, backgroundColor: 'transparent', borderRadius: 2 },
  progressBarActive: { backgroundColor: Colors.primary },
  
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24, paddingVertical: 10 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.borderLight },
  stepCircleActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  stepNumber: { fontSize: 14, fontWeight: 'bold', color: Colors.textSecondary },
  stepNumberActive: { color: Colors.white },
  stepLabel: { fontSize: 18, fontWeight: 'bold', color: Colors.textSecondary },
  stepLabelActive: { color: Colors.textPrimary },
  subtext: { color: Colors.textSecondary, marginBottom: 20 },

  typeSelector: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  typeOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.borderLight, backgroundColor: Colors.white },
  typeOptionActive: { borderColor: Colors.primary, backgroundColor: '#F0FDF4' },
  typeText: { fontSize: 13, fontWeight: 'bold', color: Colors.textTertiary },
  typeTextActive: { color: Colors.primary },

  parcelCard: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: Colors.borderLight, borderRadius: 12, marginBottom: 12, backgroundColor: Colors.white },
  parcelCardActive: { borderColor: Colors.primary, backgroundColor: '#F0FDF4' },
  parcelImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  parcelInfo: { flex: 1 },
  parcelTitle: { fontWeight: 'bold', color: Colors.textPrimary },
  parcelSub: { fontSize: 12, color: Colors.textSecondary },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.borderLight, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: 'bold', color: Colors.textSecondary, marginBottom: 8 },
  input: { backgroundColor: Colors.background, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.borderLight, fontSize: 16 },
  
  infoBox: { flexDirection: 'row', gap: 12, backgroundColor: '#EFF6FF', padding: 16, borderRadius: 12, alignItems: 'center' },
  infoText: { flex: 1, fontSize: 12, color: '#1E40AF', lineHeight: 18 },

  summaryCard: { backgroundColor: Colors.background, padding: 20, borderRadius: 16, marginBottom: 20 },
  summaryTitle: { fontWeight: 'bold', marginBottom: 16, fontSize: 16 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { color: Colors.textSecondary },
  summaryValue: { fontWeight: 'bold', color: Colors.textPrimary },

  blockchainPreview: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: '#1E293B', padding: 16, borderRadius: 16 },
  blockchainTitle: { color: '#94A3B8', fontSize: 12, fontWeight: 'bold' },
  blockchainHash: { color: Colors.white, fontWeight: 'bold', fontFamily: 'monospace' },

  footer: { padding: 20, paddingBottom: 40, borderTopWidth: 1, borderTopColor: Colors.borderLight },
  button: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, gap: 8 },
  buttonDisabled: { backgroundColor: Colors.textTertiary },
  buttonText: { color: Colors.white, fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', color: Colors.textSecondary, marginTop: 40 },
});

export default SellLandScreen;
