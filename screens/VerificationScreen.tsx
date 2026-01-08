
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface VerificationScreenProps {
  onNavigate: (screen: Screen) => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ onNavigate }) => {
  const [status, setStatus] = useState<'scan' | 'verifying' | 'success'>('scan');
  const scanAnim = new Animated.Value(0);

  useEffect(() => {
    if (status === 'verifying') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ])
      ).start();

      // Simulate verification delay
      const timer = setTimeout(() => {
        setStatus('success');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop' }} 
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      <View style={styles.overlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
            <MaterialIcons name="close" size={24} color={Colors.white} />
          </Pressable>
          <View style={styles.langButton}>
            <MaterialIcons name="language" size={18} color={Colors.white} />
            <Text style={styles.langText}>EN</Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <MaterialIcons name="verified-user" size={32} color={Colors.primary} />
            </View>
          </View>

          <Text style={styles.mainTitle}>Murakaza neza</Text>
          <Text style={styles.mainSubtitle}>Secure biometric identity verification powered by Government of Rwanda.</Text>

          <View style={styles.scanContainer}>
            {status === 'scan' && (
              <View style={styles.scanCard}>
                <View style={styles.idInput}>
                  <MaterialIcons name="badge" size={20} color={Colors.textTertiary} />
                  <Text style={styles.idText}>11990 8 0000000 0 00</Text>
                </View>
                <View style={styles.passwordInput}>
                  <MaterialIcons name="lock" size={20} color={Colors.textTertiary} />
                  <Text style={styles.idText}>••••••••</Text>
                  <MaterialIcons name="visibility-off" size={20} color={Colors.textTertiary} />
                </View>
                
                <Pressable 
                  style={styles.actionButton}
                  onPress={() => setStatus('verifying')}
                >
                  <Text style={styles.actionButtonText}>Secure Log In</Text>
                  <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />
                </Pressable>

                <View style={styles.faceIdContainer}>
                  <MaterialIcons name="fingerprint" size={24} color={Colors.textPrimary} />
                </View>
              </View>
            )}

            {status === 'verifying' && (
              <View style={styles.verifyingContainer}>
                <View style={styles.faceTarget}>
                  <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
                  <Ionicons name="scan" size={120} color={Colors.primary} />
                </View>
                <Text style={styles.verifyingText}>Verifying Identity...</Text>
                <Text style={styles.verifyingSub}>Keep your face within the frame</Text>
              </View>
            )}

            {status === 'success' && (
              <View style={styles.successContainer}>
                <View style={styles.successCircle}>
                  <MaterialIcons name="check" size={48} color={Colors.white} />
                </View>
                <Text style={styles.successTitle}>Identity Confirmed</Text>
                <Text style={styles.successSub}>Welcome back, GLOIRE MBONYI</Text>
                
                <Pressable 
                  style={[styles.actionButton, { marginTop: 32 }]}
                  onPress={() => onNavigate('dashboard')}
                >
                  <Text style={styles.actionButtonText}>Proceed to Dashboard</Text>
                  <MaterialIcons name="dashboard" size={20} color={Colors.white} />
                </Pressable>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <View style={styles.secureLine}>
              <MaterialIcons name="verified" size={14} color={Colors.white} />
              <Text style={styles.secureText}>SECURED BY GOVERNMENT OF RWANDA</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryDark,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: getColorWithOpacity(Colors.primaryDark, 0.4),
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: getColorWithOpacity(Colors.white, 0.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: getColorWithOpacity(Colors.white, 0.2),
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  langText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  logoContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  mainSubtitle: {
    fontSize: 16,
    color: getColorWithOpacity(Colors.white, 0.8),
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  scanContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    marginTop: 20,
  },
  scanCard: {
    backgroundColor: Colors.white,
    borderRadius: 32,
    padding: 32,
    gap: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  idInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  idText: {
    flex: 1,
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  faceIdContainer: {
    alignSelf: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },

  verifyingContainer: {
    alignItems: 'center',
    gap: 24,
  },
  faceTarget: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    left: 40,
    right: 40,
    height: 2,
    backgroundColor: Colors.primary,
    zIndex: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  verifyingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  verifyingSub: {
    fontSize: 14,
    color: getColorWithOpacity(Colors.white, 0.7),
  },

  successContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: Colors.white,
    borderRadius: 32,
    gap: 12,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  successSub: {
    fontSize: 16,
    color: Colors.textSecondary,
  },

  footer: {
    marginTop: 20,
  },
  secureLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    opacity: 0.8,
  },
  secureText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: 1,
  },
});

export default VerificationScreen;
