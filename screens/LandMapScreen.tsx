
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Alert, Image, Modal, ScrollView, Platform } from 'react-native';
import MapView, { Polygon, Marker, PROVIDER_GOOGLE, UrlTile, MapTypes } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import { Screen } from '../types';
import { LandParcel, MapLayer, MapCoordinates, GeoPoint } from '../types/map';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { GlobalStyles } from '../styles/globalStyles';
import { API_ENDPOINTS } from '../config/api';
import { Parcel } from '../types';
import { toMapCoordinates } from '../utils/geo';

interface LandMapScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
}

const { width, height } = Dimensions.get('window');

const KIGALI_REGION = { latitude: -1.9441, longitude: 30.0619, latitudeDelta: 0.05, longitudeDelta: 0.05 };

const toMapStatus = (status?: string): LandParcel['status'] => {
  if (status === 'Pending Verification' || status === 'Pending Sale') return 'pending';
  if (status === 'Rejected' || status === 'Disputed') return 'disputed';
  return 'active';
};

const parseNumber = (value: unknown): number => {
  const n = parseFloat(String(value ?? '').replace(/[^0-9.]/g, ''));
  return isNaN(n) ? 0 : n;
};

/** Maps an API parcel to the map's LandParcel type; returns null when it has no valid boundary. */
const toLandParcel = (p: Parcel): LandParcel | null => {
  const ring = toMapCoordinates(p.coordinates);
  // GeoJSON rings repeat the first point at the end; drop it for the map polygon.
  const first = ring[0];
  const last = ring[ring.length - 1];
  const boundary = ring.length > 3 && first.latitude === last.latitude && first.longitude === last.longitude
    ? ring.slice(0, -1)
    : ring;
  if (boundary.length < 3 || boundary.some(pt => !isFinite(pt.latitude) || !isFinite(pt.longitude))) return null;
  const center = {
    latitude: boundary.reduce((sum, pt) => sum + pt.latitude, 0) / boundary.length,
    longitude: boundary.reduce((sum, pt) => sum + pt.longitude, 0) / boundary.length,
  };
  return {
    id: p.upi,
    upi: p.upi,
    ownerName: p.ownerName,
    status: toMapStatus(p.status),
    area: parseNumber(p.size),
    value: parseNumber(p.price),
    landUse: p.use,
    center,
    boundary,
  };
};

const LandMapScreen: React.FC<LandMapScreenProps> = ({ onNavigate }) => {
  const mapRef = useRef<MapView>(null);
  const [mapType, setMapType] = useState<MapLayer>('hybrid');
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [selectedParcel, setSelectedParcel] = useState<LandParcel | null>(null);
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<GeoPoint[]>([]);
  const [measureDistance, setMeasureDistance] = useState(0);
  const [loading, setLoading] = useState(true);

  const [parcels, setParcels] = useState<LandParcel[]>([]);
  const [rawParcels, setRawParcels] = useState<Record<string, Parcel>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // 1. Load real parcels from the registry
      let mapped: LandParcel[] = [];
      try {
        const resp = await fetch(API_ENDPOINTS.PARCELS);
        if (!resp.ok) throw new Error(`Server responded ${resp.status}`);
        const data: Parcel[] = await resp.json();
        const list = Array.isArray(data) ? data : [];
        const byUpi: Record<string, Parcel> = {};
        list.forEach(p => { byUpi[p.upi] = p; });
        mapped = list.map(toLandParcel).filter((p): p is LandParcel => p !== null);
        setRawParcels(byUpi);
        setParcels(mapped);
        setLoadError(null);
      } catch (err: any) {
        console.error('Failed to load parcels for map:', err);
        setLoadError(err?.message || 'Could not load parcels');
      }

      // 2. User location (optional)
      let location: Location.LocationObject | null = null;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
        }
      } catch (err) {
        console.warn('Location unavailable:', err);
      }

      // 3. Focus: fit to parcels, else user location, else Kigali
      if (mapRef.current) {
        if (mapped.length > 0) {
          mapRef.current.fitToCoordinates(mapped.flatMap(p => p.boundary), {
            edgePadding: { top: 120, right: 60, bottom: 260, left: 60 },
            animated: true,
          });
        } else if (location) {
          mapRef.current.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        } else {
          mapRef.current.animateToRegion(KIGALI_REGION);
        }
      }
      setLoading(false);
    })();
  }, []);

  const calculateDistance = (points: GeoPoint[]) => {
    if (points.length < 2) return 0;
    
    let totalDist = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalDist += getDistanceFromLatLonInKm(
        points[i].latitude, points[i].longitude,
        points[i+1].latitude, points[i+1].longitude
      );
    }
    return totalDist * 1000; // Convert to meters
  };

  const getDistanceFromLatLonInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; 
    return d;
  }

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180)
  }

  const handleMapPress = (e: any) => {
    if (isMeasuring) {
      const newPoint = e.nativeEvent.coordinate;
      const newPoints = [...measurePoints, newPoint];
      setMeasurePoints(newPoints);
      setMeasureDistance(calculateDistance(newPoints));
    } else {
      setSelectedParcel(null);
    }
  };

  const toggleMeasureTool = () => {
    if (isMeasuring) {
      setIsMeasuring(false);
      setMeasurePoints([]);
      setMeasureDistance(0);
    } else {
      setIsMeasuring(true);
      Alert.alert("Measure Tool", "Tap on the map to place points and measure distance.");
    }
  };

  const handleExportMap = async () => {
    if (!mapRef.current) return;
    const wasMeasuring = isMeasuring;
    try {
      if (wasMeasuring) {
        // Hide measure markers for a clean snapshot and let the map re-render first
        setIsMeasuring(false);
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
      }
      const uri = await mapRef.current.takeSnapshot({
        width: 300,
        height: 300,
        format: 'png',
        quality: 0.8,
        result: 'file',
      });
      if (uri) {
        await Sharing.shareAsync(uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to export map");
    } finally {
      if (wasMeasuring) setIsMeasuring(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => onNavigate('dashboard')} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Interactive Land Map</Text>
        <Pressable onPress={handleExportMap} style={styles.exportButton}>
          <MaterialIcons name="file-download" size={24} color={Colors.white} />
        </Pressable>
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={KIGALI_REGION}
        mapType={mapType === 'hybrid' ? 'hybrid' : mapType === 'satellite' ? 'satellite' : 'standard'}
        showsUserLocation={true}
        showsCompass={true}
        showsScale={true}
        onPress={handleMapPress}
        // Custom tiles for "terrain" or specific requested style if needed, 
        // using standard Google mapTypes for stability on Mobile.
      >
        {/* Parcels */}
        {parcels.map((parcel) => (
          <Polygon
            key={parcel.id}
            coordinates={parcel.boundary}
            strokeColor={selectedParcel?.id === parcel.id ? Colors.accent : Colors.primary}
            fillColor={selectedParcel?.id === parcel.id ? 'rgba(255, 165, 0, 0.3)' : 'rgba(46, 125, 50, 0.2)'}
            strokeWidth={2}
            tappable={!isMeasuring}
            onPress={() => setSelectedParcel(parcel)}
          />
        ))}

        {/* Measure Points */}
        {isMeasuring && measurePoints.map((point, index) => (
            <Marker key={`pt-${index}`} coordinate={point}>
                <View style={styles.measureDot} />
            </Marker>
        ))}
        {isMeasuring && measurePoints.length > 1 && (
             <Polygon 
                coordinates={measurePoints}
                strokeColor={Colors.secondary}
                strokeWidth={2}
                fillColor="transparent"
             />
        )}
      </MapView>

      {/* Layer Control */}
      <View style={styles.layerControl}>
        {(['standard', 'satellite', 'hybrid'] as MapLayer[]).map((type) => (
             <Pressable 
                key={type} 
                onPress={() => setMapType(type)}
                style={[styles.layerButton, mapType === type && styles.layerButtonActive]}
            >
                <MaterialIcons 
                    name={type === 'standard' ? 'map' : type === 'satellite' ? 'satellite' : 'layers'} 
                    size={20} 
                    color={mapType === type ? Colors.white : Colors.textPrimary} 
                />
            </Pressable>
        ))}
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <Pressable 
            onPress={toggleMeasureTool}
            style={[styles.toolButton, isMeasuring && styles.toolButtonActive]}
        >
            <FontAwesome5 name="ruler-combined" size={20} color={isMeasuring ? Colors.white : Colors.textPrimary} />
            <Text style={[styles.toolLabel, isMeasuring && {color: Colors.white}]}>Measure</Text>
        </Pressable>
        
        <Pressable 
            onPress={() => {
                if(userLocation && mapRef.current) {
                    mapRef.current.animateToRegion({
                        latitude: userLocation.coords.latitude,
                        longitude: userLocation.coords.longitude,
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                    });
                }
            }}
            style={styles.toolButton}
        >
            <MaterialIcons name="my-location" size={22} color={Colors.textPrimary} />
            <Text style={styles.toolLabel}>Locate Me</Text>
        </Pressable>
      </View>

      {/* Measure Info Overlay */}
      {isMeasuring && (
        <View style={styles.measureInfo}>
            <Text style={styles.measureText}>Distance: {measureDistance.toFixed(2)} m</Text>
            <Text style={styles.measureHint}>Tap points to measure</Text>
            {measurePoints.length > 0 && (
                 <Pressable onPress={() => { setMeasurePoints([]); setMeasureDistance(0); }}>
                    <Text style={styles.clearText}>Clear</Text>
                 </Pressable>
            )}
        </View>
      )}

      {/* Load status */}
      {!isMeasuring && (loading || loadError || parcels.length === 0) && (
        <View style={styles.statusBanner}>
          <Text style={styles.statusText}>
            {loading
              ? 'Loading registered parcels...'
              : loadError
                ? `Could not load parcels: ${loadError}`
                : 'No parcels with mapped boundaries yet.'}
          </Text>
        </View>
      )}

      {/* Parcel Detail Modal */}
      {selectedParcel && (
        <View style={styles.parcelCard}>
            <View style={styles.parcelHeader}>
                <Text style={styles.parcelTitle}>Parcel Details</Text>
                <Pressable onPress={() => setSelectedParcel(null)}>
                    <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
                </Pressable>
            </View>
            <View style={styles.parcelRow}>
                <Text style={styles.parcelLabel}>UPI:</Text>
                <Text style={styles.parcelValue}>{selectedParcel.upi}</Text>
            </View>
            <View style={styles.parcelRow}>
                <Text style={styles.parcelLabel}>Owner:</Text>
                <Text style={styles.parcelValue}>{selectedParcel.ownerName}</Text>
            </View>
            <View style={styles.parcelRow}>
                <Text style={styles.parcelLabel}>Area:</Text>
                <Text style={styles.parcelValue}>{selectedParcel.area} sqm</Text>
            </View>
            <View style={styles.parcelRow}>
                <Text style={styles.parcelLabel}>Use:</Text>
                <Text style={styles.parcelValue}>{selectedParcel.landUse}</Text>
            </View>
            <View style={styles.parcelRow}>
                <Text style={styles.parcelLabel}>Value:</Text>
                <Text style={styles.parcelValueHighlight}>{selectedParcel.value.toLocaleString()} RWF</Text>
            </View>
            <View style={styles.parcelActions}>
                <Pressable onPress={() => onNavigate('parcel-details', { parcel: rawParcels[selectedParcel.upi] })} style={styles.detailsButton}>
                    <Text style={styles.detailsButtonText}>View Full Details</Text>
                </Pressable>
            </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.6)', // Semi-transparent overlay style header
    padding: 12,
    borderRadius: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  exportButton: {
    padding: 4,
  },
  map: {
    width: width,
    height: height,
  },
  layerControl: {
    position: 'absolute',
    top: 130,
    right: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 6,
    gap: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  layerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  layerButtonActive: {
    backgroundColor: Colors.primary,
  },
  toolbar: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20, // Avoid overlapping with potential Google logo
    flexDirection: 'row',
    justifyContent: 'center', // Center tools
    gap: 20,
  },
  toolButton: {
    backgroundColor: Colors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  toolButtonActive: {
    backgroundColor: Colors.secondary,
  },
  toolLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  statusBanner: {
    position: 'absolute',
    top: 130,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.75)',
    padding: 12,
    borderRadius: 12,
  },
  statusText: {
    color: Colors.white,
    fontSize: 13,
    textAlign: 'center',
  },
  measureInfo: {
    position: 'absolute',
    top: 130,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 16,
    borderRadius: 12,
  },
  measureText: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  measureHint: {
    color: '#ccc',
    fontSize: 12,
  },
  clearText: {
      color: Colors.error,
      fontWeight: 'bold',
      marginTop: 8,
  },
  measureDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: Colors.secondary,
      borderWidth: 2,
      borderColor: Colors.white,
  },
  parcelCard: {
    position: 'absolute',
    bottom: 100, // Above toolbar
    left: 20,
    right: 20,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  parcelHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingBottom: 8,
  },
  parcelTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.primary,
  },
  parcelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
  },
  parcelLabel: {
      color: Colors.textSecondary,
      fontSize: 14,
  },
  parcelValue: {
      color: Colors.textPrimary,
      fontWeight: '600',
      fontSize: 14,
  },
  parcelValueHighlight: {
      color: Colors.primary,
      fontWeight: 'bold',
      fontSize: 14,
  },
  parcelActions: {
      marginTop: 12,
  },
  detailsButton: {
      backgroundColor: Colors.primary,
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
  },
  detailsButtonText: {
      color: Colors.white,
      fontWeight: 'bold',
  },
});

export default LandMapScreen;
