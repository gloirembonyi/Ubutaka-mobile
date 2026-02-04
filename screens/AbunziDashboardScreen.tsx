
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, User, Dispute } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import MainHeader from '../components/MainHeader';
import { API_ENDPOINTS } from '../config/api';
import { useEffect } from 'react';

interface AbunziDashboardScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User | null;
}

const AbunziDashboardScreen: React.FC<AbunziDashboardScreenProps> = ({ onNavigate, user }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved'>('pending');
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDisputes = async () => {
    try {
      const url = API_ENDPOINTS.DISPUTES;
      console.log('Fetching disputes from:', url);
      const resp = await fetch(url);
      if (resp.ok) {
        const data: Dispute[] = await resp.json();
        // Filter by the Abunzi's district if they have one
        const filtered = user?.district 
          ? data.filter(d => d.district?.toLowerCase() === user.district?.toLowerCase())
          : data;
        setDisputes(filtered);
      } else {
        console.error('Failed to fetch disputes:', resp.status, resp.statusText);
      }
    } catch (err) {
      console.error('Fetch disputes error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [user]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDisputes();
  };

  const jobs = disputes.filter((d: Dispute) => 
    activeTab === 'pending' ? d.status !== 'Resolved' : d.status === 'Resolved'
  );

  const stats = {
    active: disputes.filter(d => d.status !== 'Resolved').length,
    today: disputes.filter(d => d.status === 'Investigation').length,
    resolved: disputes.filter(d => d.status === 'Resolved').length
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
            <Text style={styles.welcomeText}>Mediator Dashboard</Text>
            <Text style={styles.subtext}>Manage your assigned land disputes and mediation sessions.</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: getColorWithOpacity(Colors.primary, 0.1) }]}>
                <MaterialIcons name="gavel" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.statNumber}>{stats.active}</Text>
              <Text style={styles.statLabel}>Active Jobs</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: getColorWithOpacity(Colors.warning, 0.1) }]}>
                <MaterialIcons name="event" size={20} color={Colors.warning} />
              </View>
              <Text style={styles.statNumber}>{stats.today}</Text>
              <Text style={styles.statLabel}>In Review</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: getColorWithOpacity(Colors.success, 0.1) }]}>
                <MaterialIcons name="check-circle" size={20} color={Colors.success} />
              </View>
              <Text style={styles.statNumber}>{stats.resolved}</Text>
              <Text style={styles.statLabel}>Resolved</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>

          <View style={styles.quickActions}>
            <Pressable 
              style={styles.actionCard}
              onPress={() => onNavigate('dispute-list')}
            >
              <View style={[styles.actionIcon, { backgroundColor: getColorWithOpacity(Colors.primary, 0.1) }]}>
                <MaterialIcons name="list-alt" size={24} color={Colors.primary} />
              </View>
              <Text style={styles.actionText}>View All Disputes</Text>
            </Pressable>
            <Pressable 
              style={styles.actionCard}
              onPress={() => onNavigate('dispute-list')}
            >
              <View style={[styles.actionIcon, { backgroundColor: getColorWithOpacity(Colors.warning, 0.1) }]}>
                <MaterialIcons name="assignment-late" size={24} color={Colors.warning} />
              </View>
              <Text style={styles.actionText}>My Assignments</Text>
            </Pressable>
          </View>

          <View style={styles.tabs}>
            <Pressable 
              onPress={() => setActiveTab('pending')}
              style={[styles.tab, activeTab === 'pending' && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === 'pending' && styles.tabTextActive]}>Active Cases</Text>
            </Pressable>
            <Pressable 
              onPress={() => setActiveTab('resolved')}
              style={[styles.tab, activeTab === 'resolved' && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === 'resolved' && styles.tabTextActive]}>History</Text>
            </Pressable>
          </View>

          <View style={styles.jobsList}>
            {loading ? (
              <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
            ) : jobs.length > 0 ? jobs.map((job: Dispute) => (
              <Pressable 
                key={job.id}
                onPress={() => onNavigate('dispute-detail')}
                style={({ pressed }: { pressed: boolean }) => [
                  styles.jobCard,
                  pressed && GlobalStyles.pressed
                ]}
              >
                <View style={styles.jobHeader}>
                  <View style={styles.jobInfo}>
                    <Text style={styles.jobId}>#{job.id.slice(-6).toUpperCase()}</Text>
                    <Text style={styles.jobType}>{job.type} Dispute</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: job.status === 'Mediation' ? getColorWithOpacity(Colors.warning, 0.1) : getColorWithOpacity(Colors.primary, 0.1) }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: job.status === 'Mediation' ? Colors.warning : Colors.primary }
                    ]}>{job.status}</Text>
                  </View>
                </View>

                <Text style={styles.jobDescription} numberOfLines={2}>{job.description}</Text>
                
                <View style={styles.divider} />
                
                <View style={styles.jobFooter}>
                  <View style={styles.footerItem}>
                    <MaterialIcons name="location-on" size={14} color={Colors.textTertiary} />
                    <Text style={styles.footerText}>{job.location}</Text>
                  </View>
                  <View style={styles.footerItem}>
                    <MaterialIcons name="people" size={14} color={Colors.textTertiary} />
                    <Text style={styles.footerText}>{Array.isArray(job.parties) ? job.parties.length : 2} Parties</Text>
                  </View>
                </View>

                <Pressable 
                  onPress={() => onNavigate('mediation-room')}
                  style={styles.actionButton}
                >
                  <Text style={styles.actionButtonText}>Open Mediation Room</Text>
                  <MaterialIcons name="chevron-right" size={20} color={Colors.white} />
                </Pressable>
              </Pressable>
            )) : (
              <View style={styles.emptyState}>
                <MaterialIcons name="inbox" size={48} color={Colors.border} />
                <Text style={styles.emptyText}>No cases found for your district: {user?.district || 'Kigali'}</Text>
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
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 8,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
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
  jobsList: {
    paddingHorizontal: 24,
  },
  jobCard: {
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
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
  },
  jobId: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  jobType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
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
  jobDescription: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 12,
  },
  jobFooter: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  actionButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default AbunziDashboardScreen;
