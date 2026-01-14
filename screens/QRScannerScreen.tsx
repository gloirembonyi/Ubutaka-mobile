
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Button, Dimensions, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { Screen } from '../types';
import { Colors } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';

interface QRScannerScreenProps {
  onNavigate: (screen: Screen) => void;
}

const { width } = Dimensions.get('window');
const SCAN_AREA_SIZE = 250;

const QRScannerScreen: React.FC<QRScannerScreenProps> = ({ onNavigate }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

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

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    // In a real app, we would verify the signature/hash here
    try {
        const certData = JSON.parse(data);
        
        let isValid = false;
        if (certData.hash && certData.upi) {
            isValid = true;
        }

        if (isValid) {
            Alert.alert(
                "Certificate Verified",
                `Valid Land Title Certificate.\nUPI: ${certData.upi}\nHash: ${certData.hash?.substring(0, 10)}...`,
                [
                    { text: "View Certificate", onPress: () => onNavigate('certificate') }, // Simulate opening that specific cert
                    { text: "Scan Again", onPress: () => setScanned(false) }
                ]
            );
        } else {
             Alert.alert(
                "Invalid Certificate",
                "This QR code does not contain valid Ubutaka certificate data.",
                [{ text: "OK", onPress: () => setScanned(false) }]
            );
        }
    } catch (e) {
        Alert.alert(
            "Scan Error", 
            "Not a valid Ubutaka QR code.",
            [{ text: "OK", onPress: () => setScanned(false) }]
        );
    }
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

            <View style={styles.overlayBottom}>
                <Text style={styles.hintText}>Align the QR code within the frame to verify land title authenticity.</Text>
            </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
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
    ...StyleSheet.absoluteFillObject,
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
