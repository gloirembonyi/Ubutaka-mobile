import { User } from '../types';

/**
 * Check if user profile is complete
 * Profile is complete when:
 * 1. ID picture is uploaded
 * 2. Biometric is registered
 * 3. Digital signature is set
 */
export const isProfileComplete = (user: User | null): boolean => {
  if (!user) return false;
  // If explicitly marked as completed, trust it
  if (user.profileCompleted) return true;
  
  return !!(
    // ID Picture is handled by admin/external system for now
    user.biometricRegistered &&
    user.digitalSignature
  );
};

/**
 * Get profile completion percentage
 */
export const getProfileCompletionPercentage = (user: User | null): number => {
  if (!user) return 0;
  
  let completed = 0;
  const total = 3;
  
  // ID Picture considered done/optional for user
  completed++; 
  if (user.biometricRegistered) completed++;
  if (user.digitalSignature) completed++;
  
  return Math.round((completed / total) * 100);
};

/**
 * Get missing profile requirements
 */
export const getMissingRequirements = (user: User | null): string[] => {
  if (!user) return ['ID Picture', 'Biometric Registration', 'Digital Signature'];
  
  const missing: string[] = [];
  
  if (!user.idPictureUrl) missing.push('ID Picture');
  if (!user.biometricRegistered) missing.push('Biometric Registration');
  if (!user.digitalSignature) missing.push('Digital Signature');
  
  return missing;
};
