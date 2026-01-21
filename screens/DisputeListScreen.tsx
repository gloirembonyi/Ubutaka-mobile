
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, User, Dispute } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';
import { ActivityIndicator } from 'react-native';

interface DisputeListScreenProps {
  onNavigate: (screen: Screen) => void;
  onSelectDispute: (id: string) => void;
  user: User | null;
}

const DisputeListScreen: React.FC<DisputeListScreenProps> = ({ onNavigate, onSelectDispute, user }) => {
  const [activeTab, setActiveTab] = useState<'citizen' | 'abunzi'>(user?.role === 'ABUNZI' ? 'abunzi' : 'citizen');
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const resp = await fetch(API_ENDPOINTS.DISPUTES);
        if (resp.ok) {
          const data = await resp.json();
          setDisputes(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDisputes();
  }, []);

  const filteredDisputes = disputes.filter(d => {
    if (activeTab === 'citizen') {
      return d.reportedById === user?.id;
    } else {
      // For Abunzi tab, show based on district
      return d.district?.toLowerCase() === user?.district?.toLowerCase();
    }
  });

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable 
            onPress={() => onNavigate(user?.role === 'ABUNZI' ? 'abunzi-dashboard' : 'dashboard')} 
            style={styles.backButton}
          >
             <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Dispute Resolution</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.tabs}>
           <Pressable 
            style={[styles.tab, activeTab === 'citizen' && styles.tabActive]}
            onPress={() => setActiveTab('citizen')}
           >
             <Text style={[styles.tabText, activeTab === 'citizen' && styles.tabTextActive]}>My Disputes</Text>
           </Pressable>
           <Pressable 
            style={[styles.tab, activeTab === 'abunzi' && styles.tabActive]}
            onPress={() => setActiveTab('abunzi')}
           >
             <Text style={[styles.tabText, activeTab === 'abunzi' && styles.tabTextActive]}>Abunzi Dashboard</Text>
           </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        {activeTab === 'abunzi' && (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Active Cases</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4</Text>
              <Text style={styles.statLabel}>Pending Review</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: Colors.success }]}>96%</Text>
              <Text style={styles.statLabel}>Resolution Rate</Text>
            </View>
          </View>
        )}

        {activeTab === 'abunzi' && (
          <Pressable style={styles.createButton} onPress={() => onNavigate('report-anomaly')}>
             <MaterialIcons name="add" size={20} color={Colors.white} />
             <Text style={styles.createButtonText}>Register New Dispute</Text>
          </Pressable>
        )}

        <Text style={styles.sectionTitle}>{activeTab === 'abunzi' ? 'Assigned Cases' : 'My Active Cases'}</Text>

        {loading ? (
           <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
        ) : filteredDisputes.map((dispute) => (
          <Pressable
            key={dispute.id}
            onPress={() => onSelectDispute(dispute.id)}
            style={({ pressed }: { pressed: boolean }) => [
              styles.disputeCard,
              pressed && GlobalStyles.pressed
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.idContainer}>
                <MaterialIcons name="gavel" size={16} color={Colors.primary} />
                <Text style={styles.disputeId}>#{dispute.id.slice(-6).toUpperCase()}</Text>
              </View>
              <View style={[
                styles.statusBadge, 
                dispute.status === 'Resolved' ? styles.statusResolved : 
                dispute.status === 'Mediation' ? styles.statusMediation : styles.statusInvestigation
              ]}>
                <Text style={[
                  styles.statusText,
                  dispute.status === 'Resolved' ? styles.statusTextResolved : 
                  dispute.status === 'Mediation' ? styles.statusTextMediation : styles.statusTextInvestigation
                ]}>{dispute.status}</Text>
              </View>
            </View>

            <Text style={styles.disputeType}>{dispute.type} Dispute</Text>
            <Text style={styles.disputeDescription} numberOfLines={2}>{dispute.description}</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.cardFooter}>
              <View style={styles.locationRow}>
                <MaterialIcons name="location-on" size={14} color={Colors.textTertiary} />
                <Text style={styles.disputeLocation}>{dispute.location}</Text>
              </View>
              <Text style={styles.dateText}>{dispute.dateOpened}</Text>
            </View>
          </Pressable>
        ))}
        {!loading && filteredDisputes.length === 0 && (
           <Text style={{ textAlign: 'center', marginTop: 40, color: Colors.textSecondary }}>No disputes found.</Text>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingBottom: 0,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  
  tabs: { flexDirection: 'row', paddingHorizontal: 16 },
  tab: { marginRight: 24, paddingBottom: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: Colors.primary },
  tabText: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: Colors.primary, fontWeight: 'bold' },

  content: { padding: 20 },
  
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#F8FAFC', padding: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.borderLight },
  statNumber: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary, marginBottom: 4 },
  statLabel: { fontSize: 10, color: Colors.textTertiary, textTransform: 'uppercase', fontWeight: 'bold' },

  createButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    gap: 8,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: { color: Colors.white, fontWeight: 'bold', fontSize: 14 },
  
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 16 },

  disputeCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  idContainer: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#F0FDFA', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  disputeId: { fontSize: 12, fontWeight: 'bold', color: Colors.primary },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusResolved: { backgroundColor: '#DCFCE7' },
  statusMediation: { backgroundColor: '#FEF3C7' },
  statusInvestigation: { backgroundColor: '#F1F5F9' },
  
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  statusTextResolved: { color: '#166534' },
  statusTextMediation: { color: '#B45309' },
  statusTextInvestigation: { color: '#475569' },
  
  disputeType: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 6 },
  disputeDescription: { fontSize: 13, color: Colors.textSecondary, lineHeight: 20, marginBottom: 16 },
  
  divider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 12 },
  
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  disputeLocation: { fontSize: 12, color: Colors.textTertiary },
  dateText: { fontSize: 12, color: Colors.textTertiary, fontWeight: '500' },
});

export default DisputeListScreen;
