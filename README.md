# CarePair Appointments

A modern car service appointment booking system built with Next.js, MongoDB, and Nodemailer.

## Features

- **Multi-step booking form** with customer, vehicle, and service information
- **Email confirmations** sent automatically to customers
- **MongoDB integration** for storing appointments
- **Responsive design** with dark/light theme support
- **Form validation** with comprehensive error handling

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB database
- Email service (Gmail, Outlook, SendGrid, etc.)

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Configure your environment variables in `.env.local`:
```env
MONGODB_URI=your-mongodb-connection-string
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM="CarePair Auto Service <your-email@gmail.com>"
```

### Email Setup

For Gmail:
1. Enable 2-factor authentication
2. Generate an app password: Google Account → Security → App passwords
3. Use the app password as `SMTP_PASS`

For other providers, see `.env.example` for configuration examples.

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
