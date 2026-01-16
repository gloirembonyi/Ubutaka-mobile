
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Modal, ActivityIndicator, Linking, Platform } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Screen, User } from '../types';
import { BlockchainTransaction } from '../types/blockchain';
import { BlockchainService } from '../services/blockchainService';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface TransactionScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User | null;
}


const TransactionScreen: React.FC<TransactionScreenProps> = ({ onNavigate, user }) => {
  const [selectedTx, setSelectedTx] = useState<BlockchainTransaction | null>(null);
  const [verifying, setVerifying] = useState(false);
  
  // Mock history state
  const [history, setHistory] = useState<BlockchainTransaction[]>([
    {
      hash: '0x3a4b...9e21',
      blockNumber: 18239405,
      timestamp: '2024-11-20T10:30:00Z',
      from: '0xUser...',
      to: '0xRegistry...',
      value: '0',
      gasUsed: 42000,
      status: 'confirmed',
      contractAddress: '0xMockContract'
    }
  ]);

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
                    style={({pressed}) => [styles.simulateButton, pressed && {opacity: 0.8}]}
                >
                    <MaterialIcons name="fact-check" size={24} color={Colors.white} />
                    <Text style={styles.simulateText}>Review Pending Disputes</Text>
                </Pressable>
                <Pressable 
                    onPress={() => Alert.alert("Calendar", "Opening mediation desk schedule...")}
                    style={({pressed}) => [styles.simulateButton, { backgroundColor: Colors.primary }, pressed && {opacity: 0.8}]}
                >
                    <MaterialIcons name="event-available" size={24} color={Colors.white} />
                    <Text style={styles.simulateText}>Manage Mediation Calendar</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable 
                  onPress={handleCreateMockTx}
                  style={({pressed}) => [styles.simulateButton, pressed && {opacity: 0.8}]}
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
            {history.map((tx, index) => (
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
                            <Text style={styles.txType}>Land Operation</Text>
                            <Text style={styles.txHash} numberOfLines={1} ellipsizeMode="middle">{tx.hash}</Text>
                        </View>
                        <View style={styles.badge}>
                            <MaterialIcons name="check-circle" size={14} color={Colors.success} />
                            <Text style={styles.badgeText}>Verified</Text>
                        </View>
                    </View>
                    <View style={styles.txDetails}>
                        <Text style={styles.detailText}>Block: #{tx.blockNumber}</Text>
                        <Text style={styles.detailText}>{new Date(tx.timestamp).toLocaleTimeString()}</Text>
                    </View>
                </Pressable>
            ))}
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
  txHash: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
