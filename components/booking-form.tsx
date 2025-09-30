"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  validateEmail,
  validatePhone,
  validateName,
  validateYear,
  validateLicensePlate,
  validateRequired,
} from "@/lib/validations"

interface BookingData {
  // Customer Info
  firstName: string
  lastName: string
  email: string
  phone: string

  // Vehicle Info
  make: string
  model: string
  year: string
  licensePlate: string

  // Service Info
  serviceType: string
  date: Date | undefined
  time: string
  notes: string
}

interface ValidationErrors {
  [key: string]: string
}

const SERVICE_TYPES = [
  "Oil Change",
  "Brake Service",
  "Tire Rotation",
  "Engine Diagnostics",
  "Transmission Service",
  "Air Conditioning",
  "Battery Replacement",
  "General Inspection",
  "Other",
]

const TIME_SLOTS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
]

export function BookingForm() {
  const [step, setStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [bookingData, setBookingData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    make: "",
    model: "",
    year: "",
    licensePlate: "",
    serviceType: "",
    date: undefined,
    time: "",
    notes: "",
  })

  const updateField = (field: keyof BookingData, value: string | Date | undefined) => {
    setBookingData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep1 = (): boolean => {
    const newErrors: ValidationErrors = {}

    const firstNameError = validateName(bookingData.firstName, "First name")
    if (firstNameError) newErrors.firstName = firstNameError

    const lastNameError = validateName(bookingData.lastName, "Last name")
    if (lastNameError) newErrors.lastName = lastNameError

    const emailError = validateEmail(bookingData.email)
    if (emailError) newErrors.email = emailError

    const phoneError = validatePhone(bookingData.phone)
    if (phoneError) newErrors.phone = phoneError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: ValidationErrors = {}

    const makeError = validateRequired(bookingData.make, "Make")
    if (makeError) newErrors.make = makeError

    const modelError = validateRequired(bookingData.model, "Model")
    if (modelError) newErrors.model = modelError

    const yearError = validateYear(bookingData.year)
    if (yearError) newErrors.year = yearError

    const plateError = validateLicensePlate(bookingData.licensePlate)
    if (plateError) newErrors.licensePlate = plateError

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = (): boolean => {
    const newErrors: ValidationErrors = {}

    if (!bookingData.serviceType) {
      newErrors.serviceType = "Service type is required"
    }

    if (!bookingData.date) {
      newErrors.date = "Date is required"
    }

    if (!bookingData.time) {
      newErrors.time = "Time is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinueStep1 = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleContinueStep2 = () => {
    if (validateStep2()) {
      setStep(3)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep3()) {
      return
    }

    setIsLoading(true)
    setSubmitError(null)

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bookingData,
          date: bookingData.date?.toISOString(),
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create booking")
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("[v0] Booking submission error:", error)
      setSubmitError(error instanceof Error ? error.message : "Failed to create booking. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setBookingData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      make: "",
      model: "",
      year: "",
      licensePlate: "",
      serviceType: "",
      date: undefined,
      time: "",
      notes: "",
    })
    setStep(1)
    setIsSubmitted(false)
    setErrors({})
    setSubmitError(null)
  }

  if (isSubmitted) {
    return (
      <Card className="border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Check className="h-8 w-8 text-primary-foreground" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">Appointment Confirmed!</h2>
          <p className="mb-8 text-center text-muted-foreground">
            {"We've received your booking request. A confirmation email has been sent to"}{" "}
            <span className="font-medium text-foreground">{bookingData.email}</span>
          </p>

          <div className="w-full max-w-md space-y-4 rounded-lg bg-muted p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-foreground">Customer</p>
                <p className="text-muted-foreground">
                  {bookingData.firstName} {bookingData.lastName}
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">Phone</p>
                <p className="text-muted-foreground">{bookingData.phone}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Vehicle</p>
                <p className="text-muted-foreground">
                  {bookingData.year} {bookingData.make} {bookingData.model}
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">License Plate</p>
                <p className="text-muted-foreground">{bookingData.licensePlate}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Service</p>
                <p className="text-muted-foreground">{bookingData.serviceType}</p>
              </div>
              <div>
                <p className="font-medium text-foreground">Date & Time</p>
                <p className="text-muted-foreground">
                  {bookingData.date && format(bookingData.date, "MMM dd, yyyy")} at {bookingData.time}
                </p>
              </div>
            </div>
            {bookingData.notes && (
              <div>
                <p className="font-medium text-foreground">Notes</p>
                <p className="text-sm text-muted-foreground">{bookingData.notes}</p>
              </div>
            )}
          </div>

          <Button onClick={handleReset} variant="outline" className="mt-8 bg-transparent">
            Book Another Appointment
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                step >= s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground",
              )}
            >
              {s}
            </div>
            {s < 3 && (
              <div className={cn("h-0.5 w-12 transition-colors md:w-24", step > s ? "bg-primary" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Customer Information */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                1
              </span>
              Customer Information
            </CardTitle>
            <CardDescription>{"Let's start with your contact details"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  value={bookingData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className={errors.firstName ? "border-destructive" : ""}
                />
                {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  value={bookingData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value)}
                  className={errors.lastName ? "border-destructive" : ""}
                />
                {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={bookingData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={bookingData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={handleContinueStep1}>Continue to Vehicle Info</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Vehicle Information */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                2
              </span>
              Vehicle Information
            </CardTitle>
            <CardDescription>Tell us about your vehicle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  placeholder="Toyota"
                  value={bookingData.make}
                  onChange={(e) => updateField("make", e.target.value)}
                  className={errors.make ? "border-destructive" : ""}
                />
                {errors.make && <p className="text-sm text-destructive">{errors.make}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="Camry"
                  value={bookingData.model}
                  onChange={(e) => updateField("model", e.target.value)}
                  className={errors.model ? "border-destructive" : ""}
                />
                {errors.model && <p className="text-sm text-destructive">{errors.model}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  placeholder="2020"
                  value={bookingData.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  className={errors.year ? "border-destructive" : ""}
                />
                {errors.year && <p className="text-sm text-destructive">{errors.year}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate</Label>
                <Input
                  id="licensePlate"
                  placeholder="ABC-1234"
                  value={bookingData.licensePlate}
                  onChange={(e) => updateField("licensePlate", e.target.value.toUpperCase())}
                  className={errors.licensePlate ? "border-destructive" : ""}
                />
                {errors.licensePlate && <p className="text-sm text-destructive">{errors.licensePlate}</p>}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button onClick={() => setStep(1)} variant="outline">
                Back
              </Button>
              <Button onClick={handleContinueStep2}>Continue to Service Details</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Service & Scheduling */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                3
              </span>
              Service & Scheduling
            </CardTitle>
            <CardDescription>Choose your service and preferred time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serviceType">Service Type</Label>
              <Select value={bookingData.serviceType} onValueChange={(value) => updateField("serviceType", value)}>
                <SelectTrigger id="serviceType" className={errors.serviceType ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.serviceType && <p className="text-sm text-destructive">{errors.serviceType}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Preferred Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !bookingData.date && "text-muted-foreground",
                        errors.date && "border-destructive",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bookingData.date ? format(bookingData.date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={bookingData.date}
                      onSelect={(date) => updateField("date", date)}
                      disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Preferred Time</Label>
                <Select value={bookingData.time} onValueChange={(value) => updateField("time", value)}>
                  <SelectTrigger id="time" className={errors.time ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select a time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific concerns or requests?"
                value={bookingData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                rows={4}
              />
            </div>

            {submitError && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{submitError}</div>
            )}

            <div className="flex justify-between pt-4">
              <Button onClick={() => setStep(2)} variant="outline" disabled={isLoading}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Confirm Appointment"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
