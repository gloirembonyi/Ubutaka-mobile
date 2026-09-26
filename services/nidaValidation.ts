/**
 * Client-side check of a Rwandan national ID (16 digits), mirroring the server rule so the user gets
 * immediate feedback: 1 (Rwandan citizen) · YYYY (birth year) · 7/8 (sex) · birth-order, issue and check digits.
 */
export interface NidaCheck {
  isValid: boolean;
  nationalId: string;
  birthYear?: number;
  sex?: 'Male' | 'Female';
  error?: string;
}

export function validateNationalId(raw: string): NidaCheck {
  const nationalId = String(raw || '').replace(/\s+/g, '');
  if (!/^\d{16}$/.test(nationalId)) return { isValid: false, nationalId, error: 'National ID must contain exactly 16 digits.' };
  if (nationalId[0] !== '1') return { isValid: false, nationalId, error: 'National ID must start with 1 (Rwandan citizen).' };
  const birthYear = Number(nationalId.slice(1, 5));
  if (birthYear < 1900 || birthYear > new Date().getFullYear() - 16) {
    return { isValid: false, nationalId, error: 'National ID contains an invalid year of birth.' };
  }
  if (nationalId[5] !== '7' && nationalId[5] !== '8') {
    return { isValid: false, nationalId, error: 'National ID contains an invalid sex digit.' };
  }
  return { isValid: true, nationalId, birthYear, sex: nationalId[5] === '8' ? 'Male' : 'Female' };
}
