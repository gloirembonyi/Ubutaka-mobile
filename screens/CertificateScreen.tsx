
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Platform, Image, Share } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Screen, Parcel } from '../types';
import { Certificate, LandTitle } from '../types/certificate';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { useAuthStore } from '../store/authStore';

interface CertificateScreenProps {
  onNavigate: (screen: Screen) => void;
  parcelData?: Parcel;
}

// Translations
const translations = {
  EN: {
    title: "Digital Land Title",
    republic: "REPUBLIC OF RWANDA",
    authority: "National Land Authority",
    certTitle: "CERTIFICATE OF REGISTRATION",
    upi: "Unique Parcel Identifier (UPI)",
    owner: "Owner Identity",
    location: "Location",
    size: "Size",
    use: "Land Use",
    issueDate: "Issue Date",
    hash: "Blockchain Hash",
    download: "Download PDF",
    share: "Share Certificate",
    verified: "Blockchain Verified",
    scanContext: "Scan to verify authenticity",
    district: "District",
    sector: "Sector",
    cell: "Cell",
    village: "Village",
  },
  RW: {
    title: "Icyangombwa cy'Ubutaka",
    republic: "REPUBULIKA Y'U RWANDA",
    authority: "Ikigo cy'Igihugu gishinzwe Ubutaka",
    certTitle: "ICYEMEZO CY'IYANDIKISHA",
    upi: "Nimero y'Ikibanza (UPI)",
    owner: "Umwirondoro wa Nyiracyo",
    location: "Aho giherereye",
    size: "Ubuso",
    use: "Icyo gikoreshwa",
    issueDate: "Itariki cyatangiweho",
    hash: "Kodu ya Blockchain",
    download: "Manura PDF",
    share: "Sangiza abandi",
    verified: "Byemejwe na Blockchain",
    scanContext: "Sikana kugirango usuzume",
    district: "Akarere",
    sector: "Umurenge",
    cell: "Akagari",
    village: "Umudugudu",
  },
  FR: {
    title: "Titre Foncier Numérique",
    republic: "RÉPUBLIQUE DU RWANDA",
    authority: "Office National des Terres",
    certTitle: "CERTIFICAT D'ENREGISTREMENT",
    upi: "Identifiant Unique de Parcelle (UPI)",
    owner: "Identité du Propriétaire",
    location: "Localisation",
    size: "Taille",
    use: "Usage des Terres",
    issueDate: "Date d'Émission",
    hash: "Empreinte Blockchain",
    download: "Télécharger PDF",
    share: "Partager",
    verified: "Vérifié Blockchain",
    scanContext: "Scannez pour vérifier",
    district: "District",
    sector: "Secteur",
    cell: "Cellule",
    village: "Village",
  }
};

type LangCode = 'EN' | 'RW' | 'FR';

const CertificateScreen: React.FC<CertificateScreenProps> = ({ onNavigate, parcelData }) => {
  const [lang, setLang] = useState<LangCode>('EN');
  const user = useAuthStore(state => state.user);
  
  // Use parcel data if available, otherwise mock for demo
  const parcel = parcelData || {
    upi: "1/03/04/05/1234",
    ownerName: user?.name || "MUGAKIHIRE Jean",
    district: "Gasabo",
    location: "Kimironko",
    size: "650 sqm",
    use: "Residential",
    certificateId: "CERT-2026-00129",
    verifiedAt: new Date().toISOString(),
  } as any;

  const certificate: Certificate = {
    id: parcel.certificateId || `CERT-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    issuedAt: parcel.verifiedAt || new Date().toISOString(),
    issuedBy: "RLMUA",
    watermarkText: "VALID E-TITLE",
    qrData: JSON.stringify({
      ver: 1,
      upi: parcel.upi,
      certId: parcel.certificateId,
      owner: parcel.ownerName
    }),
    landTitle: {
      upi: parcel.upi,
      ownerName: parcel.ownerName,
      ownerAuthId: user?.id || "u1",
      nationalId: user?.nationalId || "1199080000000000",
      district: parcel.district || "Gasabo",
      sector: parcel.location?.split(',')[0] || "Kimironko",
      cell: parcel.location?.split(',')[1] || "Kibagabaga",
      village: "Buriga",
      size: parcel.size || "Unknown",
      landUse: parcel.use || "Unknown",
      issueDate: parcel.verifiedAt ? new Date(parcel.verifiedAt).toLocaleDateString() : new Date().toLocaleDateString(),
      coordinates: [{ latitude: -1.9441, longitude: 30.0619 }],
      blockchainHash: parcel.blockchainHash || "0x8f2d7e4b9c1a3f5d6e2b8a4c9d3e5f7a1c2b4d6e8f0a2c4e6b8d0f2a4c6e8d0",
      status: "ACTIVE",
      ownerPhoto: user?.avatar || `https://ui-avatars.com/api/?name=${parcel.ownerName}&background=random`
    }
  };

  const t = translations[lang];

  const generatePDF = async () => {
    try {
      const html = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #333; position: relative; }
              .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #2E7D32; padding-bottom: 20px; }
              .coat-of-arms { width: 80px; height: 80px; margin-bottom: 10px; }
              h1 { color: #2E7D32; font-size: 24px; margin: 0; text-transform: uppercase; }
              h2 { font-size: 16px; color: #666; margin: 10px 0 0 0; font-weight: normal; }
              .title-header { text-align: center; margin: 30px 0; }
              .title-header h3 { font-size: 28px; margin: 0; letter-spacing: 2px; }
              .content { margin-top: 30px; display: flex; flex-direction: row; }
              .details { flex: 2; margin-right: 20px; }
              .photo-section { flex: 1; text-align: right; }
              .avatar { width: 150px; height: 150px; border-radius: 10px; border: 1px solid #ddd; object-fit: cover; }
              .row { margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
              .label { font-weight: bold; color: #555; display: block; font-size: 12px; margin-bottom: 4px; }
              .value { font-size: 16px; color: #000; }
              .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #888; border-top: 1px solid #ddd; padding-top: 20px; }
              .hash { font-family: monospace; background: #f5f5f5; padding: 10px; word-break: break-all; border-radius: 4px; font-size: 10px; margin-top: 20px; }
              .watermark { 
                position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 100px; color: rgba(46, 125, 50, 0.05); z-index: -1; white-space: nowrap; pointer-events: none;
              }
            </style>
          </head>
          <body>
            <div class="watermark">${certificate.watermarkText}</div>
            <div class="header">
              <h1>${t.republic}</h1>
              <h2>${t.authority}</h2>
            </div>
            
            <div class="title-header">
              <h3>${t.certTitle}</h3>
              <p>No: ${certificate.id}</p>
            </div>

            <div class="content">
              <div class="details">
                <div class="row">
                  <span class="label">${t.upi}</span>
                  <span class="value">${certificate.landTitle.upi}</span>
                </div>
                <div class="row">
                  <span class="label">${t.owner}</span>
                  <span class="value">${certificate.landTitle.ownerName}</span>
                  <div style="font-size: 12px; color: #666;">ID: ${certificate.landTitle.nationalId}</div>
                </div>
                <div class="row">
                  <span class="label">${t.location}</span>
                  <span class="value">${certificate.landTitle.district}, ${certificate.landTitle.sector}, ${certificate.landTitle.cell}</span>
                </div>
                <div class="row">
                  <span class="label">${t.size} / ${t.use}</span>
                  <span class="value">${certificate.landTitle.size} - ${certificate.landTitle.landUse}</span>
                </div>
                <div class="row">
                  <span class="label">${t.issueDate}</span>
                  <span class="value">${certificate.landTitle.issueDate}</span>
                </div>
              </div>
              <div class="photo-section">
                <!-- If converting to base64 or using public URL -->
                <img src="${certificate.landTitle.ownerPhoto}" class="avatar" />
              </div>
            </div>

            <div class="hash">
              <strong>${t.hash}:</strong><br/>
              ${certificate.landTitle.blockchainHash}
            </div>

            <div class="footer">
              <p>This document is digitally signed and secured by blockchain technology.</p>
              <p>Generated on ${new Date().toDateString()}</p>
            </div>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (error) {
      Alert.alert("Error", "Could not generate PDF");
      console.error(error);
    }
  };

  const handleShare = async () => {
    try {
        await Share.share({
            message: `Land Title Certificate for UPI: ${certificate.landTitle.upi}. Owner: ${certificate.landTitle.ownerName}. Verified by Ubutaka Blockchain.`,
            title: `Land Title - ${certificate.landTitle.upi}`
        });
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('landing')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>{t.title}</Text>
        <View style={styles.langSwitch}>
            {(['RW', 'EN', 'FR'] as LangCode[]).map((code) => (
                <Pressable key={code} onPress={() => setLang(code)}>
                    <Text style={[styles.langText, lang === code && styles.activeLang]}>{code}</Text>
                </Pressable>
            ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Certificate Card */}
        <View style={styles.certificateCard}>
          <View style={styles.watermarkContainer}>
             <Text style={styles.watermarkText}>ORIGINAL</Text>
          </View>
          
          <View style={styles.certHeader}>
            <View style={styles.logoPlaceholder}>
                <FontAwesome5 name="dungeon" size={24} color={Colors.primary} />
            </View>
            <View style={styles.certHeaderText}>
                <Text style={styles.republicText}>{t.republic}</Text>
                <Text style={styles.authorityText}>{t.authority}</Text>
            </View>
          </View>

          <View style={styles.certTitleRow}>
            <Text style={styles.certMainTitle}>{t.certTitle}</Text>
          </View>

          <View style={styles.certBody}>
            <View style={styles.ownerSection}>
                <Image 
                    source={{ uri: certificate.landTitle.ownerPhoto }} 
                    style={styles.ownerPhoto} 
                />
                <View style={styles.ownerDetails}>
                    <Text style={styles.label}>{t.upi}</Text>
                    <Text style={styles.valueHighlight}>{certificate.landTitle.upi}</Text>
                    
                    <Text style={styles.label}>{t.owner}</Text>
                    <Text style={styles.value}>{certificate.landTitle.ownerName}</Text>
                    <Text style={styles.subValue}>ID: {certificate.landTitle.nationalId}</Text>
                </View>
            </View>

            <View style={styles.detailsGrid}>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>{t.location}</Text>
                    <Text style={styles.value}>{certificate.landTitle.district}</Text>
                    <Text style={styles.subValue}>{certificate.landTitle.sector}, {certificate.landTitle.cell}</Text>
                </View>
                <View style={styles.gridItem}>
                    <Text style={styles.label}>{t.size} / {t.use}</Text>
                    <Text style={styles.value}>{certificate.landTitle.size}</Text>
                    <Text style={styles.subValue}>{certificate.landTitle.landUse}</Text>
                </View>
            </View>

            {/* QR and Verification */}
            <View style={styles.verificationSection}>
                <View style={styles.qrContainer}>
                    <QRCode value={certificate.qrData} size={80} />
                </View>
                <View style={styles.blockchainInfo}>
                    <View style={styles.verifiedBadge}>
                        <MaterialIcons name="verified-user" size={16} color={Colors.success} />
                        <Text style={styles.verifiedText}>{t.verified}</Text>
                    </View>
                    <Text style={styles.hashLabel}>{t.hash}</Text>
                    <Text style={styles.hashValue} numberOfLines={1} ellipsizeMode="middle">
                        {certificate.landTitle.blockchainHash}
                    </Text>
                    <Text style={styles.scanHint}>{t.scanContext}</Text>
                </View>
            </View>
          </View>

          <View style={styles.certFooter}>
            <Text style={styles.issueDate}>{t.issueDate}: {certificate.landTitle.issueDate}</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
            <Pressable 
                style={[styles.actionButton, styles.downloadButton]}
                onPress={generatePDF}
            >
                <MaterialIcons name="file-download" size={24} color={Colors.white} />
                <Text style={styles.actionButtonText}>{t.download}</Text>
            </Pressable>

            <Pressable 
                style={[styles.actionButton, styles.shareButton]}
                onPress={handleShare}
            >
                <MaterialIcons name="share" size={24} color={Colors.primary} />
                <Text style={[styles.actionButtonText, { color: Colors.primary }]}>{t.share}</Text>
            </Pressable>
        </View>

        <Pressable 
            style={styles.verifyLink}
            onPress={() => onNavigate('qr-scanner')}
        >
            <MaterialIcons name="qr-code-scanner" size={20} color={Colors.textSecondary} />
            <Text style={styles.verifyLinkText}>Verify another certificate</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  langSwitch: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 4,
    borderRadius: 8,
  },
  langText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  activeLang: {
    color: Colors.white,
    textDecorationLine: 'underline',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 150,
  },
  certificateCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    padding: 2, // Inner border effect
  },
  watermarkContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
    opacity: 0.03,
    transform: [{ rotate: '-45deg' }],
  },
  watermarkText: {
    fontSize: 80,
    fontWeight: '900',
    color: '#000',
    width: 500,
    textAlign: 'center',
  },
  certHeader: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    marginRight: 16,
  },
  certHeaderText: {
    flex: 1,
  },
  republicText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    letterSpacing: 1,
  },
  authorityText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  certTitleRow: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  certMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  certBody: {
    padding: 20,
  },
  ownerSection: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 12,
  },
  ownerPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#ddd',
  },
  ownerDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 2,
    marginTop: 6,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  valueHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  subValue: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  detailsGrid: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 16,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
  },
  verificationSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7F0',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  qrContainer: {
    marginRight: 16,
    backgroundColor: '#fff',
    padding: 4,
    borderRadius: 4,
  },
  blockchainInfo: {
    flex: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.success,
    marginLeft: 4,
  },
  hashLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  hashValue: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: Colors.textPrimary,
    backgroundColor: 'rgba(255,255,255,0.5)',
    padding: 2,
    borderRadius: 2,
  },
  scanHint: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  certFooter: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  issueDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 24,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    borderRadius: 12,
    gap: 8,
  },
  downloadButton: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  shareButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  verifyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 8,
  },
  verifyLinkText: {
    color: Colors.textSecondary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default CertificateScreen;
