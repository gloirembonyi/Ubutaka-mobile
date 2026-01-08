
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface SupportScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SupportScreen: React.FC<SupportScreenProps> = ({ onNavigate }) => {
  const guides = [
    { icon: 'swap-horiz', title: 'Transfer Title', sub: 'Step-by-step land transfer', color: Colors.primary },
    { icon: 'description', title: 'Read Documents', sub: 'Understand your rights', color: Colors.info },
    { icon: 'security', title: 'Security Tips', sub: 'Protect your property', color: Colors.success },
    { icon: 'help', title: 'FAQ', sub: 'Common questions', color: Colors.accent }
  ];

  return (
    <ScrollView style={GlobalStyles.container} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Support & Learning</Text>
          <Text style={styles.headerSubtitle}>Ubutaka Assistant</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Pressable
          onPress={() => onNavigate('dispute-list')}
          style={({ pressed }) => [
            styles.disputeCard,
            pressed && GlobalStyles.pressed
          ]}
        >
          <View style={styles.disputeContent}>
            <View style={styles.disputeIcon}>
              <MaterialIcons name="gavel" size={32} color={Colors.accentDark} />
            </View>
            <View style={styles.disputeText}>
              <Text style={styles.disputeTitle}>Community Disputes</Text>
              <Text style={styles.disputeSub}>Track mediation & resolution cases</Text>
            </View>
          </View>
          <MaterialIcons name="arrow-forward" size={24} color={Colors.accent} />
        </Pressable>

        <View style={styles.featuredCard}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDdHSKm206t503Kxo_6iT47qpdrmlI9IIprpR1ItPs684rHLGA5aUYGU1jqcJGA-AWLw1DzZ-7rt6-2bAaGThDFwK1IHJwzHTB13yaKAdi3attHJbyl15KA4hwKciHPH1GCUf_flVCgE39Q_Vusm_X1ctoamh8KqF0SseTgNzuccgD3hyQh9DDnv4NHjHY8zCNuWifbEQe6g-KdEeyghJXa5tPVhm6HuiN9JWoGnRyOQUS7rzXxksAx1qXPfBkbqonXlNq09mNpYaHX' }}
            style={styles.featuredImage}
            resizeMode="cover"
          />
          <View style={styles.featuredOverlay} />
          <View style={styles.featuredContent}>
            <View style={styles.featuredBadge}>
              <MaterialIcons name="school" size={14} color={Colors.accentDark} />
              <Text style={styles.featuredBadgeText}>New Guide</Text>
            </View>
            <Text style={styles.featuredTitle}>Master Ubutaka in minutes</Text>
            <Text style={styles.featuredSubtitle}>Simple guides to manage land confidently.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Interactive Guides</Text>
          <View style={styles.guidesGrid}>
            {guides.map((guide, idx) => (
              <Pressable
                key={idx}
                style={({ pressed }) => [
                  styles.guideCard,
                  pressed && GlobalStyles.pressed
                ]}
              >
                <View style={[styles.guideIcon, { backgroundColor: getColorWithOpacity(guide.color, 0.1) }]}>
                  <MaterialIcons name={guide.icon as any} size={24} color={guide.color} />
                </View>
                <View style={styles.guideText}>
                  <Text style={styles.guideTitle}>{guide.title}</Text>
                  <Text style={styles.guideSub}>{guide.sub}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: getColorWithOpacity(Colors.background, 0.95),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  disputeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.accentLight,
    padding: 24,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: getColorWithOpacity(Colors.accent, 0.2),
  },
  disputeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  disputeIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: getColorWithOpacity(Colors.accent, 0.2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  disputeText: {
    gap: 4,
  },
  disputeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  disputeSub: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  featuredCard: {
    position: 'relative',
    height: 256,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    backgroundColor: getColorWithOpacity(Colors.black, 0.7),
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    gap: 12,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  featuredBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.accentDark,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    lineHeight: 28,
  },
  featuredSubtitle: {
    fontSize: 12,
    color: getColorWithOpacity(Colors.white, 0.8),
    marginTop: 4,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  guidesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  guideCard: {
    width: '47%',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 12,
  },
  guideIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideText: {
    gap: 4,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  guideSub: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});

export default SupportScreen;
