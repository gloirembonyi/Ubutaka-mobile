
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { MOCK_DISPUTES } from '../constants';

interface DisputeListScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectDispute: (id: string) => void;
}

const DisputeListScreen: React.FC<DisputeListScreenProps> = ({ onNavigate, onSelectDispute }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('support')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.headerTitle}>Disputes</Text>
      </View>
      <View style={styles.content}>
        {MOCK_DISPUTES.map((dispute) => (
          <Pressable
            key={dispute.id}
            onPress={() => onSelectDispute(dispute.id)}
            style={({ pressed }) => [
              styles.disputeCard,
              pressed && styles.pressed
            ]}
          >
            <View style={styles.disputeHeader}>
              <Text style={styles.disputeId}>{dispute.id}</Text>
              <View style={[styles.statusBadge, dispute.status === 'Resolved' && styles.statusResolved]}>
                <Text style={styles.statusText}>{dispute.status}</Text>
              </View>
            </View>
            <Text style={styles.disputeType}>{dispute.type} Dispute</Text>
            <Text style={styles.disputeDescription}>{dispute.description}</Text>
            <Text style={styles.disputeLocation}>{dispute.location}</Text>
          </Pressable>
        ))}
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
  disputeCard: { backgroundColor: '#ffffff', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#f1f5f9', gap: 8 },
  disputeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  disputeId: { fontSize: 12, fontWeight: 'bold', color: '#64748b' },
  statusBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusResolved: { backgroundColor: '#dcfce7' },
  statusText: { fontSize: 10, fontWeight: 'bold', color: '#d97706' },
  disputeType: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  disputeDescription: { fontSize: 14, color: '#475569', lineHeight: 20 },
  disputeLocation: { fontSize: 12, color: '#94a3b8' },
  pressed: { opacity: 0.8 },
});

export default DisputeListScreen;
