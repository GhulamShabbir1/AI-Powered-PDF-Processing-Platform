export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*\-_=+]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one symbol (!@#$%^&*-_=+)' };
  }
  return { valid: true };
}

export function validateRequired(value: string, fieldName: string): { valid: boolean; error?: string } {
  if (!value || value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true };
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): { valid: boolean; error?: string } {
  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }
  return { valid: true };
}

export function validateFile(file: File): { valid: boolean; error?: string } {
  // Allow PDF and Image formats
  const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Only PDF, PNG, and JPG/JPEG files are allowed.' };
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File size exceeds the 50MB limit.' };
  }

  return { valid: true };
}