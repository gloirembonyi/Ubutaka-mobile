import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encryptData, encryptObject } from '../utils/encryption';
import MainHeader from '../components/MainHeader';
import { User } from '../types';

interface RegisterLandScreenProps {
  onNavigate: (screen: Screen) => void;
}

const RegisterLandScreen: React.FC<RegisterLandScreenProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Parcel
    province: 'Kigali City',
    district: 'Gasabo',
    sector: 'Remera',
    cell: 'Nyabisindu',
    village: '',
    upi: '',
    landUse: 'Residential (R1)',
    size: '',
    ownership: 'Freehold',
    
    // Step 2: Owner
    ownerName: '',
    ownerId: '',
    ownerPhone: '',
    ownerEmail: '',
    partners: [] as any[],
    children: [] as any[],
    
    // Step 3: Docs
    hasIdCopy: false,
    hasSaleAgreement: false,
    hasTaxClearance: false,
  });

  const [user, setUser] = useState<User | null>(null);

  React.useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem('user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        setUser(u);
        // Pre-fill owner info with current user
        setFormData(prev => ({
          ...prev,
          ownerName: u.name || '',
          ownerId: u.nationalId || '',
        }));
      }
    };
    loadUser();
  }, []);

  const steps = ['PARCEL', 'OWNER', 'DOCS', 'REVIEW'];

  const renderStepIcon = (index: number) => {
    const isActive = index + 1 === step;
    const isCompleted = index + 1 < step;
    
    let iconName = '';
    switch(index) {
      case 0: iconName = 'location-on'; break;
      case 1: iconName = 'person'; break;
      case 2: iconName = 'description'; break;
      case 3: iconName = 'check-circle'; break;
    }

    return (
      <View key={index} style={styles.stepItem}>
        <View style={[
          styles.stepIconContainer,
          isActive && styles.stepIconActive,
          isCompleted && styles.stepIconCompleted
        ]}>
          <MaterialIcons 
            name={iconName as any} 
            size={20} 
            color={isActive || isCompleted ? Colors.white : Colors.textTertiary} 
          />
        </View>
        <Text style={[styles.stepLabel, isActive && styles.stepLabelActive]}>{steps[index]}</Text>
      </View>
    );
  };

  const addPartner = () => {
    setFormData(prev => ({
      ...prev,
      partners: [...prev.partners, { name: '', id: '', relation: 'Partner' }]
    }));
  };

  const removePartner = (index: number) => {
    setFormData(prev => ({
      ...prev,
      partners: prev.partners.filter((_, i: number) => i !== index)
    }));
  };

  const updatePartner = (index: number, field: string, value: string) => {
    const newPartners = [...formData.partners];
    newPartners[index] = { ...newPartners[index], [field]: value };
    setFormData(prev => ({ ...prev, partners: newPartners }));
  };

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      children: [...prev.children, { name: '', age: '', id: '' }]
    }));
  };

  const removeChild = (index: number) => {
    setFormData(prev => ({
      ...prev,
      children: prev.children.filter((_, i: number) => i !== index)
    }));
  };

  const updateChild = (index: number, field: string, value: string) => {
    const newChildren = [...formData.children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    setFormData(prev => ({ ...prev, children: newChildren }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.upi || !formData.size) {
      Alert.alert('Error', 'Please fill in all required fields (UPI and Size)');
      return;
    }

    setLoading(true);

    try {
      // Get current user (already loaded in effect)
      if (!user) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      // Prepare parcel data
      const parcelData = {
        upi: formData.upi,
        size: `${formData.size} sqm`,
        use: formData.landUse,
        district: formData.district,
        sector: formData.sector,
        cell: formData.cell,
        village: formData.village,
        location: `${formData.village ? formData.village + ', ' : ''}${formData.cell}, ${formData.sector}, ${formData.province}`,
        status: 'Pending Verification', 
        ownerName: formData.ownerName || user.name,
        imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
        price: null,
        userId: user.id,
        partners: encryptData(JSON.stringify(formData.partners)),
        children: encryptData(JSON.stringify(formData.children)),
        coordinates: {
          type: "Polygon",
          coordinates: [[
            [30.0619, -1.9441],
            [30.0625, -1.9441],
            [30.0625, -1.9450],
            [30.0619, -1.9450],
            [30.0619, -1.9441]
          ]]
        },
        documents: [
          { name: "National ID Copy", status: "Uploaded", type: "ID" },
          { name: "Sale Agreement", status: "Uploaded", type: "CONTRACT" },
          { name: "Tax Clearance", status: "Uploaded", type: "TAX" }
        ].filter((_, i) => [formData.hasIdCopy, formData.hasSaleAgreement, formData.hasTaxClearance][i])
      };

      const response = await fetch(API_ENDPOINTS.PARCELS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parcelData),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Registration Failed', data.error || 'Failed to register parcel');
        return;
      }

      Alert.alert(
        'Success',
        `Parcel ${formData.upi} has been registered successfully!`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              // Navigate to dashboard and trigger refresh
              onNavigate('dashboard');
              // The dashboard will refresh parcels when it comes into focus
            }
          }
        ]
      );
    } catch (error) {
      console.error('Register land error:', error);
      Alert.alert(
        'Connection Error',
        'Could not connect to server. Please check your network connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={GlobalStyles.safeArea}>
        <MainHeader 
          user={user} 
          showBack 
          onBack={() => onNavigate('dashboard')} 
          title="Registration"
        />

        <View style={styles.stepsIndicator}>
          {steps.map((_, i) => renderStepIcon(i))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.intro}>
            <Text style={styles.title}>
              {step === 1 ? 'Parcel Details' : 
               step === 2 ? 'Owner Information' : 
               step === 3 ? 'Document Upload' : 'Final Review'}
            </Text>
            <Text style={styles.subtitle}>Step {step} of 4. {
              step === 1 ? 'Please define the geographical boundaries and usage type of the land parcel.' :
              step === 2 ? 'Provide information about the legal owners of this parcel.' :
              step === 3 ? 'Upload necessary legal documents and survey reports.' :
              'Review and confirm the information before final submission.'
            }</Text>
          </View>

          {step === 1 && (
            <>
              {/* Location Data Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIcon}>
                    <MaterialIcons name="map" size={18} color={Colors.primary} />
                  </View>
                  <Text style={styles.sectionTitle}>Location Data</Text>
                </View>
                
                <View style={styles.row}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>PROVINCE</Text>
                    <TextInput 
                      style={styles.selectInput}
                      value={formData.province}
                      onChangeText={(text: string) => setFormData({...formData, province: text})}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>DISTRICT</Text>
                    <TextInput 
                      style={styles.selectInput}
                      value={formData.district}
                      onChangeText={(text: string) => setFormData({...formData, district: text})}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>SECTOR</Text>
                    <TextInput 
                      style={styles.selectInput}
                      value={formData.sector}
                      onChangeText={(text: string) => setFormData({...formData, sector: text})}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>CELL</Text>
                    <TextInput 
                      style={styles.selectInput}
                      value={formData.cell}
                      onChangeText={(text: string) => setFormData({...formData, cell: text})}
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>VILLAGE</Text>
                    <TextInput 
                      style={styles.selectInput}
                      placeholder="e.g. Isangano"
                      value={formData.village}
                      onChangeText={(text: string) => setFormData({...formData, village: text})}
                    />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.inputLabel}>UPI NUMBER</Text>
                    <Pressable><Text style={styles.generateText}>Generate New</Text></Pressable>
                  </View>
                  <View style={styles.upiInput}>
                    <Text style={styles.upiPrefix}>UPI - </Text>
                    <TextInput 
                      style={styles.textInput}
                      placeholder="X/XX/XX/XX/XXXX"
                      placeholderTextColor={Colors.textTertiary}
                      value={formData.upi}
                      onChangeText={(text: string) => setFormData({...formData, upi: text})}
                    />
                    <MaterialIcons name="qr-code-scanner" size={20} color={Colors.textTertiary} />
                  </View>
                  <Text style={styles.inputHint}>Leave blank if the parcel is not yet surveyed.</Text>
                </View>
              </View>

              {/* Boundaries Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIcon}>
                    <MaterialIcons name="share" size={18} color={Colors.success} />
                  </View>
                  <Text style={styles.sectionTitle}>Boundaries</Text>
                </View>
                
                <Pressable style={styles.mapPlaceholder}>
                  <View style={styles.mapIcon}>
                    <MaterialIcons name="location-on" size={24} color={Colors.primary} />
                  </View>
                  <Text style={styles.mapText}>Set Boundaries on Map</Text>
                  <Text style={styles.mapSubtext}>Tap to open GIS tool</Text>
                </Pressable>
              </View>

              {/* Specs Section */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionIcon}>
                    <MaterialIcons name="view-quilt" size={18} color={Colors.accent} />
                  </View>
                  <Text style={styles.sectionTitle}>Specs</Text>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>LAND USE CATEGORY</Text>
                  <TextInput 
                    style={styles.selectInput}
                    value={formData.landUse}
                    onChangeText={(text: string) => setFormData({...formData, landUse: text})}
                  />
                </View>

                <View style={styles.row}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>APPROX SIZE</Text>
                    <View style={styles.sizeInput}>
                      <TextInput 
                        style={styles.textInput}
                        placeholder="0"
                        keyboardType="numeric"
                        value={formData.size}
                        onChangeText={(text: string) => setFormData({...formData, size: text})}
                      />
                      <Text style={styles.unitText}>m²</Text>
                    </View>
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>OWNERSHIP TYPE</Text>
                    <TextInput 
                      style={styles.selectInput}
                      value={formData.ownership}
                      onChangeText={(text: string) => setFormData({...formData, ownership: text})}
                    />
                  </View>
                </View>
              </View>
            </>
          )}

          {step === 2 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <MaterialIcons name="person" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Primary Owner Information</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>FULL LEGAL NAME</Text>
                <TextInput 
                  style={styles.selectInput}
                  placeholder="Enter full name as on ID"
                  value={formData.ownerName}
                  onChangeText={(text: string) => setFormData({...formData, ownerName: text})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>NATIONAL ID NUMBER</Text>
                <TextInput 
                  style={styles.selectInput}
                  placeholder="1 1990 8 0000000 0 00"
                  keyboardType="numeric"
                  value={formData.ownerId}
                  onChangeText={(text: string) => setFormData({...formData, ownerId: text})}
                />
              </View>

              <View style={styles.row}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                  <TextInput 
                    style={styles.selectInput}
                    placeholder="+250..."
                    keyboardType="phone-pad"
                    value={formData.ownerPhone}
                    onChangeText={(text: string) => setFormData({...formData, ownerPhone: text})}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>EMAIL ADDRESS (OPTIONAL)</Text>
                <TextInput 
                  style={styles.selectInput}
                  placeholder="example@mail.com"
                  keyboardType="email-address"
                  value={formData.ownerEmail}
                  onChangeText={(text: string) => setFormData({...formData, ownerEmail: text})}
                />
              </View>

              {/* Partners Section */}
              <View style={styles.subSection}>
                <View style={[styles.sectionHeader, { marginBottom: 10 }]}>
                  <Text style={styles.subSectionTitle}>Joint Owners / Partners</Text>
                  <Pressable onPress={addPartner} style={styles.addButton}>
                    <MaterialIcons name="add" size={16} color={Colors.white} />
                  </Pressable>
                </View>
                {formData.partners.map((partner: any, index: number) => (
                  <View key={index} style={styles.itemRow}>
                    <TextInput 
                      style={[styles.smallInput, { flex: 2 }]} 
                      placeholder="Name" 
                      value={partner.name}
                      onChangeText={(t: string) => updatePartner(index, 'name', t)}
                    />
                    <TextInput 
                      style={[styles.smallInput, { flex: 1.5 }]} 
                      placeholder="ID" 
                      value={partner.id}
                      onChangeText={(t: string) => updatePartner(index, 'id', t)}
                    />
                    <Pressable onPress={() => removePartner(index)}>
                      <MaterialIcons name="remove-circle-outline" size={24} color={Colors.error} />
                    </Pressable>
                  </View>
                ))}
              </View>

              {/* Children Section */}
              <View style={styles.subSection}>
                <View style={[styles.sectionHeader, { marginBottom: 10 }]}>
                  <Text style={styles.subSectionTitle}>Family / Children</Text>
                  <Pressable onPress={addChild} style={styles.addButton}>
                    <MaterialIcons name="add" size={16} color={Colors.white} />
                  </Pressable>
                </View>
                {formData.children.map((child: any, index: number) => (
                  <View key={index} style={styles.itemRow}>
                    <TextInput 
                      style={[styles.smallInput, { flex: 2 }]} 
                      placeholder="Name" 
                      value={child.name}
                      onChangeText={(t: string) => updateChild(index, 'name', t)}
                    />
                    <TextInput 
                      style={[styles.smallInput, { flex: 0.8 }]} 
                      placeholder="Age" 
                      keyboardType="numeric"
                      value={child.age}
                      onChangeText={(t: string) => updateChild(index, 'age', t)}
                    />
                    <Pressable onPress={() => removeChild(index)}>
                      <MaterialIcons name="remove-circle-outline" size={24} color={Colors.error} />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <MaterialIcons name="cloud-upload" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Required Documents</Text>
              </View>

              <Pressable 
                style={[styles.docItem, formData.hasIdCopy && styles.docItemActive]}
                onPress={() => setFormData({...formData, hasIdCopy: !formData.hasIdCopy})}
              >
                <View style={styles.docInfo}>
                  <MaterialIcons name="badge" size={24} color={formData.hasIdCopy ? Colors.primary : Colors.textTertiary} />
                  <View>
                    <Text style={styles.docName}>National ID Copy</Text>
                    <Text style={styles.docStatus}>{formData.hasIdCopy ? 'Uploaded' : 'Not uploaded'}</Text>
                  </View>
                </View>
                <MaterialIcons name={formData.hasIdCopy ? "check-circle" : "add-circle-outline"} size={24} color={formData.hasIdCopy ? Colors.success : Colors.border} />
              </Pressable>

              <Pressable 
                style={[styles.docItem, formData.hasSaleAgreement && styles.docItemActive]}
                onPress={() => setFormData({...formData, hasSaleAgreement: !formData.hasSaleAgreement})}
              >
                <View style={styles.docInfo}>
                  <MaterialIcons name="gavel" size={24} color={formData.hasSaleAgreement ? Colors.primary : Colors.textTertiary} />
                  <View>
                    <Text style={styles.docName}>Sale Agreement</Text>
                    <Text style={styles.docStatus}>{formData.hasSaleAgreement ? 'Uploaded' : 'Not uploaded'}</Text>
                  </View>
                </View>
                <MaterialIcons name={formData.hasSaleAgreement ? "check-circle" : "add-circle-outline"} size={24} color={formData.hasSaleAgreement ? Colors.success : Colors.border} />
              </Pressable>

              <Pressable 
                style={[styles.docItem, formData.hasTaxClearance && styles.docItemActive]}
                onPress={() => setFormData({...formData, hasTaxClearance: !formData.hasTaxClearance})}
              >
                <View style={styles.docInfo}>
                  <MaterialIcons name="receipt-long" size={24} color={formData.hasTaxClearance ? Colors.primary : Colors.textTertiary} />
                  <View>
                    <Text style={styles.docName}>Tax Clearance Certificate</Text>
                    <Text style={styles.docStatus}>{formData.hasTaxClearance ? 'Uploaded' : 'Not uploaded'}</Text>
                  </View>
                </View>
                <MaterialIcons name={formData.hasTaxClearance ? "check-circle" : "add-circle-outline"} size={24} color={formData.hasTaxClearance ? Colors.success : Colors.border} />
              </Pressable>
            </View>
          )}

          {step === 4 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <MaterialIcons name="fact-check" size={18} color={Colors.primary} />
                </View>
                <Text style={styles.sectionTitle}>Summary Review</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>UPI NUMBER</Text>
                <Text style={styles.summaryValue}>{formData.upi}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>LOCATION</Text>
                <Text style={styles.summaryValue}>{formData.sector}, {formData.cell}, {formData.district}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>SIZE & USE</Text>
                <Text style={styles.summaryValue}>{formData.size} m² | {formData.landUse}</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>OWNER</Text>
                <Text style={styles.summaryValue}>{formData.ownerName || 'Not provided'}</Text>
              </View>

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>ID NUMBER</Text>
                <Text style={styles.summaryValue}>{formData.ownerId || 'Not provided'}</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>DOCUMENTS</Text>
                <Text style={styles.summaryValue}>
                  {[
                    formData.hasIdCopy && 'ID',
                    formData.hasSaleAgreement && 'Sale Agreement',
                    formData.hasTaxClearance && 'Tax'
                  ].filter(Boolean).join(', ') || 'None provided'}
                </Text>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable 
            onPress={() => step > 1 ? setStep(step - 1) : onNavigate('dashboard')}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>{step > 1 ? 'Back' : 'Cancel'}</Text>
          </Pressable>
          <Pressable 
            onPress={() => {
              // Standard step validation
              if (step < 4) {
                if (step === 1 && (!formData.upi || !formData.size)) {
                  Alert.alert('Error', 'Please fill in all required fields (UPI and Size)');
                  return;
                }
                if (step === 2 && (!formData.ownerName || !formData.ownerId)) {
                  Alert.alert('Error', 'Please provide owner details (Name and ID)');
                  return;
                }
                setStep(step + 1);
              } else {
                handleSubmit();
              }
            }}
            disabled={loading}
            style={[styles.nextButton, loading && { opacity: 0.6 }]}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <>
                <Text style={styles.nextButtonText}>{step < 4 ? 'Continue' : 'Register Parcel'}</Text>
                <MaterialIcons name={step < 4 ? "arrow-forward" : "check"} size={20} color={Colors.white} />
              </>
            )}
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  helpButton: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.textPrimary },
  
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  stepItem: {
    alignItems: 'center',
    gap: 8,
  },
  stepIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconActive: {
    backgroundColor: Colors.primary,
  },
  stepIconCompleted: {
    backgroundColor: Colors.success,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textTertiary,
  },
  stepLabelActive: {
    color: Colors.primary,
  },
  
  scrollContent: {
    padding: 24,
    gap: 32,
    paddingBottom: 150,
  },
  intro: {
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  
  section: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  inputGroup: {
    flex: 1,
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
  },
  generateText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  upiInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: getColorWithOpacity(Colors.primary, 0.03),
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sizeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  upiPrefix: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  inputText: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
    padding: 0,
  },
  unitText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textTertiary,
  },
  inputHint: {
    fontSize: 10,
    color: Colors.textTertiary,
    fontStyle: 'italic',
  },
  
  mapPlaceholder: {
    height: 120,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  mapIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  mapText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  mapSubtext: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  
  footer: {
    position: 'absolute',
    marginBottom: 50,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 16,
    paddingBottom: 50,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  nextButton: {
    flex: 2,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
  
  // Document styles
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 12,
  },
  docItemActive: {
    borderColor: Colors.primary,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.05),
  },
  docInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  docName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  docStatus: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  
  // Summary styles
  summaryItem: {
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 16,
  },
  subSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: 20,
  },
  subSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  addButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  smallInput: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    color: Colors.textPrimary,
  },
});

export default RegisterLandScreen;
