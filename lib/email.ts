import nodemailer from 'nodemailer'

// Email configuration - you'll need to set these environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface BookingEmailData {
  customerName: string
  customerEmail: string
  phone: string
  vehicle: {
    year: string
    make: string
    model: string
    licensePlate: string
  }
  service: {
    type: string
    date: string
    time: string
    notes?: string
  }
  bookingId: string
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  console.log('data:', data);
  
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: data.customerEmail,
      subject: 'Booking Confirmation - CarePair Auto Service',
      html: generateBookingConfirmationHTML(data),
      text: generateBookingConfirmationText(data),
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

function generateBookingConfirmationHTML(data: BookingEmailData): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2563eb;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f8fafc;
          padding: 30px;
          border: 1px solid #e2e8f0;
        }
        .booking-details {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border: 1px solid #e2e8f0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding-bottom: 10px;
          border-bottom: 1px solid #f1f5f9;
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .label {
          font-weight: bold;
          color: #475569;
        }
        .value {
          color: #1e293b;
        }
        .footer {
          background-color: #1e293b;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 0 0 8px 8px;
          font-size: 14px;
        }
        .success-icon {
          color: #10b981;
          font-size: 24px;
          margin-bottom: 10px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="success-icon">✓</div>
        <h1>Booking Confirmed!</h1>
        <p>Your appointment has been successfully scheduled</p>
      </div>
      
      <div class="content">
        <p>Dear ${data.customerName},</p>
        <p>Thank you for choosing CarePair Auto Service! Your appointment has been confirmed. Here are your booking details:</p>
        
        <div class="booking-details">
          <h3 style="margin-top: 0; color: #2563eb;">Booking Information</h3>
          <div class="detail-row">
            <span class="label">Booking ID:</span>
            <span class="value">${data.bookingId}</span>
          </div>
          <div class="detail-row">
            <span class="label">Customer:</span>
            <span class="value">${data.customerName}</span>
          </div>
          <div class="detail-row">
            <span class="label">Phone:</span>
            <span class="value">${data.phone}</span>
          </div>
          <div class="detail-row">
            <span class="label">Vehicle:</span>
            <span class="value">${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model}</span>
          </div>
          <div class="detail-row">
            <span class="label">License Plate:</span>
            <span class="value">${data.vehicle.licensePlate}</span>
          </div>
          <div class="detail-row">
            <span class="label">Service:</span>
            <span class="value">${data.service.type}</span>
          </div>
          <div class="detail-row">
            <span class="label">Date & Time:</span>
            <span class="value">${data.service.date} at ${data.service.time}</span>
          </div>
          ${data.service.notes ? `
          <div class="detail-row">
            <span class="label">Notes:</span>
            <span class="value">${data.service.notes}</span>
          </div>
          ` : ''}
        </div>
        
        <h3>What to Expect:</h3>
        <ul>
          <li>Please arrive 10 minutes before your scheduled time</li>
          <li>Bring your driver's license and vehicle registration</li>
          <li>Our team will contact you if any changes are needed</li>
          <li>You'll receive updates via phone and email</li>
        </ul>
        
        <p>If you need to reschedule or have any questions, please contact us as soon as possible.</p>
        
        <p>Thank you for choosing CarePair Auto Service!</p>
      </div>
      
      <div class="footer">
        <p><strong>CarePair Auto Service</strong></p>
        <p>Expert service, trusted care</p>
        <p>Contact us: info@carepair.com | (555) 123-4567</p>
      </div>
    </body>
    </html>
  `
}

function generateBookingConfirmationText(data: BookingEmailData): string {
  return `
BOOKING CONFIRMED - CarePair Auto Service

Dear ${data.customerName},

Thank you for choosing CarePair Auto Service! Your appointment has been confirmed.

BOOKING DETAILS:
- Booking ID: ${data.bookingId}
- Customer: ${data.customerName}
- Phone: ${data.phone}
- Vehicle: ${data.vehicle.year} ${data.vehicle.make} ${data.vehicle.model}
- License Plate: ${data.vehicle.licensePlate}
- Service: ${data.service.type}
- Date & Time: ${data.service.date} at ${data.service.time}
${data.service.notes ? `- Notes: ${data.service.notes}` : ''}

WHAT TO EXPECT:
• Please arrive 10 minutes before your scheduled time
• Bring your driver's license and vehicle registration
• Our team will contact you if any changes are needed
• You'll receive updates via phone and email

If you need to reschedule or have any questions, please contact us as soon as possible.

Thank you for choosing CarePair Auto Service!

---
CarePair Auto Service
Expert service, trusted care
Contact us: info@carepair.com | (555) 123-4567
  `.trim()
}