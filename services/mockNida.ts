
interface NidaResponse {
  isValid: boolean;
  data?: {
    nationalId: string;
    names: string;
    dob: string;
    gender: 'M' | 'F';
    photo: string;
    placeOfIssue: string;
  };
  error?: string;
}

export const mockNidaVerification = async (nationalId: string): Promise<NidaResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Relaxed validation for testing: Allow any length
  if (!nationalId || nationalId.trim().length === 0) {
    return {
      isValid: false,
      error: 'Please enter a valid National ID.'
    };
  }

  // Any ID is now considered valid for testing
  return {
    isValid: true,
    data: {
      nationalId,
      names: 'Test User',
      dob: '01/01/1990',
      gender: 'M',
      photo: 'https://avatar.iran.liara.run/public/boy',
      placeOfIssue: 'KIGALI',
    }
  };
};
