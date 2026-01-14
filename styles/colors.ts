/**
 * Global Color System for Ubutaka Mobile App
 * Based on Figma design specifications
 */

export const Colors = {
  // Primary Colors
  primary: '#164734',        // Dark green - main brand color
  primaryLight: '#1f5a47',    // Lighter shade of primary
  primaryDark: '#0d2e1f',     // Darker shade of primary
  secondary: '#FEA603',       // Secondary brand color (Orange)
  
  // Secondary/Neutral Colors
  neutral: '#B8BCC5',         // Light gray - secondary color
  neutralLight: '#E5E7EB',   // Very light gray
  neutralDark: '#6B7280',    // Darker gray
  
  // Accent/Warning Colors
  accent: '#FEA603',          // Orange/yellow - accent/warning color
  accentLight: '#FFB84D',     // Lighter accent
  accentDark: '#CC8500',      // Darker accent
  
  // Base Colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Text Colors
  textPrimary: '#164734',     // Primary text (dark green)
  textSecondary: '#6B7280',    // Secondary text (gray)
  textTertiary: '#B8BCC5',    // Tertiary text (light gray)
  textWhite: '#FFFFFF',       // White text
  
  // Background Colors
  background: '#FFFFFF',      // Main background
  backgroundLight: '#F9FBFA', // Light background (from Figma)
  backgroundDark: '#1C2B29',  // Dark background (from Figma)
  
  // Surface Colors
  surface: '#FFFFFF',         // Card/surface background
  surfaceLight: '#F9FBFA',   // Light surface
  surfaceDark: '#243633',     // Dark surface
  
  // Border Colors
  border: '#E5E7EB',          // Default border
  borderLight: '#F3F4F6',     // Light border
  borderDark: '#B8BCC5',      // Dark border
  
  // Status Colors
  success: '#10B981',         // Success green
  error: '#EF4444',           // Error red
  warning: '#FEA603',         // Warning (same as accent)
  info: '#3B82F6',            // Info blue
  
  // Semantic Colors
  verified: '#164734',        // Verified badge (primary)
  notification: '#EF4444',   // Notification badge (red)
  
  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.1)',
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
} as const;

// Type for color keys
export type ColorKey = keyof typeof Colors;

// Helper function to get color with opacity
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Common color combinations
export const ColorCombinations = {
  primaryBackground: Colors.primary,
  primaryText: Colors.white,
  secondaryBackground: Colors.neutralLight,
  secondaryText: Colors.textPrimary,
  accentBackground: Colors.accent,
  accentText: Colors.white,
  surfaceBackground: Colors.surface,
  surfaceText: Colors.textPrimary,
} as const;
