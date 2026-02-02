/**
 * Simple encryption utility for the Ubutaka project.
 * NOTE: In a production environment, use a robust library like CryptoJS or the Web Crypto API.
 * This is a demonstration of end-to-end encryption logic.
 */

const SECRET_KEY = "ubutaka-secure-key-2026";

/**
 * Encrypts a string using a simple XOR + Base64 approach
 */
export const encryptData = (data: string): string => {
  if (!data) return data;
  
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
  }
  
  try {
    // Portably convert to base64
    return btoa(result);
  } catch (e) {
    return result;
  }
};

/**
 * Decrypts a string
 */
export const decryptData = (encryptedData: string): string => {
  if (!encryptedData) return encryptedData;
  
  let data = encryptedData;
  try {
    data = atob(encryptedData);
  } catch (e) {
    // Not base64
  }
  
  let result = "";
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(data.charCodeAt(i) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length));
  }
  return result;
};

/**
 * Encrypts an entire object's sensitive fields
 */
export const encryptObject = (obj: any, fields: string[]): any => {
  const newObj = { ...obj };
  fields.forEach(field => {
    if (newObj[field]) {
      newObj[field] = encryptData(newObj[field]);
    }
  });
  return newObj;
};

/**
 * Decrypts an entire object's sensitive fields
 */
export const decryptObject = (obj: any, fields: string[]): any => {
  const newObj = { ...obj };
  fields.forEach(field => {
    if (newObj[field]) {
      newObj[field] = decryptData(newObj[field]);
    }
  });
  return newObj;
};
