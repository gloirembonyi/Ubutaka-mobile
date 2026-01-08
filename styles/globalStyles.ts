/**
 * Global Styles for Ubutaka Mobile App
 * Reusable style definitions
 */

import { StyleSheet } from 'react-native';
import { Colors } from './colors';

export const GlobalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  containerLight: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  
  // Safe Area
  safeArea: {
    flex: 1,
  },
  
  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  
  // Card Styles
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardLarge: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  
  // Button Styles
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    backgroundColor: Colors.neutralLight,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonAccent: {
    backgroundColor: Colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  buttonTextPrimary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  
  // Text Styles
  textHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  textSubheading: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  textBody: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  textBodySecondary: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  textCaption: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  textSmall: {
    fontSize: 10,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  // Input Styles
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  
  // Section Styles
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  // Badge Styles
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgePrimary: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeAccent: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colors.white,
    textTransform: 'uppercase',
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  
  // Spacing
  spacingSmall: {
    marginVertical: 8,
  },
  spacingMedium: {
    marginVertical: 16,
  },
  spacingLarge: {
    marginVertical: 24,
  },
  
  // Pressed State
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  
  // Row/Column
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
