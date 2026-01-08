
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';

interface InheritanceScreenProps {
  onNavigate: (screen: Screen) => void;
}

const InheritanceScreen: React.FC<InheritanceScreenProps> = ({ onNavigate }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('transactions')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.headerTitle}>Inheritance Transfer</Text>
        <Pressable style={styles.helpButton}>
          <MaterialIcons name="help" size={24} color="#1e293b" />
        </Pressable>
      </View>
      <View style={styles.content}>
        <View style={styles.heroCard}>
          <MaterialIcons name="security" size={48} color="#ffffff" />
          <Text style={styles.heroTitle}>Secure Transfer</Text>
          <Text style={styles.heroSubtitle}>Initiate a transparent, immutable land title transfer to heirs</Text>
        </View>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Start Inheritance Process</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  helpButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 24, gap: 24 },
  heroCard: { backgroundColor: '#1e3a5f', padding: 24, borderRadius: 24, alignItems: 'center', gap: 12 },
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
  heroSubtitle: { fontSize: 12, color: '#bfdbfe', textAlign: 'center' },
  button: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default InheritanceScreen;
