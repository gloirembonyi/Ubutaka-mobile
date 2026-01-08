
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface TransactionScreenProps {
  onNavigate: (screen: Screen) => void;
}

const TransactionScreen: React.FC<TransactionScreenProps> = ({ onNavigate }) => {
  const actions = [
    { icon: 'payments', title: 'Voluntary Sale', sub: 'Securely sell land', screen: 'transactions' },
    { icon: 'family-history', title: 'Inheritance', sub: 'Transfer to heirs', screen: 'inheritance' },
    { icon: 'account-balance', title: 'Mortgage', sub: 'Register collateral', screen: 'transactions' },
    { icon: 'gavel', title: 'Lease', sub: 'Rental agreement', screen: 'transactions' }
  ];

  return (
    <ScrollView style={GlobalStyles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton}>
          <MaterialIcons name="menu" size={24} color={Colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>Land Services</Text>
        <Pressable style={styles.headerButton}>
          <MaterialIcons name="notifications" size={24} color={Colors.primary} />
          <View style={GlobalStyles.badge} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Manage Your Land</Text>
          <Text style={styles.heroSubtitle}>Secure, paperless transactions powered by smart contracts.</Text>
        </View>

        <View style={styles.actionPanel}>
          <View style={styles.actionCard}>
            <View style={styles.actionContent}>
              <View style={styles.actionText}>
                <View style={styles.actionHeader}>
                  <MaterialIcons name="verified-user" size={20} color={Colors.primary} />
                  <Text style={styles.actionTitle}>Link Digital ID</Text>
                </View>
                <Text style={styles.actionDescription}>Ensure your Irembo ID is linked for faster processing.</Text>
              </View>
              <Pressable style={styles.linkButton}>
                <Text style={styles.linkButtonText}>Link Now</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>In Progress</Text>
            <Pressable>
              <Text style={styles.sectionLink}>View All</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.transactionsList}>
            {MOCK_TRANSACTIONS.map((tx) => (
              <View key={tx.id} style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <View style={styles.transactionIcon}>
                    <MaterialIcons name="receipt-long" size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.transactionInfo}>
                    <Text style={styles.transactionTitle}>{tx.title}</Text>
                    <Text style={styles.transactionId}>{tx.id}</Text>
                  </View>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${tx.progress}%` }]} />
                </View>
                <Text style={styles.progressText}>{tx.step}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Transaction</Text>
          <View style={styles.actionsGrid}>
            {actions.map((action, idx) => (
              <Pressable
                key={idx}
                onPress={() => onNavigate(action.screen as Screen)}
                style={({ pressed }) => [
                  styles.actionItem,
                  pressed && GlobalStyles.pressed
                ]}
              >
                <View style={styles.actionItemIcon}>
                  <MaterialIcons name={action.icon as any} size={24} color={Colors.textSecondary} />
                </View>
                <View style={styles.actionItemText}>
                  <Text style={styles.actionItemTitle}>{action.title}</Text>
                  <Text style={styles.actionItemSub}>{action.sub}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  content: {
    padding: 20,
    gap: 24,
  },
  hero: {
    gap: 8,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  heroSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actionPanel: {
    padding: 0,
  },
  actionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  actionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
  },
  actionText: {
    flex: 1,
    gap: 4,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  actionDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  linkButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  linkButtonText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  transactionsList: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  transactionCard: {
    width: 300,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginRight: 16,
    gap: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  transactionInfo: {
    flex: 1,
    gap: 2,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  transactionId: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionItem: {
    width: '47%',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 12,
  },
  actionItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionItemText: {
    gap: 4,
  },
  actionItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  actionItemSub: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
});

export default TransactionScreen;
