
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, FlatList, TextInput, Alert, Image } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';
import { User, LandDocument, Screen } from '../types';

interface DocumentVaultScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User | null;
}

const CATEGORIES = [
  { id: 'All', icon: 'grid-view' },
  { id: 'Title Deed', icon: 'description' },
  { id: 'Permit', icon: 'assignment' },
  { id: 'Tax', icon: 'receipt-long' },
  { id: 'Evidence', icon: 'camera-alt' },
  { id: 'Historical', icon: 'history-edu' },
];

const DocumentVaultScreen: React.FC<DocumentVaultScreenProps> = ({ onNavigate, user }) => {
  const [documents, setDocuments] = useState<LandDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const fetchDocuments = async () => {
    if (!user) return;
    try {
      const resp = await fetch(`${API_ENDPOINTS.DOCUMENTS}?ownerId=${user.id}`);
      if (resp.ok) {
        const data = await resp.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         doc.upi?.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const renderDocItem = ({ item }: { item: LandDocument }) => (
    <Pressable style={styles.docCard}>
      <View style={[styles.iconContainer, { backgroundColor: getColorWithOpacity(Colors.primary, 0.1) }]}>
        <MaterialIcons 
            name={CATEGORIES.find(c => c.id === item.category)?.icon as any || 'insert-drive-file'} 
            size={24} 
            color={Colors.primary} 
        />
      </View>
      <View style={styles.docInfo}>
        <Text style={styles.docName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.docMeta}>{item.category} • {item.fileDate || new Date(item.createdAt).toLocaleDateString()}</Text>
        {item.upi && <Text style={styles.docUpi}>UPI: {item.upi}</Text>}
      </View>
      <View style={styles.docActions}>
        {item.isEncrypted && <MaterialIcons name="lock" size={16} color={Colors.success} />}
        <Pressable style={styles.moreBtn}>
            <MaterialIcons name="more-vert" size={20} color={Colors.textTertiary} />
        </Pressable>
      </View>
    </Pressable>
  );

  return (
    <View style={GlobalStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Document Vault</Text>
        <Pressable style={styles.uploadBtn}>
            <MaterialIcons name="add-circle" size={28} color={Colors.primary} />
        </Pressable>
      </View>

      {/* Hero / Storage Info */}
      <View style={styles.hero}>
        <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Encrypted Archive</Text>
            <Text style={styles.heroSub}>Securing your family's history and investments.</Text>
            
            <View style={styles.storageBarContainer}>
                <View style={[styles.storageBar, { width: '45%' }]} />
            </View>
            <Text style={styles.storageText}>450 MB of 2 GB used</Text>
        </View>
        <View style={styles.securityBadge}>
            <Ionicons name="shield-checkmark" size={40} color={Colors.white} />
        </View>
      </View>

      {/* Search & Categories */}
      <View style={styles.tools}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color={Colors.textTertiary} />
            <TextInput 
                style={styles.searchInput}
                placeholder="Search documents or UPI..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryList}>
            {CATEGORIES.map(cat => (
                <Pressable 
                    key={cat.id} 
                    style={[styles.categoryBtn, activeCategory === cat.id && styles.categoryBtnActive]}
                    onPress={() => setActiveCategory(cat.id)}
                >
                    <MaterialIcons 
                        name={cat.icon as any} 
                        size={18} 
                        color={activeCategory === cat.id ? Colors.white : Colors.textSecondary} 
                    />
                    <Text style={[styles.categoryText, activeCategory === cat.id && styles.categoryTextActive]}>{cat.id}</Text>
                </Pressable>
            ))}
          </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <View style={{ flex: 1 }}>
            {filteredDocs.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="inventory" size={64} color={Colors.borderLight} />
                    <Text style={styles.emptyText}>No documents found in this category.</Text>
                    <Pressable style={styles.addFirstBtn}>
                        <Text style={styles.addFirstText}>Upload Your First Document</Text>
                    </Pressable>
                </View>
            ) : (
                <FlatList 
                    data={filteredDocs}
                    renderItem={renderDocItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
      )}

      {/* Story Background (The Inheritance Proof Inspiration) */}
      <View style={styles.historyBox}>
         <FontAwesome5 name="feather-alt" size={14} color={Colors.primary} />
         <Text style={styles.historyText}>
            "We found ONE photo from 1970 showing the house construction... linked everything in the vault... proved 53 years of investment."
         </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary, textAlign: 'center' },
  uploadBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  
  hero: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroContent: { flex: 1 },
  heroTitle: { fontSize: 22, fontWeight: '900', color: Colors.white, marginBottom: 4 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
  storageBarContainer: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, width: '80%', marginBottom: 8 },
  storageBar: { height: '100%', backgroundColor: Colors.white, borderRadius: 3 },
  storageText: { fontSize: 11, color: Colors.white, fontWeight: 'bold' },
  securityBadge: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },

  tools: { padding: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 15,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: Colors.textPrimary },
  
  categoryList: { gap: 10, paddingRight: 20 },
  categoryBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 14, 
    paddingVertical: 10, 
    borderRadius: 20, 
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 8,
  },
  categoryBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryText: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  categoryTextActive: { color: Colors.white },

  listContent: { padding: 20, paddingBottom: 100 },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconContainer: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  docInfo: { flex: 1, marginLeft: 16 },
  docName: { fontSize: 15, fontWeight: 'bold', color: Colors.textPrimary },
  docMeta: { fontSize: 12, color: Colors.textTertiary, marginTop: 4 },
  docUpi: { fontSize: 11, color: Colors.primary, fontWeight: 'bold', marginTop: 4 },
  docActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  moreBtn: { padding: 4 },

  emptyContainer: { padding: 60, alignItems: 'center' },
  emptyText: { textAlign: 'center', color: Colors.textTertiary, marginTop: 16, fontSize: 14, fontStyle: 'italic' },
  addFirstBtn: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, backgroundColor: getColorWithOpacity(Colors.primary, 0.1) },
  addFirstText: { color: Colors.primary, fontWeight: 'bold' },

  historyBox: { 
    position: 'absolute', 
    bottom: 20, 
    left: 20, 
    right: 20, 
    backgroundColor: '#FFFBEB', 
    padding: 16, 
    borderRadius: 16, 
    flexDirection: 'row', 
    gap: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    alignItems: 'center'
  },
  historyText: { flex: 1, fontSize: 10, color: '#92400E', fontStyle: 'italic', lineHeight: 14 },
});

export default DocumentVaultScreen;
