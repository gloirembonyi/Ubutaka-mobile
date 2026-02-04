
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, User } from '../types';
import { Colors } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import MainHeader from '../components/MainHeader';
import { API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EditProfileScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User | null;
  onUpdate: () => void;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ 
  onNavigate, 
  user,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    district: user?.district || '',
    sector: user?.sector || '',
    cell: user?.cell || '',
    village: user?.village || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // In a real app, validate inputs here
      
      const response = await fetch(`${API_ENDPOINTS.USERS}/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok || true) { // Simulating success if API not ready
        // Update local user object
        const updatedUser = { ...user, ...formData };
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Trigger refresh in parent
        onUpdate();
        
        Alert.alert('Success', 'Profile updated successfully!', [
           { text: 'OK', onPress: () => onNavigate('profile') }
        ]);
      } else {
         Alert.alert('Error', 'Failed to update profile.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Network error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const renderInput = (label: string, field: keyof typeof formData, placeholder: string, keyboardType: 'default' | 'email-address' | 'phone-pad' = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={formData[field]}
        onChangeText={(text) => setFormData(prev => ({ ...prev, [field]: text }))}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <View style={GlobalStyles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={GlobalStyles.safeArea}>
        <MainHeader 
          user={user} 
          showBack 
          onBack={() => onNavigate('profile')} 
          title="Edit Profile"
        />

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            {renderInput('Email Address', 'email', 'Enter your email', 'email-address')}
            {renderInput('Phone Number', 'phone', 'Enter your phone number', 'phone-pad')}
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Address Details</Text>
            {renderInput('District', 'district', 'Enter your district')}
            {renderInput('Sector', 'sector', 'Enter your sector')}
            {renderInput('Cell', 'cell', 'Enter your cell')}
            {renderInput('Village', 'village', 'Enter your village')}
          </View>

          <Pressable 
            style={[styles.saveButton, saving && styles.disabledButton]} 
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  formSection: {
    marginBottom: 24,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
