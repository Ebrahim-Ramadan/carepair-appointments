export interface ValidationError {
  field: string
  message: string
}



export function validatePhone(phone: string): string | null {
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, "")

  if (!phone.trim()) {
    return "Phone number is required"
  }
  if (digitsOnly.length < 8) {
    return "Phone number must be at least 8 digits"
  }
  if (digitsOnly.length > 12) {
    return "Phone number is too long"
  }
  return null
}

export function validateName(name: string, fieldName: string): string | null {
  if (!name.trim()) {
    return `${fieldName} is required`
  }
  if (name.trim().length < 2) {
    return `${fieldName} must be at least 2 characters`
  }
  if (name.trim().length > 50) {
    return `${fieldName} must be less than 50 characters`
  }
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
  }
  return null
}
