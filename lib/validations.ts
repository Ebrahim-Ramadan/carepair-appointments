export interface ValidationError {
  field: string
  message: string
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.trim()) {
    return "Email is required"
  }
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address"
  }
  return null
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

export function validateYear(year: string): string | null {
  const currentYear = new Date().getFullYear()
  const yearNum = Number.parseInt(year, 10)

  if (!year.trim()) {
    return "Year is required"
  }
  if (isNaN(yearNum)) {
    return "Year must be a number"
  }
  if (yearNum < 1900) {
    return "Year must be 1900 or later"
  }
  if (yearNum > currentYear + 1) {
    return `Year cannot be later than ${currentYear + 1}`
  }
  return null
}

export function validateLicensePlate(plate: string): string | null {
  if (!plate.trim()) {
    return "License plate is required"
  }
  if (plate.trim().length < 2) {
    return "License plate must be at least 2 characters"
  }
  if (plate.trim().length > 10) {
    return "License plate must be less than 10 characters"
  }
  if (!/^[a-zA-Z0-9\s-]+$/.test(plate)) {
    return "License plate can only contain letters, numbers, spaces, and hyphens"
  }
  return null
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value || !value.trim()) {
    return `${fieldName} is required`
  }
  return null
}
