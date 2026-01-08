
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface RegisterLandScreenProps {
  onNavigate: (screen: Screen) => void;
}

const RegisterLandScreen: React.FC<RegisterLandScreenProps> = ({ onNavigate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    province: 'Kigali City',
    district: 'Gasabo',
    sector: 'Remera',
    cell: 'Nyabisindu',
    upi: '',
    landUse: 'Residential (R1)',
    size: '',
    ownership: 'Freehold'
  });

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

  return (
    <View style={GlobalStyles.container}>
      <SafeAreaView edges={['top']} style={GlobalStyles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Registration</Text>
          <Pressable style={styles.helpButton}>
            <MaterialIcons name="help-outline" size={24} color={Colors.textSecondary} />
          </Pressable>
        </View>

        <View style={styles.stepsIndicator}>
          {steps.map((_, i) => renderStepIcon(i))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.intro}>
            <Text style={styles.title}>Parcel Details</Text>
            <Text style={styles.subtitle}>Step {step} of 4. Please define the geographical boundaries and usage type of the land parcel.</Text>
          </View>

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
                <View style={styles.selectInput}>
                  <Text style={styles.inputText}>{formData.province}</Text>
                  <MaterialIcons name="expand-more" size={20} color={Colors.textSecondary} />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>DISTRICT</Text>
                <View style={styles.selectInput}>
                  <Text style={styles.inputText}>{formData.district}</Text>
                  <MaterialIcons name="expand-more" size={20} color={Colors.textSecondary} />
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>SECTOR</Text>
                <View style={styles.selectInput}>
                  <Text style={styles.inputText}>{formData.sector}</Text>
                  <MaterialIcons name="expand-more" size={20} color={Colors.textSecondary} />
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CELL</Text>
                <View style={styles.selectInput}>
                  <Text style={styles.inputText}>{formData.cell}</Text>
                  <MaterialIcons name="expand-more" size={20} color={Colors.textSecondary} />
                </View>
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
                  onChangeText={(text) => setFormData({...formData, upi: text})}
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
              <View style={styles.selectInput}>
                <Text style={styles.inputText}>{formData.landUse}</Text>
                <MaterialIcons name="expand-more" size={20} color={Colors.textSecondary} />
              </View>
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
                    onChangeText={(text) => setFormData({...formData, size: text})}
                  />
                  <Text style={styles.unitText}>m²</Text>
                </View>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>OWNERSHIP TYPE</Text>
                <View style={styles.selectInput}>
                  <Text style={styles.inputText}>{formData.ownership}</Text>
                  <MaterialIcons name="expand-more" size={20} color={Colors.textSecondary} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable 
            onPress={() => onNavigate('dashboard')}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </Pressable>
          <Pressable 
            onPress={() => onNavigate('verification')}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>Next: Owner Info</Text>
            <MaterialIcons name="arrow-forward" size={20} color={Colors.white} />
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
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    gap: 16,
    paddingBottom: 40,
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
});

export default RegisterLandScreen;
