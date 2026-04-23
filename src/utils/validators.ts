// Email Validation
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (email.length > 254) {
    return { valid: false, error: 'Email is too long' };
  }

  return { valid: true };
}

// Password Validation (STRONG)
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Minimum 8 characters required' };
  }

  if (password.length > 64) {
    return { valid: false, error: 'Password is too long (max 64)' };
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'At least one uppercase letter required' };
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'At least one lowercase letter required' };
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'At least one number required' };
  }

  if (!/[!@#$%^&*()\-_=+[\]{};:'",.<>/?\\|]/.test(password)) {
    return { valid: false, error: 'At least one special character required' };
  }

  // Prevent spaces
  if (/\s/.test(password)) {
    return { valid: false, error: 'Password cannot contain spaces' };
  }

  return { valid: true };
}

// Required Field Validation
export function validateRequired(
  value: string,
  fieldName: string
): { valid: boolean; error?: string } {
  if (!value || value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` };
  }

  if (value.trim().length < 2) {
    return { valid: false, error: `${fieldName} is too short` };
  }

  return { valid: true };
}

// Confirm Password
export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): { valid: boolean; error?: string } {
  if (!confirmPassword) {
    return { valid: false, error: 'Confirm password is required' };
  }

  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }

  return { valid: true };
}

// File Validation (Enhanced)
export function validateFile(file: File): { valid: boolean; error?: string } {
  const ALLOWED_TYPES = [
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/jpg',
  ];

  const MAX_SIZE = 20 * 1024 * 1024; // 20MB
  const MIN_SIZE = 1 * 1024; // 1KB (avoid empty files)

  if (!file) {
    return { valid: false, error: 'File is required' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only PDF, PNG, JPG, JPEG allowed' };
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File exceeds 20MB limit' };
  }

  if (file.size < MIN_SIZE) {
    return { valid: false, error: 'File is too small or corrupted' };
  }

  // Optional: filename validation
  if (!/^[a-zA-Z0-9_\-. ]+$/.test(file.name)) {
    return { valid: false, error: 'Invalid file name' };
  }

  return { valid: true };
}
