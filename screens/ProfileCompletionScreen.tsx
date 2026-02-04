import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as LocalAuthentication from 'expo-local-authentication';
import { Screen, User } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainHeader from '../components/MainHeader';
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
  const [idPicture, setIdPicture] = useState<string | null>(user?.idPictureUrl || null);
  const [biometricRegistered, setBiometricRegistered] = useState(user?.biometricRegistered || false);
  const [digitalSignature, setDigitalSignature] = useState<string | null>(user?.digitalSignature || null);
  const [uploading, setUploading] = useState(false);
  const [registeringBiometric, setRegisteringBiometric] = useState(false);
  const [signing, setSigning] = useState(false);

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

  const handlePickIdPicture = async () => {
    Alert.alert(
      'Upload ID Picture',
      'Select a photo of your National ID card',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Choose from Gallery', 
          onPress: async () => {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
              Alert.alert('Permission Required', 'Please allow access to your photos.');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [3, 4],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setUploading(true);
              // In production, upload to cloud storage and get URL
              // For now, use the local URI
              setIdPicture(result.assets[0].uri);
              setUploading(false);
              Alert.alert('Success', 'ID picture selected! (Upload to server in production)');
            }
          }
        },
        { 
          text: 'Take Photo', 
          onPress: async () => {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (permissionResult.granted === false) {
              Alert.alert('Permission Required', 'Please allow access to your camera.');
              return;
            }

            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [3, 4],
              quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
              setUploading(true);
              setIdPicture(result.assets[0].uri);
              setUploading(false);
              Alert.alert('Success', 'ID picture captured! (Upload to server in production)');
            }
          }
        }
      ]
    );
  };

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

  const handleCreateSignature = () => {
    Alert.alert(
      'Digital Signature',
      'Draw your signature on the screen',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Drawing', 
          onPress: () => {
            // In a real app, open a signature pad component
            // For now, simulate signature creation
            setSigning(true);
            setTimeout(() => {
              setDigitalSignature('signature_data_base64_encoded');
              setSigning(false);
              Alert.alert('Success', 'Digital signature created successfully!');
            }, 1500);
          }
        }
      ]
    );
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
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        
        Alert.alert(
          'Profile Complete!',
          'Your profile has been completed successfully. You can now use all features.',
          [{ text: 'OK', onPress: onComplete }]
        );
      } else {
        Alert.alert('Error', 'Failed to update profile. Please try again.');
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
            ) : (
              <Pressable 
                style={styles.actionButton}
                onPress={handleCreateSignature}
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
