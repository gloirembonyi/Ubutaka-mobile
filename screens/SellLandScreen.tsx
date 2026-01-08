
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface SellLandScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SellLandScreen: React.FC<SellLandScreenProps> = ({ onNavigate }) => {
  const [selectedParcel, setSelectedParcel] = useState(0);
  const [price, setPrice] = useState('');

  const myParcels = [
    { upi: '5/03/12/04/111', district: 'Gasabo', type: 'Residential', size: '2,500 sqm' },
    { upi: '2/04/08/01/205', district: 'Kicukiro', type: 'Agricultural', size: '5,800 sqm' }
  ];

  return (
    <View style={GlobalStyles.container}>
      <SafeAreaView edges={['top']} style={GlobalStyles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Initiate Sale</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.intro}>
            <Text style={styles.title}>Details & Pricing</Text>
            <Text style={styles.subtitle}>Select a parcel and set your terms. Your listing will be verified before going live.</Text>
          </View>

          {/* Parcel Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>1. SELECT PROPERTY</Text>
              <Pressable><Text style={styles.viewMapText}>View Map</Text></Pressable>
            </View>

            {myParcels.map((parcel, idx) => (
              <Pressable 
                key={idx}
                onPress={() => setSelectedParcel(idx)}
                style={[
                  styles.parcelOption,
                  selectedParcel === idx && styles.parcelOptionSelected
                ]}
              >
                <View style={styles.parcelOptionTop}>
                  <View style={styles.badgeRow}>
                    <MaterialIcons 
                      name="verified" 
                      size={16} 
                      color={selectedParcel === idx ? Colors.primary : Colors.textTertiary} 
                    />
                    <View style={styles.districtBadge}>
                      <Text style={styles.districtText}>{parcel.district}</Text>
                    </View>
                  </View>
                  <View style={[
                    styles.radio,
                    selectedParcel === idx && styles.radioActive
                  ]}>
                    {selectedParcel === idx && <View style={styles.radioInner} />}
                  </View>
                </View>
                
                <Text style={styles.parcelUpi}>UPI: {parcel.upi}</Text>
                <Text style={styles.parcelSub}>{parcel.type} • {parcel.size}</Text>
              </Pressable>
            ))}
          </View>

          {/* Asking Price */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. ASKING PRICE</Text>
            
            <View style={styles.priceInputRow}>
              <View style={styles.currencySelect}>
                <Text style={styles.currencyText}>RWF</Text>
                <MaterialIcons name="expand-more" size={20} color={Colors.textSecondary} />
              </View>
              <TextInput 
                style={styles.priceInput}
                placeholder="e.g. 15,000,000"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={styles.marketInfo}>
              <MaterialIcons name="bar-chart" size={16} color={Colors.primary} />
              <Text style={styles.marketInfoText}>
                Market average for residential plots in {myParcels[selectedParcel].district} is currently <Text style={styles.boldText}>~8,500 RWF/sqm</Text>.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable 
            onPress={() => onNavigate('verification')}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>List for Sale</Text>
            <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />
          </Pressable>
          <Pressable style={styles.draftButton}>
            <Text style={styles.draftButtonText}>Save Draft</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 20, fontWeight: '900', color: '#1B3C53' },
  scrollContent: {
    padding: 24,
    gap: 32,
    paddingBottom: 200,
  },
  intro: {
    gap: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1B3C53',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#64748B',
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1B3C53',
    letterSpacing: 0.5,
  },
  viewMapText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  parcelOption: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    gap: 8,
  },
  parcelOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.02),
  },
  parcelOptionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  districtBadge: {
    backgroundColor: getColorWithOpacity(Colors.primary, 0.1),
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  districtText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  parcelUpi: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1B3C53',
  },
  parcelSub: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  priceInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  currencySelect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1B3C53',
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '600',
    color: '#1B3C53',
  },
  marketInfo: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    gap: 12,
    alignItems: 'center',
  },
  marketInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1B3C53',
  },
  footer: {
    position: 'absolute',
    bottom: 85,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: Colors.white,
    gap: 16,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  draftButton: {
    alignItems: 'center',
    paddingBottom: 8,
  },
  draftButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B3C53',
  },
});

export default SellLandScreen;
