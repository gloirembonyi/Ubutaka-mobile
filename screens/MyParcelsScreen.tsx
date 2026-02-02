import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Screen, Parcel, User } from "../types";
import { API_ENDPOINTS } from "../config/api";
import { Colors, getColorWithOpacity } from "../styles/colors";
import { GlobalStyles } from "../styles/globalStyles";

interface MyParcelsScreenProps {
  onNavigate: (screen: Screen, params?: any) => void;
  user?: User | null;
  navigation?: any; // For focus listener
}

const MyParcelsScreen: React.FC<MyParcelsScreenProps> = ({
  onNavigate,
  user,
}) => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data as fallback if API doesn't return or for demo
  const MOCK_PARCELS: Parcel[] = [
    {
      upi: "1/03/04/05/1230",
      size: "1200 sqm",
      use: "Residential (R1)",
      district: "Gasabo",
      location: "Kimironko",
      status: "registered",
      ownerName: user?.name || "MUGAKIHIRE Jean",
      imageUrl:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      price: "15,000,000 RWF",
    },
    {
      upi: "1/03/04/05/1231",
      size: "2500 sqm",
      use: "Agricultural",
      district: "Gasabo",
      location: "Bumbogo",
      status: "registered",
      ownerName: user?.name || "MUGAKIHIRE Jean",
      imageUrl:
        "https://images.unsplash.com/photo-1500076656116-558758c991c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
      price: "8,000,000 RWF",
    },
  ];

  useEffect(() => {
    fetchParcels();
    
    const interval = setInterval(() => {
      fetchParcels();
    }, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  // Refresh when user changes
  useEffect(() => {
    fetchParcels();
  }, [user?.name]);

  const fetchParcels = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const url = `${API_ENDPOINTS.PARCELS}?ownerName=${encodeURIComponent(user?.name || '')}`;
      console.log('Fetching parcels from:', url);
      const resp = await fetch(url);
      if (resp.ok) {
         const data = await resp.json();
         console.log('Fetched parcels:', data.length);
         setParcels(data.length > 0 ? data : MOCK_PARCELS);
      } else {
        console.error('Failed to fetch parcels:', resp.status);
        setParcels(MOCK_PARCELS);
      }
    } catch (err) {
      console.error("Fetch parcels error:", err);
      setParcels(MOCK_PARCELS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchParcels(true);
  };

  return (
    <View style={GlobalStyles.container}>
      <View style={styles.header}>
        <Pressable
          onPress={() => onNavigate("dashboard")}
          style={styles.backButton}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.textPrimary}
          />
        </Pressable>
        <Text style={styles.headerTitle}>My Land Parcels</Text>
        <Pressable 
          onPress={() => onNavigate("register-land")}
          style={styles.headerButton}
        >
          <MaterialIcons name="add" size={24} color={Colors.primary} />
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading your holdings...</Text>
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {parcels.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name="landscape"
                size={64}
                color={Colors.textTertiary}
              />
              <Text style={styles.emptyText}>
                You have no registered parcels yet.
              </Text>
              <Pressable
                style={styles.emptyButton}
                onPress={() => onNavigate("register-land")}
              >
                <Text style={styles.emptyButtonText}>Register Land</Text>
              </Pressable>
            </View>
          ) : (
            parcels.map((parcel: Parcel, index: number) => (
              <Pressable
                key={parcel.upi || index}
                style={({ pressed }: { pressed: boolean }) => [
                  styles.parcelCard,
                  pressed && GlobalStyles.pressed,
                ]}
                onPress={() => onNavigate("parcel-details", { parcel })}
              >
                <Image
                  source={{ uri: parcel.imageUrl || "https://images.unsplash.com/photo-1541888941255-2200230234ed?w=800" }}
                  style={styles.parcelImage}
                />
                <View style={styles.parcelInfo}>
                  <View style={styles.parcelHeader}>
                    <Text style={styles.parcelUpi} numberOfLines={1}>UPI: {parcel.upi}</Text>
                    <MaterialIcons
                      name={parcel.status === 'Verified' ? "verified" : "hourglass-top"}
                      size={16}
                      color={parcel.status === 'Verified' ? Colors.success : Colors.accent}
                    />
                  </View>
                  <Text style={styles.parcelDistrict}>
                    {parcel.district}, {parcel.location}
                  </Text>

                  <View style={styles.parcelDetails}>
                    <View style={styles.detailItem}>
                      <MaterialIcons
                        name="layers"
                        size={14}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.detailText}>{parcel.use}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <MaterialIcons
                        name="square-foot"
                        size={14}
                        color={Colors.textSecondary}
                      />
                      <Text style={styles.detailText}>{parcel.size}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.actionsContainer}>
                  <Pressable 
                    style={styles.sellButton}
                    onPress={() => onNavigate("sell-land")}
                  >
                    <Text style={styles.sellButtonText}>Sell</Text>
                  </Pressable>
                  <MaterialIcons
                    name="chevron-right"
                    size={24}
                    color={Colors.textTertiary}
                  />
                </View>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: Colors.textPrimary },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 160,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  emptyButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: Colors.white,
    fontWeight: "bold",
  },
  parcelCard: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.borderLight,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
    paddingRight: 12,
  },
  parcelImage: {
    width: 100,
    height: 100,
  },
  parcelInfo: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  parcelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  parcelUpi: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  parcelDistrict: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  parcelDetails: {
    flexDirection: "row",
    gap: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 11,
    color: Colors.textTertiary,
    fontWeight: "500",
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sellButtonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  arrowContainer: {
    width: 24,
    alignItems: "center",
  },
});

export default MyParcelsScreen;
