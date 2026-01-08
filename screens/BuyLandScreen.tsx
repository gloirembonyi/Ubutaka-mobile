
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { MOCK_PARCELS } from '../constants';

interface BuyLandScreenProps {
  onNavigate: (screen: Screen) => void;
}

const BuyLandScreen: React.FC<BuyLandScreenProps> = ({ onNavigate }) => {
  const [agreed, setAgreed] = useState(false);
  const parcel = MOCK_PARCELS[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('marketplace')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.headerTitle}>Confirm Purchase</Text>
      </View>
      <View style={styles.content}>
        <Image source={{ uri: parcel.imageUrl }} style={styles.image} resizeMode="cover" />
        <Text style={styles.title}>{parcel.location} Parcel</Text>
        <Text style={styles.details}>UPI: {parcel.upi} • {parcel.size}</Text>
        <View style={styles.priceCard}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.price}>RWF {parcel.price}</Text>
        </View>
        <Pressable style={styles.checkbox} onPress={() => setAgreed(!agreed)}>
          <MaterialIcons name={agreed ? 'check-box' : 'check-box-outline-blank'} size={24} color={agreed ? '#3b82f6' : '#94a3b8'} />
          <Text style={styles.checkboxText}>I agree to the terms and conditions</Text>
        </Pressable>
        <Pressable style={[styles.button, !agreed && styles.buttonDisabled]}>
          <Text style={styles.buttonText}>Complete Purchase</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#0f172a', textAlign: 'center', marginRight: 40 },
  content: { padding: 24, gap: 16 },
  image: { width: '100%', aspectRatio: 16 / 9, borderRadius: 16, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  details: { fontSize: 14, color: '#64748b' },
  priceCard: { backgroundColor: '#f8fafc', padding: 20, borderRadius: 16, gap: 8 },
  priceLabel: { fontSize: 12, color: '#64748b' },
  price: { fontSize: 28, fontWeight: 'bold', color: '#3b82f6' },
  checkbox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkboxText: { fontSize: 14, color: '#475569' },
  button: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default BuyLandScreen;
