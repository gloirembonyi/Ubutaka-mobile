
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, RefreshControl, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Screen, User, Transaction, LandDocument } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import MainHeader from '../components/MainHeader';
import { API_ENDPOINTS } from '../config/api';

interface NotaryDashboardScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  user: User | null;
}

const NotaryDashboardScreen: React.FC<NotaryDashboardScreenProps> = ({ onNavigate, user }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'documents'>('pending');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [documents, setDocuments] = useState<LandDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    try {
      const url = API_ENDPOINTS.TRANSACTIONS;
      console.log('Notary: Fetching transactions from:', url);
      const resp = await fetch(url);
      if (resp.ok) {
        const data: Transaction[] = await resp.json();
        setTransactions(data);
      }
    } catch (err) {
      console.error('Fetch transactions error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const resp = await fetch(API_ENDPOINTS.DOCUMENTS);
      if (resp.ok) {
        const data = await resp.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error('Fetch documents error:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchDocuments();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
    fetchDocuments();
  };

  const filteredTransactions = transactions.filter((tx: Transaction) => 
    activeTab === 'pending' 
      ? (tx.status === 'PENDING_NOTARY' || tx.status === 'PENDING') 
      : tx.status === 'COMPLETED'
  );

  const stats = {
    pending: transactions.filter(tx => tx.status === 'PENDING_NOTARY' || tx.status === 'PENDING').length,
    completed: transactions.filter(tx => tx.status === 'COMPLETED').length,
    totalValue: transactions.reduce((acc, tx) => acc + (parseInt(tx.price || '0')), 0).toLocaleString()
  };

  const handleApprove = async (tx: Transaction) => {
    Alert.alert(
      "Confirm Notarization",
      `Are you sure you want to notarize the transfer of UPI ${tx.upi} from ${tx.sellerName} to ${tx.buyerName}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Notarize", 
          onPress: async () => {
            try {
              const resp = await fetch(`${API_ENDPOINTS.TRANSACTIONS}/${tx.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  status: 'COMPLETED',
                  step: 'Notarized & Registered',
                  progress: 100
                })
              });
              if (resp.ok) {
                Alert.alert("Success", "Transaction has been notarized and recorded on the blockchain.");
                fetchTransactions();
              }
            } catch (err) {
              Alert.alert("Error", "Failed to finalize notarization.");
            }
          }
        }
      ]
    );
  };

  const handleCertifyDocument = async (doc: LandDocument) => {
    Alert.alert(
      "Certify Document",
      `Certify authenticity of ${doc.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Certify", 
          onPress: async () => {
            try {
              const resp = await fetch(`${API_ENDPOINTS.DOCUMENTS}/${doc.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  status: 'CERTIFIED',
                  isCertified: true
                })
              });
              if (resp.ok) {
                Alert.alert("Success", "Document has been certified.");
                fetchDocuments();
              }
            } catch (err) {
              Alert.alert("Error", "Failed to certify document.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={GlobalStyles.container}>
      <SafeAreaView edges={['top']} style={GlobalStyles.safeArea}>
        <MainHeader user={user} />
        
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
        >
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Notary Portal</Text>
            <Text style={styles.subtext}>Official government certification for land transactions.</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: getColorWithOpacity(Colors.primary, 0.1) }]}>
                <MaterialIcons name="pending-actions" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.statNumber}>{stats.pending}</Text>
              <Text style={styles.statLabel}>To Review</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: getColorWithOpacity(Colors.warning, 0.1) }]}>
                <MaterialIcons name="description" size={20} color={Colors.warning} />
              </View>
              <Text style={styles.statNumber}>{documents.filter(d => !d.isCertified).length}</Text>
              <Text style={styles.statLabel}>Docs Pending</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: getColorWithOpacity(Colors.success, 0.1) }]}>
                <MaterialIcons name="verified" size={20} color={Colors.success} />
              </View>
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Certified</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: getColorWithOpacity(Colors.accent, 0.1) }]}>
                <FontAwesome5 name="hand-holding-usd" size={16} color={Colors.accent} />
              </View>
              <Text style={styles.statNumber}>{transactions.length}</Text>
              <Text style={styles.statLabel}>Total Volume</Text>
            </View>
          </View>

          <View style={styles.tabs}>
            <Pressable 
              onPress={() => setActiveTab('pending')}
              style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>Pending Verification</Text>
            </Pressable>
            <Pressable 
              onPress={() => setActiveTab('completed')}
              style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>Archives</Text>
            </Pressable>
            <Pressable 
              onPress={() => setActiveTab('documents')}
              style={[styles.tab, activeTab === 'documents' && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === 'documents' && styles.tabTextActive]}>Document Vault</Text>
            </Pressable>
          </View>

          <View style={styles.listContainer}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
            ) : activeTab === 'documents' ? (
              documents.map((doc: LandDocument) => (
                <View key={doc.id} style={styles.txCard}>
                  <View style={styles.txHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.txTitle}>{doc.name}</Text>
                      <Text style={styles.txUpi}>UPI: {doc.upi || 'General'}</Text>
                      <Text style={styles.docCategory}>{doc.category}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: doc.isCertified ? getColorWithOpacity(Colors.success, 0.1) : getColorWithOpacity(Colors.warning, 0.1) }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: doc.isCertified ? Colors.success : Colors.warning }
                      ]}>{doc.isCertified ? 'CERTIFIED' : 'PENDING'}</Text>
                    </View>
                  </View>

                  <Text style={styles.txDescription} numberOfLines={2}>{doc.description || 'No description provided.'}</Text>

                  {!doc.isCertified && (
                    <Pressable 
                      onPress={() => handleCertifyDocument(doc)}
                      style={[styles.approveButton, { marginTop: 12 }]}
                    >
                      <MaterialIcons name="verified" size={18} color={Colors.white} />
                      <Text style={styles.buttonText}>Certify Document</Text>
                    </Pressable>
                  )}
                  {doc.isCertified && (
                    <View style={[styles.certifiedRow, { marginTop: 12 }]}>
                      <MaterialIcons name="verified-user" size={16} color={Colors.success} />
                      <Text style={styles.certifiedText}>Officially Verified</Text>
                    </View>
                  )}
                </View>
              ))
            ) : filteredTransactions.length > 0 ? filteredTransactions.map((tx: Transaction) => (
              <View key={tx.id} style={styles.txCard}>
                <View style={styles.txHeader}>
                  <View>
                    <Text style={styles.txTitle}>{tx.title}</Text>
                    <Text style={styles.txUpi}>UPI: {tx.upi}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: tx.status === 'COMPLETED' ? getColorWithOpacity(Colors.success, 0.1) : getColorWithOpacity(Colors.warning, 0.1) }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: tx.status === 'COMPLETED' ? Colors.success : Colors.warning }
                    ]}>{tx.status}</Text>
                  </View>
                </View>

                <View style={styles.partiesContainer}>
                  <View style={styles.partyItem}>
                     <Text style={styles.partyLabel}>Seller</Text>
                     <Text style={styles.partyName}>{tx.sellerName}</Text>
                  </View>
                  <MaterialIcons name="arrow-forward" size={16} color={Colors.textTertiary} />
                  <View style={styles.partyItem}>
                     <Text style={styles.partyLabel}>Buyer</Text>
                     <Text style={styles.partyName}>{tx.buyerName}</Text>
                  </View>
                </View>

                <View style={styles.divider} />
                
                <View style={styles.priceRow}>
                   <Text style={styles.priceLabel}>Transaction Value</Text>
                   <Text style={styles.priceValue}>{parseInt(tx.price || '0').toLocaleString()} RWF</Text>
                </View>

                {tx.status !== 'COMPLETED' && (
                  <View style={styles.actionButtons}>
                    <Pressable 
                      onPress={() => handleApprove(tx)}
                      style={styles.approveButton}
                    >
                      <MaterialIcons name="check-circle" size={18} color={Colors.white} />
                      <Text style={styles.buttonText}>Certify Transaction</Text>
                    </Pressable>
                    <Pressable 
                      onPress={() => onNavigate('transactions')}
                      style={styles.detailsButton}
                    >
                      <Text style={styles.detailsButtonText}>View Vault</Text>
                    </Pressable>
                  </View>
                )}
                
                {tx.status === 'COMPLETED' && (
                  <View style={styles.certifiedRow}>
                    <MaterialIcons name="verified-user" size={16} color={Colors.success} />
                    <Text style={styles.certifiedText}>Notarized on {new Date(tx.date).toLocaleDateString()}</Text>
                  </View>
                )}
              </View>
            )) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="assignment-turned-in" size={64} color={Colors.border} />
                <Text style={styles.emptyText}>No transactions found in this category.</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    padding: 24,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 24,
  },
  txCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  txTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  txUpi: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  docCategory: {
    fontSize: 11,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  txDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginTop: 8,
  },
  partiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  partyItem: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  partyName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '900',
    color: Colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  detailsButton: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  detailsButtonText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: 'bold',
  },
  certifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
  },
  certifiedText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default NotaryDashboardScreen;
