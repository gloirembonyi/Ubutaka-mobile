
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, User, Dispute, AnomalyReport } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';
import { ActivityIndicator, Alert } from 'react-native';

interface DisputeListScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  onSelectDispute: (id: string) => void;
  user: User | null;
}

const DisputeListScreen: React.FC<DisputeListScreenProps> = ({ onNavigate, onSelectDispute, user }) => {
  const [activeTab, setActiveTab] = useState<'disputes' | 'reports' | 'abunzi'>(user?.role === 'ABUNZI' ? 'abunzi' : 'disputes');
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyReport[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    fetchData();
  }, [user?.id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Disputes
      const disputeUrl = `${API_ENDPOINTS.DISPUTES}${user?.role !== 'ADMIN' ? `?reportedById=${user?.id}` : ''}`;
      const disputeResp = await fetch(disputeUrl);
      if (disputeResp.ok) {
        const data = await disputeResp.json();
        setDisputes(data);
      }

      // Fetch Anomalies
      const anomalyUrl = `${API_ENDPOINTS.ANOMALIES}${user?.role !== 'ADMIN' ? `?reportedById=${user?.id}` : ''}`;
      const anomalyResp = await fetch(anomalyUrl);
      if (anomalyResp.ok) {
        const data = await anomalyResp.json();
        setAnomalies(data);
      }
    } catch (err) {
      console.error('Fetch reports error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDisputes = disputes.filter(d => {
    if (activeTab === 'disputes') {
      return d.reportedById === user?.id;
    } else if (activeTab === 'abunzi') {
      // For Abunzi tab, show based on district
      return d.district?.toLowerCase() === user?.district?.toLowerCase();
    }
    return false;
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
            style={[styles.tab, activeTab === 'disputes' && styles.tabActive]}
            onPress={() => setActiveTab('disputes')}
           >
             <Text style={[styles.tabText, activeTab === 'disputes' && styles.tabTextActive]}>My Disputes</Text>
           </Pressable>
           <Pressable 
            style={[styles.tab, activeTab === 'reports' && styles.tabActive]}
            onPress={() => setActiveTab('reports')}
           >
             <Text style={[styles.tabText, activeTab === 'reports' && styles.tabTextActive]}>General Reports</Text>
           </Pressable>
           {user?.role === 'ABUNZI' && (
             <Pressable 
              style={[styles.tab, activeTab === 'abunzi' && styles.tabActive]}
              onPress={() => setActiveTab('abunzi')}
             >
               <Text style={[styles.tabText, activeTab === 'abunzi' && styles.tabTextActive]}>Abunzi Operations</Text>
             </Pressable>
           )}
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
        ) : activeTab === 'disputes' || activeTab === 'abunzi' ? (
          disputes
            .filter(d => activeTab === 'abunzi' ? d.district?.toLowerCase() === user?.district?.toLowerCase() : d.reportedById === user?.id)
            .map((dispute) => (
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
            ))
        ) : (
          anomalies.map((anomaly) => (
            <View key={anomaly.id} style={styles.disputeCard}>
              <View style={styles.cardHeader}>
                <View style={styles.idContainer}>
                  <MaterialIcons name="report-problem" size={16} color={Colors.accent} />
                  <Text style={[styles.disputeId, { color: Colors.accent }]}>#{anomaly.id.slice(-6).toUpperCase()}</Text>
                </View>
                <View style={[styles.statusBadge, anomaly.status === 'PENDING' ? styles.statusInvestigation : styles.statusResolved]}>
                    <Text style={[styles.statusText, anomaly.status === 'PENDING' ? styles.statusTextInvestigation : styles.statusTextResolved]}>
                      {anomaly.status}
                    </Text>
                </View>
              </View>

              <Text style={styles.disputeType}>{anomaly.type}</Text>
              <Text style={styles.disputeDescription}>{anomaly.description}</Text>
              
              {anomaly.imageUrl && (
                <Pressable onPress={() => Alert.alert("Evidence", "Image URL: " + anomaly.imageUrl)}>
                  <Text style={{ color: Colors.primary, fontSize: 12, marginBottom: 12, fontWeight: 'bold' }}>View Attached Photo</Text>
                </Pressable>
              )}

              <View style={styles.divider} />
              
              <View style={styles.cardFooter}>
                <View style={styles.locationRow}>
                  <MaterialIcons name="map" size={14} color={Colors.textTertiary} />
                  <Text style={styles.disputeLocation}>{anomaly.location?.split(',')[0]}...</Text>
                </View>
                <Text style={styles.dateText}>{new Date(anomaly.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>
          ))
        )}

        {!loading && (
          (activeTab === 'disputes' && disputes.filter(d => d.reportedById === user?.id).length === 0) ||
          (activeTab === 'reports' && anomalies.length === 0) ||
          (activeTab === 'abunzi' && disputes.filter(d => d.district?.toLowerCase() === user?.district?.toLowerCase()).length === 0)
        ) && (
           <View style={{ alignItems: 'center', marginTop: 60 }}>
              <MaterialIcons name="inbox" size={64} color={Colors.border} />
              <Text style={{ textAlign: 'center', marginTop: 12, color: Colors.textSecondary, fontWeight: 'bold' }}>No records found in this category.</Text>
           </View>
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
