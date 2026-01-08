
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';

interface SupportScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SupportScreen: React.FC<SupportScreenProps> = ({ onNavigate }) => {
  const guides = [
    { icon: 'swap-horiz', title: 'Transfer Title', sub: 'Step-by-step land transfer', color: '#3b82f6' },
    { icon: 'description', title: 'Read Documents', sub: 'Understand your rights', color: '#8b5cf6' },
    { icon: 'security', title: 'Security Tips', sub: 'Protect your property', color: '#10b981' },
    { icon: 'help', title: 'FAQ', sub: 'Common questions', color: '#f59e0b' }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
            pressed && styles.pressed
          ]}
        >
          <View style={styles.disputeContent}>
            <View style={styles.disputeIcon}>
              <MaterialIcons name="gavel" size={32} color="#d97706" />
            </View>
            <View style={styles.disputeText}>
              <Text style={styles.disputeTitle}>Community Disputes</Text>
              <Text style={styles.disputeSub}>Track mediation & resolution cases</Text>
            </View>
          </View>
          <MaterialIcons name="arrow-forward" size={24} color="#f59e0b" />
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
              <MaterialIcons name="school" size={14} color="#3d2e0f" />
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
                  pressed && styles.pressed
                ]}
              >
                <View style={[styles.guideIcon, { backgroundColor: `${guide.color}15` }]}>
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
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
    backgroundColor: '#fffbeb',
    padding: 24,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#fef3c7',
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
    backgroundColor: '#fef3c7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disputeText: {
    gap: 4,
  },
  disputeTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  disputeSub: {
    fontSize: 10,
    color: '#64748b',
  },
  featuredCard: {
    position: 'relative',
    height: 256,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
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
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
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
    backgroundColor: '#fef3c7',
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
    color: '#3d2e0f',
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 28,
  },
  featuredSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  guidesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  guideCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
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
    color: '#0f172a',
  },
  guideSub: {
    fontSize: 12,
    color: '#64748b',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});

export default SupportScreen;
