
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  language: 'RW' | 'EN';
  toggleLanguage: () => void;
  onLogout: () => void | Promise<void>;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  onNavigate, 
  theme, 
  toggleTheme,
  language,
  toggleLanguage,
  onLogout
}) => {
  const isDark = theme === 'dark';
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [location, setLocation] = useState(true);

  const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, isDark && styles.textDark]}>{title}</Text>
      <View style={[styles.sectionContent, isDark && styles.sectionContentDark]}>
        {children}
      </View>
    </View>
  );

  const SettingItem = ({ 
    icon, 
    label, 
    value, 
    type = 'arrow', 
    onPress,
    color = Colors.primary 
  }: { 
    icon: any, 
    label: string, 
    value?: string | boolean, 
    type?: 'arrow' | 'switch' | 'value', 
    onPress?: () => void,
    color?: string
  }) => (
    <Pressable 
      style={({ pressed }) => [
        styles.settingItem, 
        pressed && type !== 'switch' && styles.pressed
      ]}
      onPress={type === 'switch' ? undefined : onPress}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: getColorWithOpacity(color, 0.1) }]}>
          <MaterialIcons name={icon} size={20} color={color} />
        </View>
        <Text style={[styles.settingLabel, isDark && styles.textDark]}>{label}</Text>
      </View>
      
      <View style={styles.settingRight}>
        {type === 'switch' && (
          <Switch 
            value={value as boolean}
            onValueChange={onPress}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor={Colors.white}
          />
        )}
        {type === 'value' && (
          <Text style={styles.valueText}>{value as string}</Text>
        )}
        {type === 'arrow' && (
          <MaterialIcons name="chevron-right" size={24} color={Colors.textTertiary} />
        )}
      </View>
    </Pressable>
  );

  return (
    <View style={[GlobalStyles.container, isDark && styles.containerDark]}>
      <SafeAreaView edges={['top']} style={GlobalStyles.safeArea}>
        <View style={[styles.header, isDark && styles.headerDark]}>
          <Pressable onPress={() => onNavigate('profile')} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={isDark ? Colors.white : Colors.textPrimary} />
          </Pressable>
          <Text style={[styles.headerTitle, isDark && styles.textDark]}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          
          <Section title="App Preferences">
            <SettingItem 
              icon="dark-mode" 
              label="Dark Mode" 
              type="switch" 
              value={isDark} 
              onPress={toggleTheme}
              color={Colors.textPrimary}
            />
            <View style={[styles.divider, isDark && styles.dividerDark]} />
            <SettingItem 
              icon="language" 
              label="Language" 
              type="value" 
              value={language === 'RW' ? 'Kinyarwanda' : 'English'} 
              onPress={toggleLanguage}
              color={Colors.textPrimary}
            />
            <View style={[styles.divider, isDark && styles.dividerDark]} />
            <SettingItem 
              icon="notifications" 
              label="Notifications" 
              type="switch" 
              value={notifications} 
              onPress={() => setNotifications(!notifications)}
              color={Colors.accent}
            />
          </Section>

          <Section title="Privacy & Security">
            <SettingItem 
              icon="fingerprint" 
              label="Biometric Login" 
              type="switch" 
              value={biometric} 
              onPress={() => setBiometric(!biometric)}
              color={Colors.success}
            />
            <View style={[styles.divider, isDark && styles.dividerDark]} />
            <SettingItem 
              icon="location-on" 
              label="Location Services" 
              type="switch" 
              value={location} 
              onPress={() => setLocation(!location)}
              color={Colors.error}
            />
            <View style={[styles.divider, isDark && styles.dividerDark]} />
            <SettingItem 
              icon="lock" 
              label="Change Password" 
              onPress={() => {}} 
              color={Colors.primary}
            />
          </Section>

          <Section title="Support">
            <SettingItem 
              icon="help" 
              label="Help Center" 
              onPress={() => onNavigate('support')} 
              color={Colors.info}
            />
            <View style={[styles.divider, isDark && styles.dividerDark]} />
            <SettingItem 
              icon="info" 
              label="About Ubutaka" 
              onPress={() => {}} 
              color={Colors.info}
            />
          </Section>

          <Pressable style={styles.logoutButton} onPress={onLogout}>
            <MaterialIcons name="logout" size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
          
          <Text style={styles.versionText}>Version 1.0.0 (Build 42)</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerDark: {
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: getColorWithOpacity(Colors.background, 0.95),
  },
  headerDark: {
    backgroundColor: getColorWithOpacity(Colors.backgroundDark, 0.95),
    borderBottomColor: Colors.borderDark,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  textDark: {
    color: Colors.white,
  },
  content: {
    padding: 20,
    gap: 24,
    paddingBottom: 150,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginLeft: 8,
  },
  sectionContent: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  sectionContentDark: {
    backgroundColor: Colors.surfaceDark,
    borderColor: Colors.borderDark,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  pressed: {
    backgroundColor: getColorWithOpacity(Colors.primary, 0.05),
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  valueText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 64,
  },
  dividerDark: {
    backgroundColor: Colors.borderDark,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: getColorWithOpacity(Colors.error, 0.1),
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 8,
  },
});

export default SettingsScreen;
