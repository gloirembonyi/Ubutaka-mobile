/**
 * Simple encryption utility for the Ubutaka project (Backend).
 * Identical logic to mobile to ensure E2EE compatibility.
 */

const SECRET_KEY = process.env.ENCRYPTION_KEY || "ubutaka-secure-key-2026";

/**
 * Encrypts a string
 */
export const encryptData = (data: string): string => {
  if (!data) return data;
  
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
  }
  
  return Buffer.from(result).toString('base64');
};

/**
 * Decrypts a string
 */
export const decryptData = (encryptedData: string): string => {
  if (!encryptedData) return encryptedData;
  
  const data = Buffer.from(encryptedData, 'base64').toString('ascii');
  
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
  }
  return result;
};

/**
 * Encrypts an entire object's sensitive fields
 */
export const encryptObject = (obj: Record<string, unknown>, fields: string[]): Record<string, unknown> => {
  const newObj = { ...obj };
  fields.forEach(field => {
    if (newObj[field] && typeof newObj[field] === 'string') {
      newObj[field] = encryptData(newObj[field] as string);
    }
  });
  return newObj;
};

/**
 * Decrypts an entire object's sensitive fields
 */
export const decryptObject = (obj: Record<string, unknown>, fields: string[]): Record<string, unknown> => {
  const newObj = { ...obj };
  fields.forEach(field => {
    if (newObj[field] && typeof newObj[field] === 'string') {
      newObj[field] = decryptData(newObj[field] as string);
    }
  });
  return newObj;
};
