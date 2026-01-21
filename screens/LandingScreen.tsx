
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

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
          <MaterialIcons name="landscape" size={20} color={Colors.primary} />
          <Text style={styles.logoText}>Ubutaka</Text>
        </View>
        <Pressable style={styles.languageButton}>
          <Text style={styles.languageTextActive}>RW</Text>
          <View style={styles.languageDivider} />
          <Text style={styles.languageText}>EN</Text>
          <MaterialIcons name="expand-more" size={18} color={Colors.textSecondary} />
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
              Rwanda&apos;s Digital Land{'\n'}
              <Text style={styles.titleHighlight}>Transformation for Peace</Text>
            </Text>
            <Text style={styles.subtitle}>
              Secure, paperless, and transparent land administration streamlining transactions and preventing fraud.
            </Text>
          </View>

          <View style={styles.featuresContainer}>
            {features.map((item, idx) => (
              <View key={idx} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <MaterialIcons name={item.icon as any} size={20} color={Colors.primary} />
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
              onPress={() => onNavigate('signup')}
              style={({ pressed }: { pressed: boolean }) => [
                styles.primaryButton,
                pressed && GlobalStyles.pressed
              ]}
            >
              <Text style={styles.primaryButtonText}>Start Transformation</Text>
              <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />
            </Pressable>
            
            <View style={styles.secondaryActions}>
              <Pressable 
                onPress={() => onNavigate('login')}
                style={styles.loginLink}
              >
                <Text style={styles.loginText}>Already have an account? <Text style={styles.loginHighlight}>Log In</Text></Text>
              </Pressable>
            </View>
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
    backgroundColor: Colors.background,
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
    backgroundColor: getColorWithOpacity(Colors.white, 0.8),
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
    color: Colors.textPrimary,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: getColorWithOpacity(Colors.white, 0.8),
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  languageText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginLeft: 8,
  },
  languageTextActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
    marginRight: 8,
  },
  languageDivider: {
    width: 1,
    height: 16,
    backgroundColor: Colors.border,
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
    backgroundColor: getColorWithOpacity(Colors.primary, 0.1),
  },
  bottomSheet: {
    flex: 1,
    marginTop: -60,
    marginBottom: 0,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 40,
    elevation: 10,
    zIndex: 10,
  },
  handle: {
    width: 48,
    height: 6,
    backgroundColor: Colors.border,
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
    color: Colors.textPrimary,
    lineHeight: 34,
    marginBottom: 12,
    textAlign: 'center',
  },
  titleHighlight: {
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
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
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.1),
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
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  featureSub: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  buttonsContainer: {
    marginTop: 'auto',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    gap: 8,
  },
  primaryButtonText: {
    color: Colors.white,
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
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  secondaryActions: {
    marginTop: 8,
    marginBottom: 42,
    alignItems: 'center',
  },
  loginLink: {
    padding: 8,
  },
  loginText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  loginHighlight: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default LandingScreen;
