
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';

interface ReportAnomalyScreenProps {
  onNavigate: (screen: Screen) => void;
}

const ReportAnomalyScreen: React.FC<ReportAnomalyScreenProps> = ({ onNavigate }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (isSubmitted) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
          </Pressable>
          <Text style={styles.headerTitle}>Report Submitted</Text>
        </View>
        <View style={styles.successContent}>
          <MaterialIcons name="check-circle" size={64} color="#10b981" />
          <Text style={styles.successTitle}>Report Submitted</Text>
          <Text style={styles.successText}>Your anomaly report has been submitted successfully</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#1e293b" />
        </Pressable>
        <Text style={styles.headerTitle}>Report Anomaly</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.progress}>
          <View style={styles.progressActive} />
          <View style={styles.progressInactive} />
          <View style={styles.progressInactive} />
        </View>
        <Text style={styles.title}>Something looks wrong?</Text>
        <Text style={styles.subtitle}>Verify land data or report suspicious activity to protect your rights</Text>
        <Pressable style={styles.button} onPress={() => setIsSubmitted(true)}>
          <Text style={styles.buttonText}>Submit Report</Text>
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
  content: { padding: 24, gap: 24 },
  progress: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 32 },
  progressActive: { width: 32, height: 8, backgroundColor: '#3b82f6', borderRadius: 4 },
  progressInactive: { width: 8, height: 8, backgroundColor: '#e2e8f0', borderRadius: 4 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b', lineHeight: 20 },
  button: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 16 },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  successContent: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  successText: { fontSize: 14, color: '#64748b', textAlign: 'center' },
});

export default ReportAnomalyScreen;
