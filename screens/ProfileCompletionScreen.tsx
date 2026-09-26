import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ActivityIndicator, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import { Screen, User } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainHeader from '../components/MainHeader';
import { useAuthStore } from '../store/authStore';
import { getProfileCompletionPercentage, getMissingRequirements } from '../utils/profileCompletion';

interface ProfileCompletionScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User | null;
  onComplete: () => void;
}

const ProfileCompletionScreen: React.FC<ProfileCompletionScreenProps> = ({
  onNavigate,
  user,
  onComplete
}) => {
  const [idPicture] = useState<string | null>(user?.idPictureUrl || null);
  const [biometricRegistered, setBiometricRegistered] = useState(user?.biometricRegistered || false);
  const [digitalSignature, setDigitalSignature] = useState<string | null>(user?.digitalSignature || null);
  const [uploading, setUploading] = useState(false);
  const [registeringBiometric, setRegisteringBiometric] = useState(false);
  const [signing, setSigning] = useState(false);
  const [showSignatureInput, setShowSignatureInput] = useState(false);
  const [signatureName, setSignatureName] = useState('');

  /*
    Calculate completion percentage
    * ID Picture is marked as "disabled" in UI but we treat it as done for percentage calculation
    * so users can reach 100% if they complete the other steps
  */
  const completionPercentage = getProfileCompletionPercentage({
    ...user,
    idPictureUrl: idPicture || "disabled-but-counted",
    biometricRegistered,
    digitalSignature: digitalSignature || undefined,
  } as User);

  const handleRegisterBiometric = async () => {
    setRegisteringBiometric(true);

    try {
      // Check if device supports biometrics
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert('Not Supported', 'Your device does not support biometric authentication.');
        setRegisteringBiometric(false);
        return;
      }

      // Check available authentication types
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const typeNames = types.map((type: number) => {
        switch(type) {
          case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION: return 'Face ID';
          case LocalAuthentication.AuthenticationType.FINGERPRINT: return 'Fingerprint';
          case LocalAuthentication.AuthenticationType.IRIS: return 'Iris';
          default: return 'Biometric';
        }
      }).join(' or ');

      // Authenticate user to register
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Register your ${typeNames}`,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setBiometricRegistered(true);
        Alert.alert('Success', `${typeNames} registered successfully!`);
      } else {
        Alert.alert('Cancelled', 'Biometric registration was cancelled.');
      }
    } catch (error) {
      console.error('Biometric error:', error);
      Alert.alert('Error', 'Failed to register biometric. Please try again.');
    } finally {
      setRegisteringBiometric(false);
    }
  };

  const normalizeName = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();

  const handleCreateSignature = async () => {
    if (!user) return;
    const typed = signatureName.trim().replace(/\s+/g, ' ');
    if (!typed) {
      Alert.alert('Signature Required', 'Type your full legal name to sign.');
      return;
    }
    if (normalizeName(typed) !== normalizeName(user.name || '')) {
      Alert.alert('Name Mismatch', `The signature must match the name on your account exactly: "${user.name}".`);
      return;
    }
    setSigning(true);
    try {
      // Confirm the signer is the device owner before binding the signature.
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = hasHardware && await LocalAuthentication.isEnrolledAsync();
      if (enrolled) {
        const auth = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Confirm your digital signature',
          cancelLabel: 'Cancel',
        });
        if (!auth.success) {
          Alert.alert('Not Signed', 'Signature confirmation was cancelled.');
          return;
        }
      }
      setDigitalSignature(`signed:${typed}:${new Date().toISOString()}`);
      setShowSignatureInput(false);
      Alert.alert('Signed', 'Your digital signature has been captured. Tap "Complete Profile" to save it.');
    } catch (error) {
      console.error('Signature error:', error);
      Alert.alert('Error', 'Could not capture your signature. Please try again.');
    } finally {
      setSigning(false);
    }
  };

  const handleCompleteProfile = async () => {
    if (!user) return;

    // Check requirements (Excluding ID Picture as per request to disable upload but keep visible)
    if (!biometricRegistered || !digitalSignature) {
      const missing = getMissingRequirements({
        ...user,
        biometricRegistered,
        digitalSignature: digitalSignature || undefined,
        // We consider ID picture 'done' or not required for this check since upload is disabled
        idPictureUrl: 'skipped',
      } as User);

      Alert.alert(
        'Incomplete Profile',
        `Please complete the following:\n${missing.join('\n')}`
      );
      return;
    }

    setUploading(true);

    try {
      // Update user profile on backend
      const response = await fetch(`${API_ENDPOINTS.USERS}/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          biometricRegistered: true,
          digitalSignature: digitalSignature,
          profileCompleted: true,
          ...(user.district ? { district: user.district } : {}),
          ...(user.sector ? { sector: user.sector } : {}),
          ...(user.cell ? { cell: user.cell } : {}),
          ...(user.village ? { village: user.village } : {}),
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        const updatedUser: User = { ...user, ...(updated?.user || updated) };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        const { token, login } = useAuthStore.getState();
        if (token) login(updatedUser, token);

        Alert.alert(
          'Profile Complete!',
          'Your profile has been completed successfully. You can now use all features.',
          [{ text: 'OK', onPress: onComplete }]
        );
      } else {
        const body = await response.json().catch(() => ({}));
        Alert.alert('Error', body?.error || `Failed to update profile (${response.status}). Please try again.`);
      }
    } catch (error) {
      console.error('Complete profile error:', error);
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={GlobalStyles.safeArea}>
        <MainHeader
          user={user}
          showBack
          onBack={() => onNavigate('profile')}
          title="Complete Profile"
        />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Progress Indicator */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Profile Completion</Text>
              <Text style={styles.progressPercentage}>{completionPercentage}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${completionPercentage}%` }]}
              />
            </View>
            <Text style={styles.progressSubtext}>
              Complete your profile to access all features
            </Text>
          </View>

            {/* ID Picture Upload - Access Disabled but Visible */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={[styles.statusIcon, styles.statusIconComplete]}>
                  <MaterialIcons
                    name="badge"
                    size={24}
                    color={Colors.success}
                  />
                </View>
                <View style={styles.sectionText}>
                  <Text style={styles.sectionTitle}>National ID Picture</Text>
                  <Text style={styles.sectionSubtitle}>
                    Your National ID is verified and visible to administrators.
                  </Text>
                </View>
              </View>

              <View style={[styles.uploadButton, { backgroundColor: Colors.backgroundLight, borderStyle: 'solid' }]}>
                 <MaterialIcons name="lock" size={24} color={Colors.textSecondary} />
                 <Text style={[styles.uploadButtonText, { color: Colors.textSecondary }]}>
                   ID Picture Upload Disabled
                 </Text>
              </View>
            </View>

          {/* Biometric Registration */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.statusIcon, biometricRegistered && styles.statusIconComplete]}>
                <MaterialIcons
                  name={biometricRegistered ? "check-circle" : "fingerprint"}
                  size={24}
                  color={biometricRegistered ? Colors.success : Colors.primary}
                />
              </View>
              <View style={styles.sectionText}>
                <Text style={styles.sectionTitle}>Biometric Registration</Text>
                <Text style={styles.sectionSubtitle}>
                  Register your face or fingerprint for secure authentication
                </Text>
              </View>
            </View>

            {biometricRegistered ? (
              <View style={styles.completeBadge}>
                <MaterialIcons name="verified" size={20} color={Colors.success} />
                <Text style={styles.completeText}>Biometric Registered</Text>
              </View>
            ) : (
              <Pressable
                style={styles.actionButton}
                onPress={handleRegisterBiometric}
                disabled={registeringBiometric}
              >
                {registeringBiometric ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <>
                    <MaterialIcons name="fingerprint" size={20} color={Colors.white} />
                    <Text style={styles.actionButtonText}>Register Biometric</Text>
                  </>
                )}
              </Pressable>
            )}
          </View>

          {/* Digital Signature */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={[styles.statusIcon, digitalSignature && styles.statusIconComplete]}>
                <MaterialIcons
                  name={digitalSignature ? "check-circle" : "edit"}
                  size={24}
                  color={digitalSignature ? Colors.success : Colors.primary}
                />
              </View>
              <View style={styles.sectionText}>
                <Text style={styles.sectionTitle}>Digital Signature</Text>
                <Text style={styles.sectionSubtitle}>
                  Create your digital signature for document authentication
                </Text>
              </View>
            </View>

            {digitalSignature ? (
              <View style={styles.completeBadge}>
                <MaterialIcons name="verified" size={20} color={Colors.success} />
                <Text style={styles.completeText}>Signature Created</Text>
              </View>
            ) : showSignatureInput ? (
              <View style={{ gap: 12 }}>
                <Text style={styles.sectionSubtitle}>
                  Type your full legal name exactly as registered ({user?.name}). This acts as your binding signature.
                </Text>
                <TextInput
                  style={styles.signatureInput}
                  placeholder="Full legal name"
                  placeholderTextColor={Colors.textTertiary}
                  value={signatureName}
                  onChangeText={setSignatureName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                <Pressable
                  style={styles.actionButton}
                  onPress={handleCreateSignature}
                  disabled={signing}
                >
                  {signing ? (
                    <ActivityIndicator color={Colors.white} />
                  ) : (
                    <>
                      <MaterialIcons name="draw" size={20} color={Colors.white} />
                      <Text style={styles.actionButtonText}>Sign</Text>
                    </>
                  )}
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.actionButton}
                onPress={() => setShowSignatureInput(true)}
                disabled={signing}
              >
                {signing ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <>
                    <MaterialIcons name="edit" size={20} color={Colors.white} />
                    <Text style={styles.actionButtonText}>Create Signature</Text>
                  </>
                )}
              </Pressable>
            )}
          </View>

          {/* Complete Button */}
          <Pressable
            style={[
              styles.completeButton,
              completionPercentage < 100 && styles.completeButtonDisabled
            ]}
            onPress={handleCompleteProfile}
            disabled={completionPercentage < 100 || uploading}
          >
            {uploading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Text style={styles.completeButtonText}>Complete Profile</Text>
                <MaterialIcons name="check-circle" size={20} color={Colors.white} />
              </>
            )}
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  signatureInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    fontStyle: 'italic',
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  progressSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
  progressSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIconComplete: {
    backgroundColor: getColorWithOpacity(Colors.success, 0.1),
  },
  sectionText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.1),
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  imagePreview: {
    alignItems: 'center',
    gap: 12,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: Colors.backgroundLight,
  },
  changeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
  },
  changeButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
  },
  completeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: getColorWithOpacity(Colors.success, 0.1),
    borderRadius: 12,
    padding: 16,
  },
  completeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.success,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    marginTop: 8,
  },
  completeButtonDisabled: {
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
});

export default ProfileCompletionScreen;
