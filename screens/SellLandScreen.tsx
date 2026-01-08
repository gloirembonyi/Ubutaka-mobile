
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';

interface SellLandScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SellLandScreen: React.FC<SellLandScreenProps> = ({ onNavigate }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.headerTitle}>Sell Land</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Sell Your Land</Text>
        <Text style={styles.subtitle}>Initiate a secure land sale transaction</Text>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Start Sale Process</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#0f172a', textAlign: 'center', marginRight: 40 },
  content: { padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b' },
  button: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default SellLandScreen;
