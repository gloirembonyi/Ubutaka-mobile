
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

  // Mock validation logic
  if (!nationalId || nationalId.length !== 16) {
    return {
      isValid: false,
      error: 'Invalid National ID format. Must be 16 digits.'
    };
  }

  // Pre-defined mock data for testing
  // ID starting with 11990... is considered valid
  if (nationalId.startsWith('11990')) {
    return {
      isValid: true,
      data: {
        nationalId,
        names: 'MUGABO Jean Pierre',
        dob: '01/01/1990',
        gender: 'M',
        photo: 'https://avatar.iran.liara.run/public/boy', // Placeholder avatar
        placeOfIssue: 'KIGALI',
      }
    };
  }

  return {
    isValid: false,
    error: 'National ID not found in NIDA database.'
  };
};
