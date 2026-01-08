
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface TaxPaymentScreenProps {
  onNavigate: (screen: Screen) => void;
}

const TaxPaymentScreen: React.FC<TaxPaymentScreenProps> = ({ onNavigate }) => {
  const [selectedMethod, setSelectedMethod] = useState<'momo' | 'card' | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  // Mock outstanding fees
  const FEES = [
    { id: 1, title: 'Annual Property Tax 2024', amount: 'RWF 45,000', upi: '1/03/04/05/1234', dueDate: '31 Dec 2024', overdue: false },
    { id: 2, title: 'Land Lease Fee', amount: 'RWF 12,500', upi: '1/03/04/05/1234', dueDate: '01 Nov 2024', overdue: true },
  ];

  const totalAmount = 'RWF 57,500';

  if (isPaid) {
    return (
      <View style={GlobalStyles.container}>
        <View style={styles.header}>
           <Pressable onPress={() => onNavigate('transactions')} style={styles.backButton}>
            <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
        </View>
        <View style={styles.successContent}>
          <View style={[styles.successIcon, { backgroundColor: getColorWithOpacity(Colors.success, 0.1) }]}>
            <MaterialIcons name="check-circle" size={80} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Payment Successful</Text>
          <Text style={styles.successText}>
            Your payment of {totalAmount} has been processed successfully. A receipt has been sent to your email.
          </Text>
          <View style={styles.receiptCard}>
             <View style={styles.receiptRow}>
               <Text style={styles.receiptLabel}>Transaction ID</Text>
               <Text style={styles.receiptValue}>TX-9882-9921</Text>
             </View>
             <View style={styles.divider} />
             <View style={styles.receiptRow}>
               <Text style={styles.receiptLabel}>Date</Text>
               <Text style={styles.receiptValue}>{new Date().toLocaleDateString()}</Text>
             </View>
          </View>
          <Pressable 
            style={[styles.payButton, { width: '100%', marginTop: 24 }]} 
            onPress={() => onNavigate('dashboard')}
          >
            <Text style={styles.payButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
       <View style={styles.header}>
        <Pressable onPress={() => onNavigate('transactions')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Taxes & Fees</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 150 }}>
        
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Outstanding</Text>
          <Text style={styles.summaryAmount}>{totalAmount}</Text>
          <View style={styles.summaryRow}>
             <MaterialIcons name="info-outline" size={16} color={Colors.white} />
             <Text style={styles.summaryNote}>Due by 31 Dec 2024</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Pending Payments</Text>

        {FEES.map((fee) => (
          <View key={fee.id} style={styles.feeCard}>
            <View style={styles.feeHeader}>
              <View style={styles.iconBox}>
                <MaterialIcons name="receipt-long" size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.feeTitle}>{fee.title}</Text>
                <Text style={styles.feeUpi}>UPI: {fee.upi}</Text>
              </View>
              <Text style={styles.feeAmount}>{fee.amount}</Text>
            </View>
            <View style={styles.feeDivider} />
            <View style={styles.feeFooter}>
              <Text style={[styles.dueDate, fee.overdue && { color: Colors.error }]}>
                {fee.overdue ? 'Overdue' : 'Due'}: {fee.dueDate}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color={Colors.textTertiary} />
            </View>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Payment Method</Text>

        <Pressable 
          style={[styles.methodCard, selectedMethod === 'momo' && styles.methodSelected]}
          onPress={() => setSelectedMethod('momo')}
        >
          <View style={styles.methodLeft}>
            <View style={[styles.radio, selectedMethod === 'momo' && styles.radioActive]}>
              {selectedMethod === 'momo' && <View style={styles.radioInner} />}
            </View>
            <View>
              <Text style={styles.methodTitle}>Mobile Money</Text>
              <Text style={styles.methodSub}>MTN / Airtel-Tigo</Text>
            </View>
          </View>
          <MaterialIcons name="smartphone" size={24} color={Colors.textSecondary} />
        </Pressable>

        <Pressable 
           style={[styles.methodCard, selectedMethod === 'card' && styles.methodSelected]}
           onPress={() => setSelectedMethod('card')}
        >
          <View style={styles.methodLeft}>
             <View style={[styles.radio, selectedMethod === 'card' && styles.radioActive]}>
              {selectedMethod === 'card' && <View style={styles.radioInner} />}
            </View>
            <View>
              <Text style={styles.methodTitle}>Credit / Debit Card</Text>
              <Text style={styles.methodSub}>Visa, Mastercard</Text>
            </View>
          </View>
          <MaterialIcons name="credit-card" size={24} color={Colors.textSecondary} />
        </Pressable>

      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Payable</Text>
          <Text style={styles.totalValue}>{totalAmount}</Text>
        </View>
        <Pressable 
          style={[styles.payButton, !selectedMethod && styles.payButtonDisabled]}
          disabled={!selectedMethod}
          onPress={() => setIsPaid(true)}
        >
          <Text style={styles.payButtonText}>Pay Now</Text>
          <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />
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
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  content: { padding: 20 },
  
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
  },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 },
  summaryAmount: { color: Colors.white, fontSize: 32, fontWeight: '900', marginBottom: 8 },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  summaryNote: { color: Colors.white, fontSize: 12, fontWeight: '600' },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12, marginTop: 8 },
  
  feeCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 16,
    padding: 16,
  },
  feeHeader: { flexDirection: 'row', gap: 12 },
  iconBox: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F0FDFA', alignItems: 'center', justifyContent: 'center' },
  feeTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary },
  feeUpi: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },
  feeAmount: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  feeDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 12 },
  feeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dueDate: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 12,
  },
  methodSelected: { borderColor: Colors.primary, backgroundColor: '#F0FDFA' },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  methodTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary },
  methodSub: { fontSize: 12, color: Colors.textTertiary },
  
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: Colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 16, color: Colors.textSecondary },
  totalValue: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary },
  payButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  payButtonDisabled: { backgroundColor: '#CBD5E1' },
  payButtonText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },

  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  successIcon: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 8 },
  successText: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  receiptCard: { width: '100%', backgroundColor: '#F8FAFC', padding: 16, borderRadius: 12, gap: 12 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between' },
  receiptLabel: { fontSize: 14, color: Colors.textSecondary },
  receiptValue: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: '#E2E8F0' },
});

export default TaxPaymentScreen;
