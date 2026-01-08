
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { MOCK_TRANSACTIONS } from '../constants';

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
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable style={styles.headerButton}>
          <MaterialIcons name="menu" size={24} color="#475569" />
        </Pressable>
        <Text style={styles.headerTitle}>Land Services</Text>
        <Pressable style={styles.headerButton}>
          <MaterialIcons name="notifications" size={24} color="#3b82f6" />
          <View style={styles.notificationBadge} />
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
                  <MaterialIcons name="verified-user" size={20} color="#3b82f6" />
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
                    <MaterialIcons name="receipt-long" size={20} color="#3b82f6" />
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
                  pressed && styles.pressed
                ]}
              >
                <View style={styles.actionItemIcon}>
                  <MaterialIcons name={action.icon as any} size={24} color="#475569" />
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
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
    color: '#0f172a',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
    borderWidth: 2,
    borderColor: '#ffffff',
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
    color: '#0f172a',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  actionPanel: {
    padding: 16,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    shadowColor: '#000',
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
    color: '#0f172a',
  },
  actionDescription: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
  linkButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  linkButtonText: {
    color: '#ffffff',
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
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  transactionsList: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  transactionCard: {
    width: 340,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
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
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
    color: '#0f172a',
  },
  transactionId: {
    fontSize: 12,
    color: '#64748b',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
  },
  progressText: {
    fontSize: 12,
    color: '#64748b',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionItem: {
    width: '47%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f8fafc',
    gap: 12,
  },
  actionItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionItemText: {
    gap: 4,
  },
  actionItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  actionItemSub: {
    fontSize: 10,
    color: '#64748b',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
});

export default TransactionScreen;
