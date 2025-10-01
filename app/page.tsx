import { BookingForm } from "@/components/booking-form"
import Image from "next/image"

export default function Home() {
  return (
    <div className="bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center">
              <Image
                src="/logo.jpg"
                alt="CarePair Logo"
                width={40}
                height={40}
                className="rounded-lg object-contain dark:hidden"
              />
              <Image
                src="/dark-logo.jpg"
                alt="CarePair Logo"
                width={40}
                height={40}
                className="rounded-lg object-contain hidden dark:block"
              />
            </div>
            <span className="text-xl font-semibold text-foreground">CarePair</span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Services
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              About
            </a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Book Your Car Service
            </h1>
            <p className="text-pretty text-lg text-muted-foreground">
              Schedule your appointment in minutes. Expert service, trusted care.
            </p>
          </div>

          <BookingForm />
        </div>
      </main>
    </div>
  )
}
