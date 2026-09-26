
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Alert, TextInput, Modal, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';

interface VerifyResult {
  authentic: boolean;
  reasons?: string[];
  reason?: string;
  parcel?: { upi: string; ownerName: string; size: string; use: string; location: string; status: string; certificateId: string | null; verifiedAt: string | null };
  ledger?: { valid: boolean; blocks: number };
  openDisputes?: number;
}

interface QRScannerScreenProps {
  onNavigate: (screen: Screen) => void;
}

const { width } = Dimensions.get('window');
const SCAN_AREA_SIZE = 250;

const QRScannerScreen: React.FC<QRScannerScreenProps> = ({ onNavigate }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [manualUpi, setManualUpi] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.permissionContainer}>
        <MaterialIcons name="camera-alt" size={64} color={Colors.textSecondary} style={{ marginBottom: 16 }} />
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <Pressable onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </Pressable>
        <Pressable onPress={() => onNavigate('landing')} style={{ marginTop: 24 }}>
          <Text style={{ color: Colors.primary }}>Cancel</Text>
        </Pressable>
      </View>
    );
  }

  // Asks the national registry whether the certificate is genuine and still current.
  const verify = async (upi: string, certId?: string, hash?: string) => {
    setChecking(true);
    try {
      const params = new URLSearchParams({ upi });
      if (certId) params.append('certId', certId);
      if (hash) params.append('hash', hash);
      const response = await fetch(`${API_ENDPOINTS.VERIFY}?${params.toString()}`);
      setResult(await response.json());
    } catch (e) {
      Alert.alert('Connection Error', 'Could not reach the land registry. Please try again.', [{ text: 'OK', onPress: () => setScanned(false) }]);
    } finally {
      setChecking(false);
    }
  };

  const handleBarCodeScanned = ({ data }: { type: string; data: string }) => {
    setScanned(true);
    try {
      const certData = JSON.parse(data);
      if (!certData.upi) throw new Error('no upi');
      verify(certData.upi, certData.certId || certData.certificateId, certData.hash);
    } catch (e) {
      Alert.alert('Scan Error', 'This is not an Ubutaka land certificate QR code.', [{ text: 'OK', onPress: () => setScanned(false) }]);
    }
  };

  const closeResult = () => {
    setResult(null);
    setScanned(false);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
            barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
            <View style={styles.overlayHeader}>
                <Pressable onPress={() => onNavigate('certificate')} style={styles.closeButton}>
                    <MaterialIcons name="close" size={24} color={Colors.white} />
                </Pressable>
                <Text style={styles.title}>Scan QR Code</Text>
            </View>

            <View style={styles.scanArea}>
                <View style={styles.cornerTL} />
                <View style={styles.cornerTR} />
                <View style={styles.cornerBL} />
                <View style={styles.cornerBR} />
                {scanned && (
                    <View style={styles.loadingOverlay}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Processing...</Text>
                    </View>
                )}
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.overlayBottom}>
                <Text style={styles.hintText}>Align the QR code within the frame to verify land title authenticity.</Text>
                <View style={styles.manualRow}>
                    <TextInput
                        value={manualUpi}
                        onChangeText={setManualUpi}
                        placeholder="Or enter a UPI, e.g. 1/02/03/01/1245"
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        style={styles.manualInput}
                        autoCapitalize="none"
                    />
                    <Pressable
                        style={styles.manualButton}
                        disabled={!manualUpi.trim() || checking}
                        onPress={() => { setScanned(true); verify(manualUpi.trim()); }}
                    >
                        {checking ? <ActivityIndicator color={Colors.white} /> : <MaterialIcons name="search" size={22} color={Colors.white} />}
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
      </CameraView>
      <Modal visible={result !== null} transparent animationType="slide" onRequestClose={closeResult}>
        <View style={styles.resultOverlay}>
          <View style={styles.resultCard}>
            <View style={[styles.resultBadge, { backgroundColor: result?.authentic ? Colors.success : Colors.error }]}>
              <MaterialIcons name={result?.authentic ? 'verified' : 'gpp-bad'} size={40} color={Colors.white} />
            </View>
            <Text style={styles.resultTitle}>{result?.authentic ? 'Authentic Certificate' : 'Verification Failed'}</Text>
            {result?.parcel ? (
              <View style={styles.resultBody}>
                {[
                  ['UPI', result.parcel.upi],
                  ['Registered owner', result.parcel.ownerName],
                  ['Certificate', result.parcel.certificateId || 'Not issued'],
                  ['Size / use', `${result.parcel.size} · ${result.parcel.use}`],
                  ['Location', result.parcel.location],
                  ['Status', result.parcel.status],
                  ['Ledger', result.ledger?.valid ? `Intact (${result.ledger.blocks} record(s))` : 'Integrity check failed'],
                  ['Open disputes', String(result.openDisputes ?? 0)],
                ].map(([k, v]) => (
                  <View key={k} style={styles.resultRow}>
                    <Text style={styles.resultKey}>{k}</Text>
                    <Text style={styles.resultValue}>{v}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            {!result?.authentic && (
              <View style={styles.reasonBox}>
                {(result?.reasons?.length ? result.reasons : [result?.reason || 'Unknown certificate']).map((r) => (
                  <Text key={r} style={styles.reasonText}>• {r}</Text>
                ))}
              </View>
            )}
            <Pressable style={styles.resultButton} onPress={closeResult}>
              <Text style={styles.resultButtonText}>Scan Another</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  manualRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, width: '100%' },
  manualInput: { flex: 1, height: 46, borderRadius: 12, paddingHorizontal: 14, color: Colors.white, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  manualButton: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary },
  resultOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  resultCard: { backgroundColor: Colors.white, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, alignItems: 'center' },
  resultBadge: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginTop: -60, borderWidth: 4, borderColor: Colors.white },
  resultTitle: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginTop: 12, marginBottom: 12 },
  resultBody: { width: '100%', borderTopWidth: 1, borderColor: '#EEF0F3' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderColor: '#EEF0F3', gap: 12 },
  resultKey: { color: Colors.textSecondary, fontSize: 13 },
  resultValue: { color: Colors.textPrimary, fontSize: 13, fontWeight: '700', flexShrink: 1, textAlign: 'right' },
  reasonBox: { width: '100%', backgroundColor: '#FEF2F2', borderRadius: 12, padding: 12, marginTop: 12 },
  reasonText: { color: '#B91C1C', fontSize: 13, marginVertical: 2 },
  resultButton: { marginTop: 18, width: '100%', height: 50, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  resultButtonText: { color: Colors.white, fontWeight: '800', fontSize: 15 },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  permissionText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
    color: Colors.textPrimary,
  },
  permissionButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overlayHeader: {
    width: '100%',
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scanArea: {
    width: SCAN_AREA_SIZE,
    height: SCAN_AREA_SIZE,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.primary,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.primary,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: Colors.primary,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.primary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayBottom: {
    padding: 30,
    paddingBottom: 60,
  },
  hintText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.8,
  },
});

export default QRScannerScreen;
