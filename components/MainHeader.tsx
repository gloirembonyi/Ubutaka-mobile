import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, getColorWithOpacity } from '../styles/colors';
import { User } from '../types';

interface MainHeaderProps {
  user: User | null;
  onLanguageToggle?: () => void;
  onNotificationPress?: () => void;
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?background=0D8ABC&color=fff&bold=true&name=';

const MainHeader: React.FC<MainHeaderProps> = ({ 
  user, 
  onBack, 
  showBack, 
  title 
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        {showBack ? (
          <Pressable onPress={onBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back-ios" size={20} color={Colors.textPrimary} />
          </Pressable>
        ) : (
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: user?.avatar || `${DEFAULT_AVATAR}${encodeURIComponent(user?.name || 'User')}` }} 
                style={styles.avatar} 
              />
              {user?.isVerified && (
                <View style={styles.verifiedBadge}>
                  <MaterialIcons name="check" size={10} color={Colors.white} />
                </View>
              )}
            </View>
            <View style={styles.userText}>
              <Text style={styles.greeting}>MURAHO,</Text>
              <Text style={styles.userName} numberOfLines={1}>{user?.name || 'Guest'}</Text>
            </View>
          </View>
        )}
      </View>

      {title && !showBack && (
        <View style={styles.center}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
      )}

      <View style={styles.right}>
        <View style={styles.langContainer}>
          <Text style={styles.langTextActive}>RW</Text>
          <View style={styles.langDivider} />
          <Text style={styles.langText}>EN</Text>
        </View>
        <Pressable style={styles.globeButton}>
          <MaterialIcons name="language" size={20} color={Colors.primary} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: Colors.white,
    zIndex: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.border,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    padding: 2,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  userText: {
    flexDirection: 'column',
  },
  greeting: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.textTertiary,
    letterSpacing: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
    lineHeight: 22,
    maxWidth: 150,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  langContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  langText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textTertiary,
  },
  langTextActive: {
    fontSize: 10,
    fontWeight: '900',
    color: Colors.textPrimary,
  },
  langDivider: {
    width: 1,
    height: 10,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  globeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: getColorWithOpacity(Colors.primary, 0.05),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainHeader;
