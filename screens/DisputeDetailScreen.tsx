
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, TextInput, Image, Alert, FlatList } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';
import { User, Dispute, Screen } from '../types';
import SyncService from '../services/SyncService';

interface DisputeDetailScreenProps {
  onNavigate: (screen: Screen) => void;
  disputeId: string | null;
  user: User | null;
}

type PortalTab = 'info' | 'parties' | 'evidence' | 'decision';

const DisputeDetailScreen: React.FC<DisputeDetailScreenProps> = ({ onNavigate, disputeId, user }) => {
  const [activeTab, setActiveTab] = useState<PortalTab>('info');
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Portal form states
  const [newStatement, setNewStatement] = useState('');
  const [newDecision, setNewDecision] = useState('');

  useEffect(() => {
    fetchDispute();
  }, [disputeId]);

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

  const handleUpdateDispute = async (updates: Partial<Dispute>) => {
    if (!dispute) return;
    setSubmitting(true);
    try {
        const response = await SyncService.fetchWithSync(API_ENDPOINTS.DISPUTE_BY_ID(dispute.id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        }) as any;

        if (response.ok) {
            Alert.alert(response.queued ? 'Saved Offline' : 'Success', 'Case file updated successfully.');
            if (!response.queued) fetchDispute(); // Refresh if online
        }
    } catch (err) {
        Alert.alert('Error', 'Failed to update case file.');
    } finally {
        setSubmitting(false);
    }
  };

  const parseJson = (str?: string) => {
    try {
      return str ? JSON.parse(str) : [];
    } catch (e) {
      return [];
    }
  };

  if (loading) {
    return (
      <View style={[GlobalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 12, color: Colors.textSecondary }}>Opening Case File...</Text>
      </View>
    );
  }

  if (!dispute) {
    return (
      <View style={[GlobalStyles.container, { justifyContent: 'center', alignItems: 'center', padding: 40 }]}>
        <MaterialIcons name="error-outline" size={64} color={Colors.error} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16 }}>Dispute Not Found</Text>
        <Pressable onPress={() => onNavigate('abunzi-dashboard')} style={{ marginTop: 20 }}>
          <Text style={{ color: Colors.primary }}>Return to Registry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable 
          onPress={() => onNavigate(user?.role === 'ABUNZI' ? 'abunzi-dashboard' : 'dispute-list')} 
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>Abunzi Portal</Text>
          <Text style={styles.headerSub}>Case Ref: {dispute.id.slice(-6).toUpperCase()}</Text>
        </View>
        <Pressable style={styles.shareButton}>
          <MaterialIcons name="print" size={20} color={Colors.primary} />
        </Pressable>
      </View>

      {/* Info Banner */}
      <View style={styles.banner}>
        <View style={styles.statusRow}>
           <View style={[styles.statusBadge, { backgroundColor: getColorWithOpacity(Colors.warning, 0.1) }]}>
             <Text style={[styles.statusText, { color: Colors.warning }]}>{dispute.status}</Text>
           </View>
           <Text style={styles.dateText}>Opened: {dispute.dateOpened}</Text>
        </View>
        <Text style={styles.disputeType}>{dispute.type} Dispute</Text>
        <View style={styles.locationRow}>
           <MaterialIcons name="location-on" size={16} color={Colors.textTertiary} />
           <Text style={styles.locationText}>{dispute.location}, {dispute.district}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
          {[
            { id: 'info', icon: 'info', label: 'Summary' },
            { id: 'parties', icon: 'people', label: 'Statements' },
            { id: 'evidence', icon: 'attach-file', label: 'Evidence' },
            { id: 'decision', icon: 'gavel', label: 'Verdict' },
          ].map((tab) => (
            <Pressable 
              key={tab.id}
              onPress={() => setActiveTab(tab.id as PortalTab)}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            >
              <MaterialIcons 
                name={tab.icon as any} 
                size={18} 
                color={activeTab === tab.id ? Colors.primary : Colors.textTertiary} 
              />
              <Text style={[styles.tabLabel, activeTab === tab.id && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        
        {activeTab === 'info' && (
          <View style={styles.section}>
            <View style={styles.summaryCard}>
              <Text style={styles.sectionTitle}>Case Description</Text>
              <Text style={styles.descriptionText}>{dispute.description}</Text>
              
              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Attached Land (UPI)</Text>
              <View style={styles.upiCard}>
                 <Ionicons name="map-outline" size={24} color={Colors.primary} />
                 <Text style={styles.upiText}>{dispute.upi}</Text>
                 <Pressable style={styles.viewMapBtn}>
                   <Text style={styles.viewMapText}>View Map</Text>
                 </Pressable>
              </View>
            </View>

            {dispute.type === 'Inheritance' && (
              <View style={styles.summaryCard}>
                <Text style={styles.sectionTitle}>Family Tree Visualization</Text>
                <Text style={styles.descriptionText}>Digital mapping of familial ties related to this parcel of land.</Text>
                <Pressable style={styles.treeBtn}>
                  <MaterialIcons name="account-tree" size={20} color={Colors.white} />
                  <Text style={styles.treeBtnText}>Generate Detailed Tree</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {activeTab === 'parties' && (
          <View style={styles.section}>
             <Text style={styles.sectionTitle}>Official Statements</Text>
             {parseJson(dispute.statements).length === 0 ? (
               <View style={styles.emptyCard}>
                 <Text style={styles.emptyText}>No statements recorded yet.</Text>
               </View>
             ) : (
               parseJson(dispute.statements).map((s: any, i: number) => (
                 <View key={i} style={styles.statementCard}>
                   <View style={styles.statementHeader}>
                     <Text style={styles.statementAuthor}>{s.author}</Text>
                     <Text style={styles.statementDate}>{s.date}</Text>
                   </View>
                   <Text style={styles.statementText}>{s.content}</Text>
                 </View>
               ))
             )}

             <View style={styles.addSection}>
               <Text style={styles.inputLabel}>Add New Party Statement</Text>
               <TextInput 
                 style={styles.textArea}
                 placeholder="Type oral statement here..."
                 multiline
                 value={newStatement}
                 onChangeText={setNewStatement}
               />
               <Pressable 
                style={styles.addBtn}
                onPress={() => {
                  if (!newStatement) return;
                  const current = parseJson(dispute.statements);
                  const updated = [...current, { author: 'Party Participant', date: new Date().toLocaleDateString(), content: newStatement }];
                  handleUpdateDispute({ statements: JSON.stringify(updated) });
                  setNewStatement('');
                }}
               >
                 <Text style={styles.addBtnText}>Record Statement</Text>
               </Pressable>
             </View>
          </View>
        )}

        {activeTab === 'evidence' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Digital Evidence Vault</Text>
            <View style={styles.evidenceGrid}>
               <Pressable style={styles.addEvidenceBox}>
                  <MaterialIcons name="add-a-photo" size={32} color={Colors.primary} />
                  <Text style={styles.addEvidenceText}>Upload Photo</Text>
               </Pressable>
               <Pressable style={styles.addEvidenceBox}>
                  <MaterialIcons name="upload-file" size={32} color={Colors.primary} />
                  <Text style={styles.addEvidenceText}>Scan Document</Text>
               </Pressable>
            </View>

            {parseJson(dispute.evidence).length > 0 && (
                <View style={{ marginTop: 20 }}>
                    <Text style={styles.subTitle}>Attached Files</Text>
                    {/* Map existing evidence here */}
                </View>
            )}
          </View>
        )}

        {activeTab === 'decision' && (
          <View style={styles.section}>
             <View style={styles.decisionWarning}>
               <MaterialIcons name="gavel" size={24} color={'#92400E'} />
               <Text style={styles.warningText}>Final decisions entered here are legally binding and will update the registry.</Text>
             </View>

             <Text style={styles.sectionTitle}>Record Minutes & Resolution</Text>
             <TextInput 
               style={[styles.textArea, { height: 180 }]}
               placeholder="Describe the agreed resolution in detail..."
               multiline
               value={newDecision}
               onChangeText={setNewDecision}
             />
             
             <View style={styles.decisionHistory}>
                <Text style={styles.subTitle}>Previous Minutes</Text>
                {parseJson(dispute.decisions).length === 0 ? (
                  <Text style={styles.emptyText}>No minutes recorded yet.</Text>
                ) : (
                  parseJson(dispute.decisions).map((d: any, i: number) => (
                    <View key={i} style={styles.historyItem}>
                      <Text style={styles.historyDate}>{d.date}</Text>
                      <Text style={styles.historyText}>{d.text}</Text>
                    </View>
                  ))
                )}
             </View>

             <Pressable 
              style={[styles.verdictBtn, submitting && { opacity: 0.7 }]}
              onPress={() => {
                if (!newDecision) return;
                const current = parseJson(dispute.decisions);
                const updated = [...current, { date: new Date().toLocaleDateString(), text: newDecision }];
                handleUpdateDispute({ 
                    decisions: JSON.stringify(updated),
                    status: 'Resolved' 
                });
                setNewDecision('');
              }}
              disabled={submitting}
             >
                <Text style={styles.verdictBtnText}>Submit Certified Verdict</Text>
                <MaterialIcons name="verified" size={20} color={Colors.white} />
             </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerInfo: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  headerSub: { fontSize: 10, color: Colors.textTertiary, letterSpacing: 1, textTransform: 'uppercase' },
  shareButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: getColorWithOpacity(Colors.primary, 0.05), alignItems: 'center', justifyContent: 'center' },
  
  banner: { padding: 20, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  dateText: { fontSize: 11, color: Colors.textTertiary },
  disputeType: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { fontSize: 13, color: Colors.textSecondary },

  tabsContainer: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  tabsScroll: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  tab: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: Colors.borderLight 
  },
  tabActive: { backgroundColor: getColorWithOpacity(Colors.primary, 0.1), borderColor: Colors.primary },
  tabLabel: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
  tabLabelActive: { color: Colors.primary, fontWeight: 'bold' },

  content: { flex: 1, backgroundColor: '#F8FAFC' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 12 },
  subTitle: { fontSize: 14, fontWeight: '700', color: Colors.textSecondary, marginBottom: 10, marginTop: 10 },
  
  summaryCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  descriptionText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 16 },
  
  upiCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', padding: 16, borderRadius: 16, gap: 12 },
  upiText: { flex: 1, fontSize: 15, fontWeight: 'bold', color: Colors.textPrimary },
  viewMapBtn: { backgroundColor: Colors.white, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1' },
  viewMapText: { fontSize: 12, color: Colors.primary, fontWeight: 'bold' },
  
  treeBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: Colors.primary, padding: 16, borderRadius: 16, justifyContent: 'center', marginTop: 16 },
  treeBtnText: { color: Colors.white, fontWeight: 'bold' },

  emptyCard: { padding: 40, alignItems: 'center' },
  emptyText: { color: Colors.textTertiary, fontStyle: 'italic' },
  
  statementCard: { backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.borderLight },
  statementHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  statementAuthor: { fontSize: 12, fontWeight: 'bold', color: Colors.primary },
  statementDate: { fontSize: 10, color: Colors.textTertiary },
  statementText: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20 },
  
  addSection: { marginTop: 20, backgroundColor: Colors.white, padding: 16, borderRadius: 20 },
  inputLabel: { fontSize: 12, fontWeight: '700', color: Colors.textSecondary, marginBottom: 10 },
  textArea: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 16, height: 100, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E2E8F0', fontSize: 14 },
  addBtn: { backgroundColor: Colors.primary, padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  addBtnText: { color: Colors.white, fontWeight: 'bold' },

  evidenceGrid: { flexDirection: 'row', gap: 12 },
  addEvidenceBox: { flex: 1, height: 100, borderStyle: 'dashed', borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 16, alignItems: 'center', justifyContent: 'center', gap: 6 },
  addEvidenceText: { fontSize: 11, fontWeight: 'bold', color: Colors.primary },

  decisionWarning: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFBEB', padding: 16, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#FEF3C7' },
  warningText: { flex: 1, fontSize: 12, color: '#92400E', fontWeight: 'bold', lineHeight: 18 },
  
  decisionHistory: { marginTop: 24, paddingBottom: 20 },
  historyItem: { marginBottom: 16, borderLeftWidth: 2, borderLeftColor: Colors.primary, paddingLeft: 12 },
  historyDate: { fontSize: 10, fontWeight: 'bold', color: Colors.textTertiary, marginBottom: 4 },
  historyText: { fontSize: 13, color: Colors.textSecondary },

  verdictBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    backgroundColor: '#059669', 
    padding: 18, 
    borderRadius: 18, 
    marginTop: 20,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  verdictBtnText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' }
});

export default DisputeDetailScreen;
