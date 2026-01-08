
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { MOCK_DISPUTES } from '../constants';

interface DisputeDetailScreenProps {
  onNavigate: (screen: Screen) => void;
  disputeId: string | null;
}

const DisputeDetailScreen: React.FC<DisputeDetailScreenProps> = ({ onNavigate, disputeId }) => {
  const dispute = MOCK_DISPUTES.find(d => d.id === disputeId) || MOCK_DISPUTES[0];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dispute-list')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.headerTitle}>Dispute Details</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.id}>{dispute.id}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{dispute.status}</Text>
        </View>
        <Text style={styles.type}>{dispute.type} Dispute</Text>
        <Text style={styles.description}>{dispute.description}</Text>
        <Text style={styles.location}>{dispute.location}</Text>
        <Pressable style={styles.button} onPress={() => onNavigate('mediation-room')}>
          <Text style={styles.buttonText}>Enter Mediation Room</Text>
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
  id: { fontSize: 14, fontWeight: 'bold', color: '#64748b' },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: '#fef3c7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#d97706' },
  type: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  description: { fontSize: 16, color: '#475569', lineHeight: 24 },
  location: { fontSize: 14, color: '#94a3b8' },
  button: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default DisputeDetailScreen;
