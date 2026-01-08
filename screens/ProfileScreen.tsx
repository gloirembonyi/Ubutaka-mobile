
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { MOCK_USER } from '../constants';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate, theme, toggleTheme }) => {
  return (
    <ScrollView style={[styles.container, theme === 'dark' && styles.containerDark]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, theme === 'dark' && styles.textDark]}>Profile & Settings</Text>
      </View>

      <View style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
            <Pressable style={styles.editButton}>
              <MaterialIcons name="edit" size={16} color="#ffffff" />
            </Pressable>
          </View>
          <Text style={[styles.name, theme === 'dark' && styles.textDark]}>{MOCK_USER.name}</Text>
          <View style={styles.verifiedBadge}>
            <MaterialIcons name="verified" size={18} color="#3b82f6" />
            <Text style={styles.verifiedText}>Verified Citizen</Text>
          </View>
        </View>

        {/* ID Card */}
        <View style={[styles.card, theme === 'dark' && styles.cardDark]}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <MaterialIcons name="badge" size={24} color="#3b82f6" />
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardLabel}>National ID (NID)</Text>
              <Text style={styles.cardSub}>Rwanda Identification Agency</Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeText}>Active</Text>
            </View>
          </View>
          <Text style={[styles.idNumber, theme === 'dark' && styles.textDark]}>{MOCK_USER.nationalId}</Text>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <Text style={[styles.sectionTitle, theme === 'dark' && styles.textDark]}>Preferences</Text>
          <View style={[styles.settingItem, theme === 'dark' && styles.settingItemDark]}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="dark-mode" size={24} color="#64748b" />
              <Text style={[styles.settingLabel, theme === 'dark' && styles.textDark]}>Dark Mode</Text>
            </View>
            <Switch value={theme === 'dark'} onValueChange={toggleTheme} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  containerDark: {
    backgroundColor: '#0a0f1a',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#0f172a',
  },
  content: {
    padding: 20,
    gap: 24,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  editButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#3b82f6',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  verifiedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardIconContainer: {
    padding: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 8,
  },
  cardText: {
    flex: 1,
    marginLeft: 12,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardSub: {
    fontSize: 10,
    color: '#94a3b8',
  },
  activeBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#16a34a',
    textTransform: 'uppercase',
  },
  idNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    fontFamily: 'monospace',
  },
  settingsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  settingItemDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    fontSize: 16,
    color: '#0f172a',
  },
  textDark: {
    color: '#ffffff',
  },
});

export default ProfileScreen;
