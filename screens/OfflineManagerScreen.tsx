
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface OfflineManagerScreenProps {
  onNavigate: (screen: Screen) => void;
}

const OfflineManagerScreen: React.FC<OfflineManagerScreenProps> = ({ onNavigate }) => {
  return (
    <ScrollView style={GlobalStyles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Offline Manager</Text>
      </View>
      <View style={styles.content}>
        <MaterialIcons name="cloud-off" size={64} color={Colors.textTertiary} />
        <Text style={styles.title}>Offline Mode</Text>
        <Text style={styles.subtitle}>Manage your land data offline</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'center', marginRight: 40 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16, marginTop: 100 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.textPrimary },
  subtitle: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' },
});

export default OfflineManagerScreen;
