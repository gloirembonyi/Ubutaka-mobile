
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

import { API_ENDPOINTS } from '../config/api';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { User, Dispute, Screen } from '../types';

interface DisputeDetailScreenProps {
  onNavigate: (screen: Screen) => void;
  disputeId: string | null;
  user: User | null;
}

const DisputeDetailScreen: React.FC<DisputeDetailScreenProps> = ({ onNavigate, disputeId, user }) => {
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDispute = async () => {
      if (!disputeId) return;
      try {
        const resp = await fetch(API_ENDPOINTS.DISPUTE_BY_ID(disputeId));
        if (resp.ok) {
          const data = await resp.json();
          setDispute(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDispute();
  }, [disputeId]);

  if (loading) {
    return (
      <View style={[GlobalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!dispute) {
    return (
      <View style={[GlobalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Dispute not found</Text>
        <Pressable onPress={() => onNavigate('dispute-list')}>
          <Text style={{ color: Colors.primary, marginTop: 12 }}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={GlobalStyles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dispute-list')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Dispute Details</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.id}>#{dispute.id.slice(-6).toUpperCase()}</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'center', marginRight: 40 },
  content: { padding: 24, gap: 16 },
  id: { fontSize: 14, fontWeight: 'bold', color: Colors.textSecondary },
  statusBadge: { alignSelf: 'flex-start', backgroundColor: Colors.accentLight, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: 'bold', color: Colors.accentDark },
  type: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary },
  description: { fontSize: 16, color: Colors.textSecondary, lineHeight: 24 },
  location: { fontSize: 14, color: Colors.textTertiary },
  button: { backgroundColor: Colors.primary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  buttonText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
});

export default DisputeDetailScreen;
