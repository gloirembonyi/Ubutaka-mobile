
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';

interface VerificationScreenProps {
  onNavigate: (screen: Screen) => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ onNavigate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.headerTitle}>Biometric Verification</Text>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <MaterialIcons name="fingerprint" size={64} color="#3b82f6" />
          <Text style={styles.title}>Identity Verified</Text>
          <Text style={styles.subtitle}>Your biometric identity is active and verified</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#0f172a', textAlign: 'center', marginRight: 40 },
  content: { flex: 1, padding: 24 },
  card: { alignItems: 'center', backgroundColor: '#f8fafc', padding: 32, borderRadius: 16, gap: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center' },
});

export default VerificationScreen;
