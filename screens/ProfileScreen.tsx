
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, User } from '../types';
import { MOCK_USER } from '../constants';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface ProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onLogout: () => void | Promise<void>;
  user: User | null;
}

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=';

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onNavigate, theme, onLogout, user }) => {
  const displayUser = user || MOCK_USER;
  const isDark = theme === 'dark';

  return (
    <View style={[GlobalStyles.container, isDark && styles.containerDark]}>
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop' }}
        style={styles.headerBackground}
        imageStyle={{ opacity: 0.15 }}
      >
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.topBar}>
            <Text style={[styles.headerTitle, isDark && styles.textDark]}>My Profile</Text>
            <Pressable 
              onPress={() => onNavigate('settings')}
              style={[styles.settingsButton, isDark && styles.settingsButtonDark]}
            >
              <MaterialIcons name="settings" size={24} color={isDark ? Colors.white : Colors.textPrimary} />
            </Pressable>
          </View>
          
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: displayUser.avatar || `${DEFAULT_AVATAR}${encodeURIComponent(displayUser.name)}` }} 
                  style={styles.avatar} 
                />
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="verified" size={16} color={Colors.white} />
                </View>
              </View>
              <View style={styles.nameSection}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[styles.name, isDark && styles.textDark]}>{displayUser.name}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: displayUser.role === 'ABUNZI' ? Colors.warning : Colors.primary }]}>
                    <Text style={styles.roleBadgeText}>{displayUser.role}</Text>
                  </View>
                </View>
                <Text style={styles.idText}>NID: {displayUser.nationalId}</Text>
                {displayUser.district && (
                  <View style={styles.locationTag}>
                    <MaterialIcons name="location-on" size={12} color={Colors.textSecondary} />
                    <Text style={styles.locationTabText}>{displayUser.district}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, isDark && styles.textDark]}>
                  {displayUser.role === 'ABUNZI' ? '8' : '2'}
                </Text>
                <Text style={styles.statLabel}>{displayUser.role === 'ABUNZI' ? 'Cases' : 'Parcels'}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, isDark && styles.textDark]}>
                  {displayUser.role === 'ABUNZI' ? '96%' : '1'}
                </Text>
                <Text style={styles.statLabel}>{displayUser.role === 'ABUNZI' ? 'Success' : 'Pending'}</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statValue, isDark && styles.textDark]}>
                  {displayUser.role === 'ABUNZI' ? 'Abunzi' : 'Citizen'}
                </Text>
                <Text style={styles.statLabel}>Level</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 160 }]}
      >
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Digital Identity</Text>
        </View>

        {/* Digital ID Card */}
        <View style={styles.idCard}>
          <View style={styles.idCardHeader}>
            <Image 
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Coat_of_arms_of_Rwanda.svg/1200px-Coat_of_arms_of_Rwanda.svg.png' }}
              style={styles.coatOfArms}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.republicText}>REPUBLIC OF RWANDA</Text>
              <Text style={styles.idTitle}>NATIONAL ID CARD</Text>
            </View>
          </View>
          <View style={styles.idCardContent}>
            <Image 
              source={{ uri: displayUser.avatar || `${DEFAULT_AVATAR}${encodeURIComponent(displayUser.name)}` }} 
              style={styles.idAvatar} 
            />
            <View style={styles.idDetails}>
              <View>
                <Text style={styles.idLabel}>Names</Text>
                <Text style={styles.idValue}>{displayUser.name}</Text>
              </View>
              <View>
                <Text style={styles.idLabel}>National ID No</Text>
                <Text style={styles.idValue}>{displayUser.nationalId}</Text>
              </View>
              <View style={styles.idRow}>
                <View>
                  <Text style={styles.idLabel}>Residence</Text>
                  <Text style={styles.idValue}>{displayUser.district || 'Kigali'}</Text>
                </View>
                <View>
                  <Text style={styles.idLabel}>Issue Date</Text>
                  <Text style={styles.idValue}>12/01/2024</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.idCardFooter}>
            <View style={styles.activeStatus}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>ACTIVE</Text>
            </View>
            <MaterialIcons name="qr-code" size={24} color={Colors.textPrimary} />
          </View>
        </View>

        <View style={styles.menuGrid}>
          <Pressable style={[styles.menuItem, isDark && styles.menuItemDark]}>
            <View style={[styles.menuIcon, { backgroundColor: getColorWithOpacity(Colors.primary, 0.1) }]}>
              <MaterialIcons name="folder-shared" size={24} color={Colors.primary} />
            </View>
            <Text style={[styles.menuLabel, isDark && styles.textDark]}>My Documents</Text>
          </Pressable>
          <Pressable style={[styles.menuItem, isDark && styles.menuItemDark]}>
            <View style={[styles.menuIcon, { backgroundColor: getColorWithOpacity(Colors.success, 0.1) }]}>
              <MaterialIcons name="history" size={24} color={Colors.success} />
            </View>
            <Text style={[styles.menuLabel, isDark && styles.textDark]}>History</Text>
          </Pressable>
          <Pressable style={[styles.menuItem, isDark && styles.menuItemDark]}>
            <View style={[styles.menuIcon, { backgroundColor: getColorWithOpacity(Colors.warning, 0.1) }]}>
              <MaterialIcons name="security" size={24} color={Colors.warning} />
            </View>
            <Text style={[styles.menuLabel, isDark && styles.textDark]}>Security</Text>
          </Pressable>
          <Pressable 
            onPress={onLogout}
            style={[styles.menuItem, isDark && styles.menuItemDark]}
          >
            <View style={[styles.menuIcon, { backgroundColor: getColorWithOpacity(Colors.error, 0.1) }]}>
              <MaterialIcons name="logout" size={24} color={Colors.error} />
            </View>
            <Text style={[styles.menuLabel, isDark && styles.textDark, { color: Colors.error }]}>Logout</Text>
          </Pressable>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerDark: {
    backgroundColor: Colors.backgroundDark,
  },
  headerBackground: {
    paddingBottom: 24,
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  safeHeader: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  textDark: {
    color: Colors.white,
  },
  settingsButton: {
    padding: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  settingsButtonDark: {
    backgroundColor: getColorWithOpacity(Colors.white, 0.1),
  },
  profileCard: {
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.white,
    backgroundColor: Colors.border,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    padding: 6,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  nameSection: {
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  idText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.white,
  },
  locationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationTabText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: getColorWithOpacity(Colors.background, 0.5),
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 32,
    gap: 24,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  idCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    gap: 16,
  },
  idCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#C8E6C9',
    paddingBottom: 12,
  },
  coatOfArms: {
    width: 40,
    height: 40,
  },
  republicText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
    letterSpacing: 1,
  },
  idTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1B5E20',
  },
  idCardContent: {
    flexDirection: 'row',
    gap: 16,
  },
  idAvatar: {
    width: 80,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#C8E6C9',
  },
  idDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  idLabel: {
    fontSize: 10,
    color: '#388E3C',
    textTransform: 'uppercase',
  },
  idValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  idRow: {
    flexDirection: 'row',
    gap: 24,
  },
  idCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  activeStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#C8E6C9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2E7D32',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  menuItem: {
    width: '47%',
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItemDark: {
    backgroundColor: Colors.surfaceDark,
    borderColor: Colors.borderDark,
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
});

export default ProfileScreen;
