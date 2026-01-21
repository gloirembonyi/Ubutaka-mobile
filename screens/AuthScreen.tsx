import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Screen, User } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { AuthService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import { mockNidaVerification } from '../services/mockNida';

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
  const [role, setRole] = useState<'USER' | 'ABUNZI'>('USER');
  const [loading, setLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Store actions
  const login = useAuthStore(state => state.login);
  const setBiometricStatus = useAuthStore(state => state.setBiometricStatus);

  useEffect(() => {
    checkBiometrics();
    checkStoredCredentials();
  }, []);

  const checkBiometrics = async () => {
    const { hasHardware, isEnrolled } = await AuthService.checkBiometricAvailability();
    setBiometricAvailable(hasHardware && isEnrolled);
  };

  const checkStoredCredentials = async () => {
    const stored = await AuthService.getStoredBiometricCredentials();
    if (stored && type === 'login') {
      // Allow quick fill or auto-prompt
      setEmail(stored.email);
    }
  };

  const handleBiometricLogin = async () => {
    const stored = await AuthService.getStoredBiometricCredentials();
    if (!stored) {
      Alert.alert('Biometrics Not Set', 'Please login with password first to enable biometrics.');
      return;
    }

    const success = await AuthService.authenticateWithBiometrics();
    if (success) {
      setLoading(true);
      try {
        // Authenticate with stored token/credentials
        // Ideally we verify the token is still valid or refresh it
        // For now, we simulate a login or use the token directly if API supports it
        // Since we don't have the password, we might need a special "refresh" or "biometric-login" endpoint
        // simplified: We assume stored.token is valid or we just pass simulated success if it's a demo
        
        // Use stored token to start session (In real app, validate token with backend)
        const response = await AuthService.login({ email: stored.email, biometricToken: stored.token });
        
        login(response.user, response.token);
        onLogin(response.user);
      } catch (error) {
        console.error('Biometric login failed:', error);
        Alert.alert('Error', 'Biometric login failed. Please use password.');
      } finally {
        setLoading(false);
      }
    }
  };

  const verifyNida = async () => {
    setLoading(true);
    try {
      const result = await mockNidaVerification(nationalId);
      if (!result.isValid) {
        Alert.alert('Verification Failed', result.error || 'Invalid National ID');
        return false;
      }
      return true;
    } catch (error) {
      Alert.alert('Error', 'NIDA verification failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

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

    if (type === 'signup') {
      const isNidaValid = await verifyNida();
      if (!isNidaValid) return;
    }

    setLoading(true);

    try {
      if (type === 'login') {
        const response = await AuthService.login({ email, password });
        
        login(response.user, response.token);
        
        // Ask to enable biometrics if available
        if (biometricAvailable) {
          Alert.alert(
            'Enable Biometrics',
            'Would you like to enable fingerprint/face login for next time?',
            [
              { text: 'No', style: 'cancel', onPress: () => onLogin(response.user) },
              { 
                text: 'Yes', 
                onPress: async () => {
                  const success = await AuthService.enableBiometrics(email, response.token);
                  if (success) {
                    setBiometricStatus(true, true);
                    Alert.alert('Success', 'Biometrics enabled');
                  }
                  onLogin(response.user);
                }
              }
            ]
          );
        } else {
          onLogin(response.user);
        }

      } else {
        // Register
        const response = await AuthService.register({
          name,
          email,
          password,
          nationalId,
          role: role === 'ABUNZI' ? 'ABUNZI' : 'USER',
        });

        Alert.alert('Success', 'Account created successfully!', [
          { text: 'OK', onPress: () => {
            login(response.user, response.token);
            onLogin(response.user);
          }}
        ]);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      Alert.alert('Error', error.message || 'Authentication failed');
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
                secureTextEntry={!showPassword}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={10}>
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color={Colors.textSecondary} 
                />
              </Pressable>
            </View>
          </View>

          {type === 'signup' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Account Type</Text>
              <View style={styles.roleContainer}>
                <Pressable 
                  onPress={() => setRole('USER')}
                  style={[styles.roleCard, role === 'USER' && styles.roleCardActive]}
                >
                  <MaterialIcons name="person" size={24} color={role === 'USER' ? Colors.primary : Colors.textSecondary} />
                  <Text style={[styles.roleText, role === 'USER' && styles.roleTextActive]}>Citizen</Text>
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

          {type === 'login' && biometricAvailable && (
            <Pressable 
              onPress={handleBiometricLogin}
              style={({ pressed }) => [
                styles.biometricButton,
                pressed && GlobalStyles.pressed
              ]}
            >
              <Ionicons name="finger-print-outline" size={28} color={Colors.primary} />
              <Text style={styles.biometricText}>Login with Biometrics</Text>
            </Pressable>
          )}

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
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.1),
    borderRadius: 16,
    marginTop: 8,
  },
  biometricText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 16,
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
