
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface MarketplaceScreenProps {
  onNavigate: (screen: Screen) => void;
}

const MarketplaceScreen: React.FC<MarketplaceScreenProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Price', 'Size', 'Location', 'Type'];

  // Enhanced mock data to match the visual richness of the screenshot
  const PARCELS = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=2070&auto=format&fit=crop',
      price: '25M',
      title: 'Residential Plot in Kacyiru',
      location: 'Gasabo District, Kigali',
      size: '540m²',
      type: 'Resid.',
      tenure: 'Freehold',
      badges: [{ text: 'Verified', color: Colors.success, icon: 'check-circle' }],
      isFavorite: false
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop',
      price: '4.5M',
      title: 'Fertile Agricultural Land',
      location: 'Bugesera, Nyamata Sector',
      size: '1.5 Ha',
      type: 'Agri.',
      tenure: 'Titled',
      badges: [{ text: 'Hot Deal', color: '#F59E0B', icon: 'local-fire-department' }],
      isFavorite: true
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop',
      price: '120M',
      title: 'Strategic Commercial Corner',
      location: 'Nyarugenge, City Center',
      size: '850m²',
      type: 'Comm.',
      tenure: 'Lease',
      badges: [{ text: 'Commercial', color: Colors.primary, icon: 'business' }],
      isFavorite: false
    }
  ];

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable style={styles.menuButton}>
             <MaterialIcons name="menu" size={24} color={Colors.textPrimary} />
          </Pressable>

          <View style={styles.brandContainer}>
            <Text style={styles.brandStart}>landscape</Text>
            <Text style={styles.brandEnd}>Land Market</Text>
          </View>

          <View style={styles.headerActions}>
            <Text style={styles.langText}>RW</Text>
            <Text style={styles.langDivider}>|</Text>
            <Text style={styles.langTextActive}>EN</Text>
            <MaterialIcons name="language" size={20} color={Colors.primary} />
          </View>
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={Colors.textTertiary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Districts, UPI..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
           <Pressable style={styles.filterButton}>
            <MaterialIcons name="tune" size={20} color={Colors.textPrimary} />
          </Pressable>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filtersContainer}
        >
          {filters.map((filter, idx) => (
            <Pressable 
              key={idx}
              onPress={() => setActiveFilter(filter)}
              style={[
                styles.filterPill,
                activeFilter === filter && styles.filterPillActive
              ]}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive
              ]}>{filter}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.listHeader}>
          <View>
            <Text style={styles.listTitle}>Available Parcels</Text>
            <Text style={styles.listCount}>128 Results</Text>
          </View>
        </View>

        <View style={styles.cardsContainer}>
          {PARCELS.map((parcel) => (
            <Pressable
              key={parcel.id}
              onPress={() => onNavigate('buy-land')}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed
              ]}
            >
              <View style={styles.imageContainer}>
                <Image source={{ uri: parcel.image }} style={styles.cardImage} resizeMode="cover" />
                
                {/* Badges */}
                <View style={styles.badgeContainer}>
                  {parcel.badges.map((badge, idx) => (
                     <View key={idx} style={[styles.badge, { backgroundColor: Colors.white }]}>
                       <MaterialIcons name={badge.icon as any} size={12} color={badge.color} />
                       <Text style={[styles.badgeText, { color: Colors.textPrimary }]}>{badge.text}</Text>
                     </View>
                  ))}
                </View>

                {/* Price Overlay */}
                <View style={styles.priceOverlay}>
                  <Text style={styles.priceText}>RWF {parcel.price}</Text>
                </View>

                {/* Favorite Button */}
                <Pressable style={styles.favButton}>
                  <MaterialIcons 
                    name={parcel.isFavorite ? "favorite" : "favorite-border"} 
                    size={20} 
                    color={parcel.isFavorite ? Colors.error : Colors.white} 
                  />
                </Pressable>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{parcel.title}</Text>
                
                <View style={styles.locationRow}>
                  <MaterialIcons name="location-on" size={14} color={Colors.textTertiary} />
                  <Text style={styles.locationText}>{parcel.location}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.specsRow}>
                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>SIZE</Text>
                    <View style={styles.specValueRow}>
                      <MaterialIcons name="aspect-ratio" size={14} color={Colors.textSecondary} />
                      <Text style={styles.specValue}>{parcel.size}</Text>
                    </View>
                  </View>

                  <View style={styles.specDivider} />

                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>TYPE</Text>
                    <View style={styles.specValueRow}>
                      <MaterialIcons name="terrain" size={14} color={Colors.textSecondary} />
                      <Text style={styles.specValue}>{parcel.type}</Text>
                    </View>
                  </View>

                  <View style={styles.specDivider} />

                  <View style={styles.specItem}>
                    <Text style={styles.specLabel}>TENURE</Text>
                     <View style={styles.specValueRow}>
                      <MaterialIcons name="verified-user" size={14} color={Colors.textSecondary} />
                      <Text style={styles.specValue}>{parcel.tenure}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
        <View style={{ height: 100 }} /> 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.white,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  menuButton: {
    padding: 4,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  brandStart: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '400',
  },
  brandEnd: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '900',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  langText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textTertiary,
  },
  langDivider: {
    fontSize: 10,
    color: Colors.border,
  },
  langTextActive: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    position: 'relative',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16, // More rounded 
    paddingVertical: 12,
    paddingHorizontal: 16,
    paddingLeft: 44,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F8FAFC', // White background
    borderRadius: 16, // Circle/Rounded
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filtersContainer: {
    paddingHorizontal: 20,
    gap: 8,
    paddingBottom: 8,
  },
  filterPill: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: Colors.white,
  },
  filterPillActive: {
    backgroundColor: '#0F172A', // Dark active state
    borderColor: '#0F172A',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },

  content: {
    flex: 1,
    backgroundColor: '#F8FAFC', // Light gray background for content
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  listCount: {
    fontSize: 12,
    color: Colors.textTertiary,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 24,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9', // Subtle border
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    height: 200,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 16,
    left: 16,
    gap: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  priceOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  favButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Glassmorphism
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 16,
  },
  specsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specItem: {
    flex: 1,
    gap: 4,
  },
  specLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  specValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  specDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#F1F5F9',
  },

  fabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    height: 80, // Space for bottom nav
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    top: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0F172A', // Dark FAB
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#F8FAFC', // Matches background
  },
  bottomNavPlaceholder: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 10,
    color: Colors.textTertiary,
  },
});

export default MarketplaceScreen;
