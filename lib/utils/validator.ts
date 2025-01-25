/**
 * Validates a phone number to ensure it starts with '01' and contains exactly 11 digits.
 * @param phone - The phone number to validate.
 * @returns {boolean} - Returns true if the phone number is valid, false otherwise.
 */
export const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^01\d{9}$/; // Matches 11 digits starting with 01
    return phoneRegex.test(phone);
  };
  