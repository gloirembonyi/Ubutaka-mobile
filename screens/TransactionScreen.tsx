
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Modal, ActivityIndicator, Linking, Platform } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Screen, User } from '../types';
import { BlockchainTransaction } from '../types/blockchain';
import { BlockchainService } from '../services/blockchainService';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

import { API_ENDPOINTS } from '../config/api';

interface TransactionScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User | null;
}

const TransactionScreen: React.FC<TransactionScreenProps> = ({ onNavigate, user }) => {
  const [selectedTx, setSelectedTx] = useState<BlockchainTransaction | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<BlockchainTransaction[]>([]);

  React.useEffect(() => {
    fetchHistory();
  }, [user?.name]);

  const fetchHistory = async () => {
    if (!user?.name) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.TRANSACTIONS}?name=${encodeURIComponent(user.name)}`);
      if (response.ok) {
        const data = await response.json();
        const mappedData: BlockchainTransaction[] = data.map((tx: any) => ({
          hash: tx.txHash,
          blockNumber: tx.blockNumber,
          timestamp: tx.createdAt,
          from: tx.sellerName || 'System',
          to: tx.buyerName || 'Unassigned',
          value: tx.price || '0',
          gasUsed: 42000,
          status: tx.status === 'COMPLETED' ? 'confirmed' : 'pending',
          detailedStatus: tx.status,
          step: tx.step,
          contractAddress: '0xRegistry'
        }));
        setHistory(mappedData);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMockTx = async () => {
    setVerifying(true);
    // Simulate mining
    setTimeout(() => {
        const newTx = BlockchainService.createMockTransaction('transfer', 5000000, '0xMe', '0xBuyer');
        setHistory([newTx, ...history]);
        setVerifying(false);
        Alert.alert("Transaction Mined", `Block #${newTx.blockNumber} confirmed on chain.`);
    }, 2000);
  };

  const handleVerify = async (tx: BlockchainTransaction) => {
    setVerifying(true);
    const isValid = await BlockchainService.verifyTransaction(tx.hash);
    setVerifying(false);
    
    if (isValid) {
        setSelectedTx(tx);
    } else {
        Alert.alert("Error", "Could not verify transaction integrity.");
    }
  };

  const openExplorer = (hash: string) => {
     Linking.openURL(BlockchainService.getExplorerUrl(hash));
  };

  const handleSellerApproval = async (tx: any) => {
    Alert.alert(
      "Approve Buyer's Offer",
      "By approving this offer, you agree to sell this land to the buyer at the stated price. The buyer will then be required to pay transaction fees before proceeding to notary certification. Proceed?",
      [
        { text: "Reject", style: "cancel", onPress: async () => {
          try {
            const originalResp = await fetch(`${API_ENDPOINTS.TRANSACTIONS}`);
            const data = await originalResp.json();
            const originalTx = data.find((d: any) => d.txHash === tx.hash || d.id === tx.id);
            if (!originalTx) throw new Error("Transaction not found");

            await fetch(`${API_ENDPOINTS.TRANSACTIONS}/${originalTx.id}`, {
              method: 'DELETE',
            });
            Alert.alert("Offer Rejected", "The buyer's offer has been rejected.");
            fetchHistory();
          } catch (err) {
            Alert.alert("Error", "Failed to reject offer.");
          }
        }},
        { 
          text: "Approve & Continue", 
          onPress: async () => {
            setVerifying(true);
            try {
              const originalResp = await fetch(`${API_ENDPOINTS.TRANSACTIONS}`);
              const data = await originalResp.json();
              const originalTx = data.find((d: any) => d.txHash === tx.hash || d.id === tx.id);
              
              if (!originalTx) throw new Error("Transaction not found");

              const updateResp = await fetch(`${API_ENDPOINTS.TRANSACTIONS}/${originalTx.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  status: 'PENDING_PAYMENT',
                  step: 'Awaiting Buyer Payment',
                  progress: 40
                })
              });

              if (updateResp.ok) {
                Alert.alert("Offer Approved", "You have approved the buyer's offer. The buyer has been notified to proceed with payment.");
                fetchHistory();
              }
            } catch (err) {
              Alert.alert("Error", "Failed to approve offer.");
            } finally {
              setVerifying(false);
            }
          }
        }
      ]
    );
  };

  const handleBuyerPayment = async (tx: any) => {
    Alert.alert(
      "Confirm Payment",
      "You are about to pay the transaction fees. Once paid, this will be sent to the Notary for official certification. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Pay Fees & Submit", 
          onPress: async () => {
            setVerifying(true);
            try {
              const originalResp = await fetch(`${API_ENDPOINTS.TRANSACTIONS}`);
              const data = await originalResp.json();
              const originalTx = data.find((d: any) => d.txHash === tx.hash || d.id === tx.id);
              
              if (!originalTx) throw new Error("Transaction not found");

              const updateResp = await fetch(`${API_ENDPOINTS.TRANSACTIONS}/${originalTx.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  status: 'PENDING_NOTARY',
                  step: 'Awaiting Notary Certification',
                  progress: 60
                })
              });

              if (updateResp.ok) {
                Alert.alert("Payment Successful", "Fees paid. The transaction has been submitted to the Notary for review.");
                fetchHistory();
              }
            } catch (err) {
              Alert.alert("Error", "Payment failed.");
            } finally {
              setVerifying(false);
            }
          }
        }
      ]
    );
  };

  const handleSellerFinalSign = async (tx: any) => {
    Alert.alert(
      "Final Confirmation",
      "As the seller, by signing this you agree to transfer all rights of this parcel to the buyer. This action is recorded on the blockchain and is irreversible. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm & Sign", 
          onPress: async () => {
            setVerifying(true);
            try {
              const originalResp = await fetch(`${API_ENDPOINTS.TRANSACTIONS}`);
              const data = await originalResp.json();
              const originalTx = data.find((d: any) => d.txHash === tx.hash || d.id === tx.id);
              
              if (!originalTx) throw new Error("Transaction not found");

              // Complete the transaction
              const updateResp = await fetch(`${API_ENDPOINTS.TRANSACTIONS}/${originalTx.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  status: 'COMPLETED',
                  step: 'Transfer Complete',
                  progress: 100
                })
              });

              if (updateResp.ok) {
                console.log('Transaction completed, now updating parcel ownership...');
                
                // Fetch current parcel to get ownership history
                const parcelResp = await fetch(`${API_ENDPOINTS.PARCELS}?upi=${encodeURIComponent(originalTx.upi)}`);
                let currentParcel = null;
                
                if (parcelResp.ok) {
                  const parcels = await parcelResp.json();
                  currentParcel = Array.isArray(parcels) ? parcels[0] : parcels;
                }

                // Build ownership history
                let ownerHistory = [];
                try {
                  if (currentParcel?.ownerHistory) {
                    ownerHistory = JSON.parse(currentParcel.ownerHistory);
                  }
                } catch (e) {
                  console.log('Failed to parse ownership history, starting fresh');
                }

                // Add new ownership record
                ownerHistory.push({
                  timestamp: new Date().toISOString(),
                  previousOwner: originalTx.sellerName,
                  newOwner: originalTx.buyerName,
                  transactionId: originalTx.id,
                  price: originalTx.price
                });

                // Update Parcel Ownership
                const parcelUpdateResp = await fetch(`${API_ENDPOINTS.PARCELS}/${encodeURIComponent(originalTx.upi)}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ 
                    status: 'Verified', 
                    ownerName: originalTx.buyerName,
                    price: null, // Remove from marketplace
                    ownerHistory: JSON.stringify(ownerHistory)
                  })
                });

                if (parcelUpdateResp.ok) {
                  console.log('Parcel ownership successfully transferred to:', originalTx.buyerName);
                  Alert.alert("Success", "Ownership transferred! The land has been officially updated in the registry.");
                } else {
                  console.error('Failed to update parcel ownership:', await parcelUpdateResp.text());
                  Alert.alert("Warning", "Transaction completed but parcel update failed. Please contact support.");
                }
                
                fetchHistory();
              }
            } catch (err) {
              console.error('Transfer error:', err);
              Alert.alert("Error", "Failed to complete transfer.");
            } finally {
              setVerifying(false);
            }
          }
        }
      ]
    );
  };

  const getNextSteps = (status?: string) => {
    switch (status) {
      case 'PENDING_SELLER_APPROVAL':
        return {
          text: 'Awaiting Seller Approval',
          icon: 'person-outline',
          color: '#F59E0B'
        };
      case 'PENDING_PAYMENT':
        return {
          text: 'Payment Required',
          icon: 'payments',
          color: Colors.error
        };
      case 'PENDING_NOTARY':
        return {
          text: 'Under Notary Review',
          icon: 'gavel',
          color: Colors.primary
        };
      case 'PENDING_SELLER':
        return {
          text: 'Await Seller Final Signature',
          icon: 'history-edu',
          color: Colors.accent
        };
      default:
        return {
          text: 'Follow System Instructions',
          icon: 'info',
          color: Colors.textSecondary
        };
    }
  };


  return (
    <ScrollView style={GlobalStyles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate(user?.role === 'ABUNZI' ? 'abunzi-dashboard' : 'dashboard')} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textSecondary} />
        </Pressable>
        <Text style={styles.headerTitle}>{user?.role === 'ABUNZI' ? 'Abunzi Operations' : 'Blockchain Registry'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        
        {/* Status Card */}
        <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
                <View style={styles.statusIcon}>
                    <FontAwesome5 name="link" size={20} color={Colors.white} />
                </View>
                <View>
                    <Text style={styles.statusTitle}>Ubutaka Chain</Text>
                    <Text style={styles.statusSub}>Status: Operational</Text>
                </View>
            </View>
            <View style={styles.blockInfo}>
                <Text style={styles.blockText}>Current Block: #18,239,412</Text>
                <View style={styles.indicator} />
            </View>
        </View>

        {/* Actions */}
        <View style={styles.actionSection}>
            <Text style={styles.sectionTitle}>{user?.role === 'ABUNZI' ? 'Job Functions' : 'Simulate Transaction'}</Text>
            {user?.role === 'ABUNZI' ? (
              <View style={{ gap: 12 }}>
                <Pressable 
                    onPress={() => onNavigate('dispute-list')}
                    style={({pressed}: {pressed: boolean}) => [styles.simulateButton, pressed && {opacity: 0.8}]}
                >
                    <MaterialIcons name="fact-check" size={24} color={Colors.white} />
                    <Text style={styles.simulateText}>Review Pending Disputes</Text>
                </Pressable>
                <Pressable 
                    onPress={() => Alert.alert("Calendar", "Opening mediation desk schedule...")}
                    style={({pressed}: {pressed: boolean}) => [styles.simulateButton, { backgroundColor: Colors.primary }, pressed && {opacity: 0.8}]}
                >
                    <MaterialIcons name="event-available" size={24} color={Colors.white} />
                    <Text style={styles.simulateText}>Manage Mediation Calendar</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable 
                  onPress={handleCreateMockTx}
                  style={({pressed}: {pressed: boolean}) => [styles.simulateButton, pressed && {opacity: 0.8}]}
                  disabled={verifying}
              >
                  {verifying ? (
                      <ActivityIndicator color={Colors.white} />
                  ) : (
                      <>
                          <MaterialIcons name="add-circle-outline" size={24} color={Colors.white} />
                          <Text style={styles.simulateText}>Record New Land Transfer</Text>
                      </>
                  )}
              </Pressable>
            )}
        </View>

        {/* Transaction Legend */}
        <View style={styles.legendContainer}>
            <Text style={styles.legendTitle}>Immutable Ledger</Text>
            <Text style={styles.legendSub}>All land transactions are cryptographically signed and permanently recorded.</Text>
        </View>

        {/* List */}
        <View style={styles.historyList}>
            {loading ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : history.length === 0 ? (
                <View style={{ padding: 40, alignItems: 'center' }}>
                    <Text style={{ color: Colors.textTertiary }}>No transactions found</Text>
                </View>
            ) : (
                history.map((tx, index) => {
                    const nextStep = getNextSteps(tx.detailedStatus);
                    return (
                        <Pressable 
                            key={index}
                            style={styles.txCard}
                            onPress={() => handleVerify(tx)}
                        >
                            <View style={styles.txRow}>
                                <View style={styles.txIcon}>
                                    <FontAwesome5 name="cube" size={16} color={Colors.primary} />
                                </View>
                                <View style={styles.txInfo}>
                                    <Text style={styles.txType}>{tx.detailedStatus?.replace('_', ' ') || 'Land Operation'}</Text>
                                    <View style={styles.hashContainer}>
                                        <Text style={styles.txHash} numberOfLines={1} ellipsizeMode="middle">{tx.hash}</Text>
                                        <Text style={styles.txStep}>{tx.step}</Text>
                                    </View>
                                </View>
                                <View style={[styles.badge, { backgroundColor: getColorWithOpacity(nextStep.color, 0.1) }]}>
                                    <MaterialIcons name={tx.status === 'confirmed' ? 'check-circle' : 'hourglass-empty'} size={14} color={nextStep.color} />
                                    <Text style={[styles.badgeText, { color: nextStep.color }]}>
                                        {tx.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.nextStepContainer}>
                                <View style={[styles.nextStepIcon, { backgroundColor: getColorWithOpacity(nextStep.color, 0.1) }]}>
                                    <MaterialIcons name={nextStep.icon as any} size={18} color={nextStep.color} />
                                </View>
                                <View>
                                    <Text style={styles.nextStepLabel}>Next Step:</Text>
                                    <Text style={[styles.nextStepText, { color: nextStep.color }]}>{nextStep.text}</Text>
                                </View>
                            </View>

                            <View style={styles.txDetails}>
                                <Text style={styles.detailText}>Block: #{tx.blockNumber}</Text>
                                <Text style={styles.detailText}>{new Date(tx.timestamp).toLocaleTimeString()}</Text>
                            </View>

                            {tx.detailedStatus === 'PENDING_SELLER_APPROVAL' && tx.from === user?.name && (
                                <Pressable 
                                    style={[styles.payButton, { backgroundColor: '#F59E0B' }]}
                                    onPress={() => handleSellerApproval(tx)}
                                >
                                    <MaterialIcons name="check-circle" size={18} color={Colors.white} />
                                    <Text style={styles.payButtonText}>Review & Approve Offer</Text>
                                </Pressable>
                            )}

                            {tx.detailedStatus === 'PENDING_PAYMENT' && tx.to === user?.name && (
                                <Pressable 
                                    style={styles.payButton}
                                    onPress={() => handleBuyerPayment(tx)}
                                >
                                    <MaterialIcons name="payment" size={18} color={Colors.white} />
                                    <Text style={styles.payButtonText}>Pay Fees & Submit to Notary</Text>
                                </Pressable>
                            )}

                            {tx.detailedStatus === 'PENDING_SELLER' && tx.from === user?.name && (
                                <Pressable 
                                    style={[styles.payButton, { backgroundColor: Colors.success }]}
                                    onPress={() => handleSellerFinalSign(tx)}
                                >
                                    <MaterialIcons name="verified" size={18} color={Colors.white} />
                                    <Text style={styles.payButtonText}>Confirm & Sign Final Transfer</Text>
                                </Pressable>
                            )}
                        </Pressable>
                    );
                })
            )}
        </View>

      </View>

      {/* Verification Modal */}
      <Modal
        visible={selectedTx !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTx(null)}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <FontAwesome5 name="shield-alt" size={40} color={Colors.success} />
                    <Text style={styles.modalTitle}>Verified On-Chain</Text>
                </View>
                
                <View style={styles.integritySection}>
                    <Text style={styles.integrityLabel}>Transaction Hash Integrity:</Text>
                    <Text style={styles.integrityValue}>SHA-256 Valid</Text>
                </View>

                {selectedTx && (
                    <View style={styles.txDetailBlock}>
                        <Text style={styles.label}>Hash:</Text>
                        <Text style={styles.valueMono}>{selectedTx.hash}</Text>
                        
                        <Text style={styles.label}>Block Number:</Text>
                        <Text style={styles.value}>{selectedTx.blockNumber}</Text>
                        
                        <Text style={styles.label}>From:</Text>
                        <Text style={styles.valueMono}>{selectedTx.from}</Text>

                        <Text style={styles.label}>To:</Text>
                        <Text style={styles.valueMono}>{selectedTx.to}</Text>

                        <Text style={styles.label}>Gas Used:</Text>
                        <Text style={styles.value}>{selectedTx.gasUsed} GWEI</Text>
                    </View>
                )}

                <Pressable 
                    style={styles.explorerButton}
                    onPress={() => selectedTx && openExplorer(selectedTx.hash)}
                >
                    <Text style={styles.explorerText}>View on Block Explorer</Text>
                    <MaterialIcons name="open-in-new" size={16} color={Colors.primary} />
                </Pressable>

                <Pressable 
                    style={styles.closeButton}
                    onPress={() => setSelectedTx(null)}
                >
                    <Text style={styles.closeText}>Close Verification</Text>
                </Pressable>
            </View>
        </View>
      </Modal>

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
    padding: 24,
    gap: 32,
  },
  statusCard: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    padding: 24,
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  statusSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
  },
  blockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  blockText: {
    color: Colors.white,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
    fontWeight: '600',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.success,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  actionSection: {},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  simulateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary,
    padding: 18,
    borderRadius: 16,
    gap: 10,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  simulateText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  legendContainer: {
    backgroundColor: Colors.backgroundLight,
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  legendTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 6,
  },
  legendSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  historyList: {
    gap: 16,
  },
  txCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.1),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  payButton: {
    marginTop: 16,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  payButtonText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  txInfo: {
    flex: 1,
    marginRight: 8,
  },
  txType: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  hashContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  txHash: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    flex: 1,
  },
  txStep: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: 'bold',
    backgroundColor: getColorWithOpacity(Colors.primary, 0.1),
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  nextStepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.backgroundLight,
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  nextStepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextStepLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  nextStepText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: getColorWithOpacity(Colors.success, 0.1),
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.success,
  },
  txDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 12,
  },
  detailText: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: Colors.white,
    width: '100%',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  integritySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: getColorWithOpacity(Colors.success, 0.1),
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
    justifyContent: 'center',
  },
  integrityLabel: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: '600',
  },
  integrityValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.success,
  },
  txDetailBlock: {
    width: '100%',
    gap: 8,
    marginBottom: 32,
  },
  label: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  value: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  valueMono: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: Colors.backgroundLight,
    padding: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  explorerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
    padding: 12,
  },
  explorerText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  closeButton: {
    width: '100%',
    backgroundColor: Colors.neutralLight,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  closeText: {
    color: Colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default TransactionScreen;
