import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen, User } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';

interface AuthScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogin: (user: User) => void;
  type: 'login' | 'signup';
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onNavigate, onLogin, type: initialType }) => {
  const [type, setType] = useState(initialType);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [role, setRole] = useState<'CITIZEN' | 'ABUNZI'>('CITIZEN');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (type === 'signup' && (!name || !nationalId)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      if (type === 'login') {
        // Login
        const response = await fetch(API_ENDPOINTS.LOGIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          Alert.alert('Login Failed', data.error || 'Invalid email or password');
          return;
        }

        // Success - call onLogin with user data
        onLogin(data as User);
      } else {
        // Register
        const response = await fetch(API_ENDPOINTS.REGISTER, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
            nationalId,
            role: role === 'ABUNZI' ? 'ABUNZI' : 'USER',
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          Alert.alert('Registration Failed', data.error || 'Failed to create account');
          return;
        }

        // Success - call onLogin with user data
        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => onLogin(data as User) }
        ]);
      }
    } catch (error) {
      console.error('Auth error:', error);
      Alert.alert(
        'Connection Error',
        'Could not connect to server. Please make sure the backend server is running and check your network connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={() => onNavigate('landing')} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.title}>{type === 'login' ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={styles.subtitle}>
            {type === 'login' 
              ? 'Sign in to access your land records' 
              : 'Join Rwanda\'s Digital Land Transformation'}
          </Text>
        </View>

        <View style={styles.form}>
          {type === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {type === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>National ID (NIDA)</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="badge" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="1 1990 8 0000000 0 00"
                  value={nationalId}
                  onChangeText={setNationalId}
                  keyboardType="number-pad"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons name="lock-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          {type === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Type</Text>
              <View style={styles.roleContainer}>
                <Pressable 
                  onPress={() => setRole('CITIZEN')}
                  style={[styles.roleCard, role === 'CITIZEN' && styles.roleCardActive]}
                >
                  <MaterialIcons name="person" size={24} color={role === 'CITIZEN' ? Colors.primary : Colors.textSecondary} />
                  <Text style={[styles.roleText, role === 'CITIZEN' && styles.roleTextActive]}>Citizen</Text>
                </Pressable>
                <Pressable 
                  onPress={() => setRole('ABUNZI')}
                  style={[styles.roleCard, role === 'ABUNZI' && styles.roleCardActive]}
                >
                  <MaterialIcons name="gavel" size={24} color={role === 'ABUNZI' ? Colors.primary : Colors.textSecondary} />
                  <Text style={[styles.roleText, role === 'ABUNZI' && styles.roleTextActive]}>Abunzi</Text>
                </Pressable>
              </View>
            </View>
          )}

          <Pressable 
            onPress={handleSubmit}
            disabled={loading}
            style={({ pressed }) => [
              styles.submitButton,
              pressed && GlobalStyles.pressed,
              loading && { opacity: 0.6 }
            ]}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitButtonText}>
                {type === 'login' ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </Pressable>

          <Pressable 
            onPress={() => setType(type === 'login' ? 'signup' : 'login')}
            style={styles.switchButton}
          >
            <Text style={styles.switchText}>
              {type === 'login' ? "Don't have an account? " : "Already have an account? "}
              <Text style={styles.switchTextAction}>
                {type === 'login' ? 'Sign Up' : 'Log In'}
              </Text>
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 32,
    paddingTop: 64,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 50,
    color: Colors.textPrimary,
    fontSize: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  roleCardActive: {
    backgroundColor: getColorWithOpacity(Colors.primary, 0.05),
    borderColor: Colors.primary,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  roleTextActive: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  switchText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  switchTextAction: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default AuthScreen;
