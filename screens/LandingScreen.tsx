
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';

interface LandingScreenProps {
  onNavigate: (screen: Screen) => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
  const features = [
    { icon: 'verified-user', title: 'Verify Ownership', sub: 'Instant title checks & verification' },
    { icon: 'swap-horiz', title: 'Transfer Securely', sub: 'Paperless sales and inheritance' },
    { icon: 'gavel', title: 'Resolve Disputes', sub: 'Transparent community resolution' }
  ];

  return (
    <View style={styles.container}>
      {/* Top Floating Logo & Language */}
      <View style={styles.topBar}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="landscape" size={20} color="#3b82f6" />
          <Text style={styles.logoText}>Ubutaka</Text>
        </View>
        <Pressable style={styles.languageButton}>
          <Text style={styles.languageTextActive}>RW</Text>
          <View style={styles.languageDivider} />
          <Text style={styles.languageText}>EN</Text>
          <MaterialIcons name="expand-more" size={18} color="#64748b" />
        </Pressable>
      </View>

      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <Image 
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYF4pTZHPbJY-j7K1SLqbu45KRndjCyS6AKYHu9IHKxskoPebsagTx0v_Pok13PZRKU_WEbhwpAQgglvK1MDY2uJPeNtmkKY_dZn38ysaHjIFUdOgO-liBV_YaDzbyQ1u8A148UCrPkt7HbWa1ilEvgVdPlmYCZVjEPPnpWwPS3C43pg88vXVTzq7bRkrIqrOwyvg8V1nf8pYlRKSNMNoyB9sC6TkJw-A5xdUhWNhpYJ1aWjCJC6QvOIOBMK5sW2hz1reD1NW3Fwtf' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay} />
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.handle} />
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>
              Secure Land,{'\n'}
              <Text style={styles.titleHighlight}>Peaceful Future</Text>
            </Text>
            <Text style={styles.subtitle}>
              Rwanda's secure, paperless platform for land management and citizen services.
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            {features.map((item, idx) => (
              <View key={idx} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <MaterialIcons name={item.icon as any} size={20} color="#3b82f6" />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>{item.title}</Text>
                  <Text style={styles.featureSub}>{item.sub}</Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.buttonsContainer}>
            <Pressable 
              onPress={() => onNavigate('dashboard')}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
            </Pressable>
            <Pressable style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed
            ]}>
              <Text style={styles.secondaryButtonText}>Log In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#1e293b',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginLeft: 8,
  },
  languageTextActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginRight: 8,
  },
  languageDivider: {
    width: 1,
    height: 16,
    backgroundColor: '#e2e8f0',
  },
  heroContainer: {
    width: '100%',
    height: '55%',
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
  },
  bottomSheet: {
    flex: 1,
    marginTop: -40,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 40,
    elevation: 10,
    zIndex: 10,
  },
  handle: {
    width: 48,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 8,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 34,
    marginBottom: 12,
    textAlign: 'center',
  },
  titleHighlight: {
    color: '#3b82f6',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 280,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  featureSub: {
    fontSize: 12,
    color: '#64748b',
  },
  buttonsContainer: {
    marginTop: 'auto',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.39,
    shadowRadius: 14,
    elevation: 8,
    gap: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryButtonText: {
    color: '#475569',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

export default LandingScreen;
