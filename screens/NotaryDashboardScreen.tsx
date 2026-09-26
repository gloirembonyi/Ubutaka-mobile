
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

  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    try {
      const resp = await fetch(API_ENDPOINTS.TRANSACTIONS);
      if (!resp.ok) throw new Error(`Server responded ${resp.status}`);
      const data: Transaction[] = await resp.json();
      setTransactions(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err: any) {
      console.error('Fetch transactions error:', err);
      setError(err?.message || 'Could not load transactions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const resp = await fetch(API_ENDPOINTS.DOCUMENTS);
      if (!resp.ok) throw new Error(`Server responded ${resp.status}`);
      const data = await resp.json();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fetch documents error:', err);
    }
  };

  const isDocCertified = (doc: LandDocument) => doc.isCertified || doc.status === 'CERTIFIED';

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
      ? tx.status === 'PENDING_NOTARY'
      : (tx.status === 'PENDING_SELLER' || tx.status === 'COMPLETED')
  );

  const cleanPrice = (price?: string) => {
    if (!price) return 0;
    return parseInt(price.toString().replace(/[^0-9]/g, ''), 10) || 0;
  };

  const stats = {
    pending: transactions.filter(tx => tx.status === 'PENDING_NOTARY').length,
    completed: transactions.filter(tx => tx.status === 'PENDING_SELLER' || tx.status === 'COMPLETED').length,
    totalValue: transactions.reduce((acc, tx) => acc + cleanPrice(tx.price), 0).toLocaleString(),
    paymentPending: transactions.filter(tx => tx.status === 'PENDING_PAYMENT').length,
  };

  const handleViewDetails = async (tx: Transaction) => {
    try {
      setLoading(true);
      const resp = await fetch(API_ENDPOINTS.PARCEL_BY_ID(encodeURIComponent(tx.upi)));
      if (resp.ok) {
        const parcel = await resp.json();
        if (parcel && parcel.upi) {
          onNavigate('parcel-details', { parcel });
          return;
        }
      }
      Alert.alert('Not Found', `Parcel ${tx.upi} could not be loaded from the registry.`);
    } catch (err) {
      Alert.alert('Error', 'Network error while loading the parcel.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (tx: Transaction) => {
    Alert.alert(
      "Confirm Notarization",
      `By certifying this, you verify that all documents are legal. The seller will be notified to give their final confirmation. Proceed?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Certify & Notify Seller",
          onPress: async () => {
            try {
              const resp = await fetch(API_ENDPOINTS.TRANSACTION_BY_ID(tx.id), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  status: 'PENDING_SELLER',
                  step: 'Notary Certified',
                  progress: 80
                })
              });
              if (resp.ok) {
                Alert.alert("Certified", "You have notarized this transaction. The seller must now give final confirmation.");
                fetchTransactions();
              } else {
                const body = await resp.json().catch(() => ({}));
                Alert.alert("Error", body?.error || `Notarization failed (${resp.status}).`);
              }
            } catch (err) {
              Alert.alert("Error", "Failed to process notarization.");
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
              const resp = await fetch(API_ENDPOINTS.DOCUMENT_BY_ID(doc.id), {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'CERTIFIED' })
              });
              if (resp.ok) {
                Alert.alert("Success", "Document has been certified.");
                fetchDocuments();
              } else {
                const body = await resp.json().catch(() => ({}));
                Alert.alert("Error", body?.error || `Certification failed (${resp.status}).`);
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
              <View style={[styles.statIcon, { backgroundColor: '#F0F9FF' }]}>
                <MaterialIcons name="fact-check" size={20} color="#0369A1" />
              </View>
              <Text style={styles.statNumber}>{stats.pending}</Text>
              <Text style={styles.statLabel}>To Review</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#FFFBEB' }]}>
                <MaterialIcons name="insert-drive-file" size={20} color="#B45309" />
              </View>
              <Text style={styles.statNumber}>{documents.filter(d => !isDocCertified(d)).length}</Text>
              <Text style={styles.statLabel}>Docs Pending</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#F0FDF4' }]}>
                <MaterialIcons name="verified" size={20} color="#15803D" />
              </View>
              <Text style={styles.statNumber}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Certified</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#FFF7ED' }]}>
                <MaterialIcons name="payments" size={20} color="#C2410C" />
              </View>
              <Text style={styles.statNumber}>{transactions.length}</Text>
              <Text style={styles.statLabel}>Total Volume</Text>
              {stats.paymentPending > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>{stats.paymentPending}</Text>
                </View>
              )}
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
              documents.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialIcons name="folder-open" size={64} color={Colors.border} />
                  <Text style={styles.emptyText}>No documents have been submitted yet.</Text>
                </View>
              ) : documents.map((doc: LandDocument) => (
                <View key={doc.id} style={styles.txCard}>
                  <View style={styles.txHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.txTitle}>{doc.name}</Text>
                      <Text style={styles.txUpi}>UPI: {doc.upi || 'General'}</Text>
                      <Text style={styles.docCategory}>{doc.category}</Text>
                    </View>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: isDocCertified(doc) ? getColorWithOpacity(Colors.success, 0.1) : getColorWithOpacity(Colors.warning, 0.1) }
                    ]}>
                      <Text style={[
                        styles.statusText,
                        { color: isDocCertified(doc) ? Colors.success : Colors.warning }
                      ]}>{isDocCertified(doc) ? 'CERTIFIED' : 'PENDING'}</Text>
                    </View>
                  </View>

                  <Text style={styles.txDescription} numberOfLines={2}>{doc.description || 'No description provided.'}</Text>

                  {!isDocCertified(doc) && (
                    <Pressable
                      onPress={() => handleCertifyDocument(doc)}
                      style={[styles.approveButton, { marginTop: 12 }]}
                    >
                      <MaterialIcons name="verified" size={18} color={Colors.white} />
                      <Text style={styles.buttonText}>Certify Document</Text>
                    </Pressable>
                  )}
                  {isDocCertified(doc) && (
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

                <View style={styles.partiesCompactContainer}>
                  <View style={styles.partyCompact}>
                     <Text style={styles.partyCompactLabel}>SELLER</Text>
                     <Text style={styles.partyCompactName} numberOfLines={1}>{tx.sellerName}</Text>
                  </View>
                  <MaterialIcons name="arrow-forward" size={14} color={Colors.textTertiary} style={{ marginHorizontal: 8 }} />
                  <View style={styles.partyCompact}>
                     <Text style={styles.partyCompactLabel}>BUYER</Text>
                     <Text style={styles.partyCompactName} numberOfLines={1}>{tx.buyerName}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.priceRowCompact}>
                   <Text style={styles.priceLabelCompact}>Transaction Value</Text>
                   <Text style={styles.priceValueCompact}>{parseInt(tx.price || '0').toLocaleString()} RWF</Text>
                </View>

                {/* Payment Status Indicator */}
                {tx.status === 'PENDING_NOTARY' && (
                  <View style={styles.paymentNotification}>
                    <MaterialIcons name="payment" size={16} color={Colors.success} />
                    <Text style={styles.paymentText}>Payment Received - Ready for Review</Text>
                  </View>
                )}

                {tx.status === 'PENDING_NOTARY' && (
                  <View style={styles.actionButtons}>
                    <Pressable
                      onPress={() => handleApprove(tx)}
                      style={styles.approveButton}
                    >
                      <MaterialIcons name="check-circle" size={18} color={Colors.white} />
                      <Text style={styles.buttonText}>Certify Transaction</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleViewDetails(tx)}
                      style={styles.detailsButton}
                    >
                      <Text style={styles.detailsButtonText}>View Details</Text>
                    </Pressable>
                  </View>
                )}

                {tx.status === 'PENDING_SELLER' && (
                  <View style={styles.pendingSellerContainer}>
                    <View style={styles.pendingSellerBadge}>
                      <MaterialIcons name="hourglass-top" size={16} color={Colors.warning} />
                      <Text style={styles.pendingSellerText}>Awaiting Seller Final Signature</Text>
                    </View>
                    <Pressable
                      onPress={() => handleViewDetails(tx)}
                      style={[styles.detailsButton, { width: '100%' }]}
                    >
                      <Text style={styles.detailsButtonText}>Monitor Progress</Text>
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
                <Text style={styles.emptyText}>
                  {error ? `Could not load transactions: ${error}` : activeTab === 'pending' ? 'No transactions are awaiting notarization.' : 'No notarized transactions yet.'}
                </Text>
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
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  subtext: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 8,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    fontWeight: '800',
    marginTop: 4,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tab: {
    paddingVertical: 14,
    marginRight: 24,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textTertiary,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '900',
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  txCard: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  txTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  txUpi: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  partiesCompactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  partyCompact: {
    flex: 1,
  },
  partyCompactLabel: {
    fontSize: 9,
    color: Colors.textTertiary,
    fontWeight: '800',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  partyCompactName: {
    fontSize: 14,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  priceRowCompact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  priceLabelCompact: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  priceValueCompact: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.success,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  approveButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '800',
  },
  detailsButton: {
    paddingHorizontal: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailsButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  certifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 10,
  },
  certifiedText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '800',
  },
  emptyState: {
    padding: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  notificationBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: Colors.error,
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '900',
  },
  paymentNotification: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    marginBottom: 16,
  },
  paymentText: {
    flex: 1,
    fontSize: 13,
    color: '#0369A1',
    fontWeight: '700',
  },
  pendingSellerContainer: {
    gap: 10,
  },
  pendingSellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  pendingSellerText: {
    fontSize: 13,
    color: '#B45309',
    fontWeight: '800',
  },
});

export default NotaryDashboardScreen;
