
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';

interface RegisterLandScreenProps {
  onNavigate: (screen: Screen) => void;
}

const RegisterLandScreen: React.FC<RegisterLandScreenProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.headerTitle}>Register New Land</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.progressBar}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={[styles.progressStep, s <= step && styles.progressStepActive]} />
          ))}
        </View>
        <Text style={styles.title}>Step {step} of 3</Text>
        <Text style={styles.subtitle}>Register your land parcel</Text>
        {step < 3 && (
          <Pressable style={styles.button} onPress={() => setStep(step + 1)}>
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        )}
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
  progressBar: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  progressStep: { flex: 1, height: 6, backgroundColor: '#f1f5f9', borderRadius: 3 },
  progressStepActive: { backgroundColor: '#3b82f6' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b' },
  button: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
});

export default RegisterLandScreen;
