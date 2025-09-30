import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import {
  validateEmail,
  validatePhone,
  validateName,
  validateYear,
  validateLicensePlate,
  validateRequired,
} from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate all fields
    const errors: Record<string, string> = {}

    const firstNameError = validateName(body.firstName, "First name")
    if (firstNameError) errors.firstName = firstNameError

    const lastNameError = validateName(body.lastName, "Last name")
    if (lastNameError) errors.lastName = lastNameError

    const emailError = validateEmail(body.email)
    if (emailError) errors.email = emailError

    const phoneError = validatePhone(body.phone)
    if (phoneError) errors.phone = phoneError

    const makeError = validateRequired(body.make, "Make")
    if (makeError) errors.make = makeError

    const modelError = validateRequired(body.model, "Model")
    if (modelError) errors.model = modelError

    const yearError = validateYear(body.year)
    if (yearError) errors.year = yearError

    const plateError = validateLicensePlate(body.licensePlate)
    if (plateError) errors.licensePlate = plateError

    const serviceError = validateRequired(body.serviceType, "Service type")
    if (serviceError) errors.serviceType = serviceError

    if (!body.date) errors.date = "Date is required"
    if (!body.time) errors.time = "Time is required"

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ error: "Validation failed", errors }, { status: 400 })
    }

    // Connect to MongoDB
    const client = await clientPromise
    const db = client.db("car_repair_booking")

    // Create booking document
    const booking = {
      customer: {
        firstName: body.firstName.trim(),
        lastName: body.lastName.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
      },
      vehicle: {
        make: body.make.trim(),
        model: body.model.trim(),
        year: body.year.trim(),
        licensePlate: body.licensePlate.trim().toUpperCase(),
      },
      service: {
        type: body.serviceType,
        date: new Date(body.date),
        time: body.time,
        notes: body.notes?.trim() || "",
      },
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Insert booking into database
    const result = await db.collection("bookings").insertOne(booking)

    return NextResponse.json(
      {
        success: true,
        bookingId: result.insertedId,
        message: "Booking created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Booking API error:", error)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db("car_repair_booking")

    // Get all bookings, sorted by date (newest first)
    const bookings = await db.collection("bookings").find({}).sort({ createdAt: -1 }).limit(100).toArray()

    return NextResponse.json({ bookings }, { status: 200 })
  } catch (error) {
    console.error("[v0] Fetch bookings error:", error)
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 })
  }
}
