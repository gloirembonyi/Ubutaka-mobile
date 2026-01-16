
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, User } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';

interface ReportAnomalyScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  user: User | null;
  params?: {
    type?: string;
    upi?: string;
  };
}

const ReportAnomalyScreen: React.FC<ReportAnomalyScreenProps> = ({ onNavigate, user, params }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [upi, setUpi] = useState(params?.upi || '');
  const [description, setDescription] = useState('');
  const [anomalyType, setAnomalyType] = useState(params?.type || 'Boundary Conflict');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  if (isSubmitted) {
    return (
      <View style={GlobalStyles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
            <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Report Received</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.successContent}>
          <View style={[styles.successIcon, { backgroundColor: getColorWithOpacity(Colors.success, 0.1) }]}>
            <MaterialIcons name="check-circle" size={80} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Thank You for Reporting</Text>
          <Text style={styles.successText}>
            Your report (ticket #88291) has been securely received by the NLA. You will be notified once our verification team reviews the anomaly.
          </Text>
          <Pressable 
            style={[styles.submitButton, { width: '100%', marginTop: 24 }]} 
            onPress={() => onNavigate('dashboard')}
          >
            <Text style={styles.submitButtonText}>Return to Dashboard</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const StepCircle = ({ step, label }: { step: number, label: string }) => (
    <View style={styles.stepHeader}>
      <View style={styles.stepCircle}>
        <Text style={styles.stepNumber}>{step}</Text>
      </View>
      <Text style={styles.stepLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => onNavigate(user?.role === 'ABUNZI' ? 'abunzi-dashboard' : 'dashboard')} 
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Report {anomalyType === 'Dispute' ? 'Dispute' : 'Anomaly'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.intro}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.title}>Something looks wrong?</Text>
          <Text style={styles.subtitle}>
            Verify land data or report suspicious activity to protect your rights. Your report helps maintain registry integrity.
          </Text>
        </View>

        {/* Step 1: Affected Land */}
        <View style={styles.card}>
          <StepCircle step={1} label="Affected Land" />
          <Text style={styles.inputLabel}>Parcel Identifier (UPI)</Text>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              placeholder="e.g. 1/02/03/04/123"
              value={upi}
              onChangeText={setUpi}
              placeholderTextColor={Colors.textTertiary}
            />
            <MaterialIcons name="grid-3x3" size={20} color={Colors.textTertiary} />
          </View>
          
          <View style={styles.orDivider}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>

          <Pressable style={styles.locationButton}>
            <MaterialIcons name="my-location" size={20} color={Colors.primary} />
            <Text style={styles.locationButtonText}>Use Current Location</Text>
          </Pressable>
        </View>

        {/* Step 2: Issue Details */}
        <View style={styles.card}>
          <StepCircle step={2} label="Issue Details" />
          <Text style={styles.inputLabel}>Anomaly Type</Text>
          <Pressable style={styles.selectInput}>
            <Text style={styles.selectText}>Select the type of error</Text>
            <MaterialIcons name="expand-more" size={24} color={Colors.textSecondary} />
          </Pressable>

          <Text style={styles.inputLabel}>Description</Text>
          <View style={[styles.inputContainer, { height: 100, alignItems: 'flex-start' }]}>
            <TextInput 
              style={[styles.input, { height: '100%', textAlignVertical: 'top', paddingTop: 12 }]}
              placeholder="Please describe the issue..."
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={Colors.textTertiary}
              multiline
            />
          </View>
        </View>

        {/* Step 3: Evidence */}
        <View style={styles.card}>
          <StepCircle step={3} label="Evidence" />
          <Pressable 
            style={[styles.uploadArea, attachedFile ? styles.uploadAreaActive : {}]}
            onPress={() => {
                if (attachedFile) {
                    setAttachedFile(null); // Clear if already selected
                } else {
                    // Simulate file picker
                    const mockFile = 'title_deed_scan.pdf';
                    setAttachedFile(mockFile);
                }
            }}
          >
            <View style={[styles.uploadIconCircle, attachedFile ? { backgroundColor: Colors.success } : {}]}>
              <MaterialIcons name={attachedFile ? "check" : "cloud-upload"} size={24} color={Colors.white} />
            </View>
            <Text style={styles.uploadTitle}>
                {attachedFile ? attachedFile : 'Click to upload or drag and drop'}
            </Text>
            <Text style={styles.uploadSub}>
                {attachedFile ? 'Tap again to remove' : 'Photos, Title Deeds, or ID Copies (Max 10MB)'}
            </Text>
          </Pressable>
        </View>

        <View style={styles.legalBox}>
          <MaterialIcons name="info" size={20} color={'#D97706'} />
          <View style={{ flex: 1 }}>
            <Text style={styles.legalTitle}>Legal Notice</Text>
            <Text style={styles.legalText}>
              Providing false information to the land registry is punishable by law under Article 24 of the Land Law. Please ensure all details are accurate.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={[styles.submitButton, loading && { opacity: 0.7 }]}
          onPress={async () => {
            if (!upi || !description) {
              alert('Please fill in all fields');
              return;
            }
            setLoading(true);
            try {
              const response = await fetch(API_ENDPOINTS.DISPUTES, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  upi,
                  type: anomalyType,
                  status: 'Investigation',
                  dateOpened: new Date().toLocaleDateString(),
                  parties: user?.name || 'Citizen',
                  description,
                  location: 'Sector Office', // Default
                  district: user?.district || 'Kigali',
                  reportedById: user?.id
                })
              });
              if (response.ok) {
                setIsSubmitted(true);
              } else {
                alert('Failed to submit report. Please try again.');
              }
            } catch (err) {
              console.error('Submit report error:', err);
              alert('Network error. Please check your connection.');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
        >
          {loading ? (
             <ActivityIndicator color={Colors.white} />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Submit Report</Text>
              <MaterialIcons name="send" size={20} color={Colors.white} />
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  content: { padding: 20 },
  intro: { marginBottom: 24, paddingHorizontal: 4 },
  progressDots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E2E8F0' },
  dotActive: { width: 24, backgroundColor: '#0F766E' },
  title: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(15, 118, 110, 0.1)', alignItems: 'center', justifyContent: 'center' },
  stepNumber: { color: '#0F766E', fontWeight: 'bold', fontSize: 14 },
  stepLabel: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  
  inputLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 8, marginLeft: 4 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  input: { flex: 1, fontSize: 14, color: Colors.textPrimary },
  
  orDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 16, gap: 16 },
  line: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  orText: { fontSize: 12, color: Colors.textTertiary, fontWeight: 'bold' },
  
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 118, 110, 0.05)',
    padding: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(15, 118, 110, 0.2)',
  },
  locationButtonText: { color: Colors.primary, fontWeight: 'bold', fontSize: 14 },
  
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 16,
  },
  selectText: { color: Colors.textSecondary, fontSize: 14 },
  
  uploadArea: {
    borderWidth: 2,
    borderColor: '#94A3B8',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  uploadAreaActive: {
      borderColor: Colors.success,
      backgroundColor: '#F0FDF4',
      borderStyle: 'solid',
  },
  uploadIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
  uploadSub: { fontSize: 10, color: Colors.textTertiary },
  
  legalBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    padding: 16,
    borderRadius: 16,
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  legalTitle: { fontSize: 12, fontWeight: 'bold', color: '#92400E', marginBottom: 2 },
  legalText: { fontSize: 11, color: '#92400E', lineHeight: 16 },
  
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: 20,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  submitButton: {
    backgroundColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: { color: Colors.white, fontSize: 16, fontWeight: 'bold' },
  
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successTitle: { fontSize: 24, fontWeight: '900', color: Colors.textPrimary, textAlign: 'center', marginBottom: 16 },
  successText: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 24 },
});

export default ReportAnomalyScreen;
