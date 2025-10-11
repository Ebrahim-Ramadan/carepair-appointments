import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Company Info Section */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.jpg"
                alt="NintyNine Logo"
                width={32}
                height={32}
                className="rounded object-contain dark:hidden"
              />
              <Image
                src="/dark-logo.jpg"
                alt="CarePair Logo"
                width={32}
                height={32}
                className="rounded object-contain hidden dark:block"
              />
              <span className="text-lg font-semibold text-foreground">NintyNine</span>
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Expert car service and maintenance you can trust.
            </p>
          </div>

          {/* Footer Info Image */}
          <div className="flex justify-center">
            <Image
              src="/footer with info.png"
              alt="Footer Information"
              width={300}
              height={150}
              className="object-contain"
            />
          </div>

          {/* QR Code Section */}
          {/* <div className="flex flex-col items-center space-y-4">
            <Image
              src="/footer with qrcode.png"
              alt="QR Code"
              width={150}
              height={150}
              className="object-contain"
            />
            <p className="text-xs text-muted-foreground text-center">
              Scan for quick booking
            </p>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} NintyNine. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}