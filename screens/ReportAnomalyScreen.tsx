
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, ActivityIndicator, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Screen, User } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';
import SyncService from '../services/SyncService';

interface ReportAnomalyScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  user: User | null;
  params?: {
    type?: string;
    upi?: string;
    district?: string;
    sector?: string;
    cell?: string;
    village?: string;
  };
}

const ReportAnomalyScreen: React.FC<ReportAnomalyScreenProps> = ({ onNavigate, user, params }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isQueued, setIsQueued] = useState(false);
  const [loading, setLoading] = useState(false);
  const [upi, setUpi] = useState(params?.upi || '');
  const [description, setDescription] = useState('');
  const [anomalyType, setAnomalyType] = useState(params?.type || 'Illegal Construction');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleCaptureLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to tag the anomaly.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation(loc);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not get location. Ensure GPS is on.');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleCaptureImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Camera permission is required.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        setAttachedImage(result.assets[0].uri);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Could not access camera.');
    }
  };

  if (isSubmitted) {
    return (
      <View style={GlobalStyles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
            <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>{isQueued ? 'Report Saved' : 'Report Received'}</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.successContent}>
          <View style={[styles.successIcon, { backgroundColor: isQueued ? getColorWithOpacity(Colors.warning, 0.1) : getColorWithOpacity(Colors.success, 0.1) }]}>
            <MaterialIcons name={isQueued ? "cloud-off" : "check-circle"} size={80} color={isQueued ? Colors.warning : Colors.success} />
          </View>
          <Text style={styles.successTitle}>{isQueued ? 'Queued for Later' : 'Thank You for Reporting'}</Text>
          <Text style={styles.successText}>
            {isQueued 
              ? "You are currently offline. Your report has been saved locally and will be automatically transmitted when your connection returns."
              : "Your report has been securely received by the NLA. You will be notified once our verification team reviews the anomaly."}
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160 }}>
        <View style={styles.intro}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
          <Text style={styles.title}>Something looks wrong?</Text>
          <Text style={styles.subtitle}>
            Verify land data or report suspicious activity to protect community rights. GPS and photos are automatically encrypted.
          </Text>
        </View>

        {/* Step 1: Affected Land */}
        <View style={styles.card}>
          <StepCircle step={1} label="Land Location" />
          <Text style={styles.inputLabel}>Parcel Identifier (UPI - Optional if unknown)</Text>
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
            <Text style={styles.orText}>AND / OR</Text>
            <View style={styles.line} />
          </View>

          <Pressable 
            style={[styles.locationButton, location && { borderColor: Colors.success, backgroundColor: getColorWithOpacity(Colors.success, 0.05) }]}
            onPress={handleCaptureLocation}
            disabled={gettingLocation}
          >
            {gettingLocation ? (
              <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
              <>
                <MaterialIcons name={location ? "check-circle" : "my-location"} size={20} color={location ? Colors.success : Colors.primary} />
                <Text style={[styles.locationButtonText, location && { color: Colors.success }]}>
                  {location ? "GPS Coordinates Captured" : "Capture Current Location"}
                </Text>
              </>
            )}
          </Pressable>
          {location && (
            <Text style={styles.locationDetail}>
              Lat: {location.coords.latitude.toFixed(6)}, Lon: {location.coords.longitude.toFixed(6)}
            </Text>
          )}
        </View>

        {/* Step 2: Issue Details */}
        <View style={styles.card}>
          <StepCircle step={2} label="Issue Details" />
          <Text style={styles.inputLabel}>Anomaly Type</Text>
          <View style={styles.typeSelector}>
             {['Illegal Construction', 'Encroachment', 'Fraudulent Sale', 'Other'].map(type => (
               <Pressable 
                key={type}
                style={[styles.typeBadge, anomalyType === type && styles.typeBadgeActive]}
                onPress={() => setAnomalyType(type)}
               >
                 <Text style={[styles.typeBadgeText, anomalyType === type && styles.typeBadgeTextActive]}>{type}</Text>
               </Pressable>
             ))}
          </View>

          <Text style={styles.inputLabel}>Description</Text>
          <View style={[styles.inputContainer, { height: 100, alignItems: 'flex-start' }]}>
            <TextInput 
              style={[styles.input, { height: '100%', textAlignVertical: 'top', paddingTop: 12 }]}
              placeholder="Describe what you see. Keep it clear and objective..."
              value={description}
              onChangeText={setDescription}
              placeholderTextColor={Colors.textTertiary}
              multiline
            />
          </View>
        </View>

        {/* Step 3: Evidence */}
        <View style={styles.card}>
          <StepCircle step={3} label="Visual Evidence" />
          <Pressable 
            style={[styles.uploadArea, attachedImage ? styles.uploadAreaActive : {}]}
            onPress={handleCaptureImage}
          >
            {attachedImage ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: attachedImage }} style={styles.previewImage} />
                <View style={styles.previewOverlay}>
                  <MaterialIcons name="camera-alt" size={24} color={Colors.white} />
                  <Text style={styles.previewText}>Retake Photo</Text>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.uploadIconCircle}>
                  <MaterialIcons name="camera-alt" size={24} color={Colors.white} />
                </View>
                <Text style={styles.uploadTitle}>Snap a Photo</Text>
                <Text style={styles.uploadSub}>Use your camera to capture the anomaly clearly</Text>
              </>
            )}
          </Pressable>
        </View>

        <View style={styles.legalBox}>
          <MaterialIcons name="security" size={20} color={'#D97706'} />
          <View style={{ flex: 1 }}>
            <Text style={styles.legalTitle}>Citizen Protection</Text>
            <Text style={styles.legalText}>
              Your identity is protected under the Whistleblower Law. Data is encrypted end-to-end to ensure your safety.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable 
          style={[styles.submitButton, loading && { opacity: 0.7 }]}
          onPress={async () => {
            if (!description) {
              Alert.alert('Missing Info', 'Please provide a description of the issue.');
              return;
            }
            setLoading(true);
            try {
              const payload = {
                upi: upi || 'N/A',
                type: anomalyType,
                description,
                location: location ? `lat:${location.coords.latitude},lon:${location.coords.longitude}` : 'Manual Report',
                latitude: location?.coords.latitude,
                longitude: location?.coords.longitude,
                imageUrl: attachedImage, 
                reportedById: user?.id,
                status: 'PENDING'
              };

              // Use SyncService for offline support
              const response = await SyncService.fetchWithSync(API_ENDPOINTS.ANOMALIES, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              }) as any;

              if (response.ok) {
                if (response.queued) {
                  setIsQueued(true);
                }
                setIsSubmitted(true);
              } else {
                Alert.alert('Submission Error', 'Could not submit report. Please try again.');
              }
            } catch (err) {
              console.error('Submit report error:', err);
              Alert.alert('Network Error', 'Something went wrong. Check your connection.');
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
              <Text style={styles.submitButtonText}>Submit Official Report</Text>
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
  progressDots: { flexDirection: 'row', justifyContent: 'flex-start', gap: 6, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E2E8F0' },
  dotActive: { width: 24, backgroundColor: Colors.primary },
  title: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22 },
  
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: getColorWithOpacity(Colors.primary, 0.1), alignItems: 'center', justifyContent: 'center' },
  stepNumber: { color: Colors.primary, fontWeight: 'bold', fontSize: 14 },
  stepLabel: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary },
  
  inputLabel: { fontSize: 12, color: Colors.textSecondary, marginBottom: 10, marginLeft: 4, fontWeight: '600' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 18,
    height: 54,
  },
  input: { flex: 1, fontSize: 15, color: Colors.textPrimary },
  
  orDivider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 16 },
  line: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  orText: { fontSize: 10, color: Colors.textTertiary, fontWeight: 'bold', letterSpacing: 1 },
  
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    gap: 10,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
  },
  locationButtonText: { color: Colors.primary, fontWeight: 'bold', fontSize: 15 },
  locationDetail: { fontSize: 12, color: Colors.textTertiary, textAlign: 'center', marginTop: 10, fontStyle: 'italic' },

  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  typeBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeBadgeActive: {
    backgroundColor: getColorWithOpacity(Colors.primary, 0.1),
    borderColor: Colors.primary,
  },
  typeBadgeText: { fontSize: 13, color: Colors.textSecondary, fontWeight: '500' },
  typeBadgeTextActive: { color: Colors.primary, fontWeight: '700' },

  uploadArea: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 20,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  uploadAreaActive: {
    borderStyle: 'solid',
    borderColor: Colors.success,
  },
  imagePreviewContainer: { width: '100%', height: '100%' },
  previewImage: { width: '100%', height: '100%', opacity: 0.8 },
  previewOverlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)', gap: 8 },
  previewText: { color: Colors.white, fontWeight: 'bold', fontSize: 14 },

  uploadIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  uploadTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.textPrimary, marginBottom: 4 },
  uploadSub: { fontSize: 12, color: Colors.textTertiary, textAlign: 'center', paddingHorizontal: 40 },
  
  legalBox: {
    flexDirection: 'row',
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 20,
    gap: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  legalTitle: { fontSize: 13, fontWeight: 'bold', color: '#0369A1', marginBottom: 4 },
  legalText: { fontSize: 12, color: '#0369A1', lineHeight: 18 },
  
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 18,
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  submitButtonText: { color: Colors.white, fontSize: 17, fontWeight: 'bold' },
  
  successContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  successTitle: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary, textAlign: 'center', marginBottom: 16 },
  successText: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 26 },
});

export default ReportAnomalyScreen;
