import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Logo from '@/components/Logo'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'boring qrs – Free QR Code Generator | No Login Required',
  description:
    'Generate stunning QR codes for free – no login, no signup required. Create artistic QR codes with images, stylish custom QR codes, and professional designs. 100% browser-based, privacy-first QR generator.',
  keywords: [
    'free qr code generator',
    'qr code generator free',
    'no login qr code',
    'artistic qr code',
    'boring qrs',
    'stylish qr code',
    'image qr code',
    'custom qr code free',
    'qr code with photo',
    'qr code maker',
    'creative qr code',
    'branded qr code',
    'qr generator online free',
    'no signup qr code',
    'privacy qr generator',
    'offline qr generator',
    'picture qr code',
    'logo qr code',
    'marketing qr code',
    'business qr code',
  ],
  authors: [{ name: 'boring qrs' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'rRaMvqgh5PSkT8U2CyB6yei10HOR1w72ZAdzfV-Qy00',
    other: {
      'msvalidate.01': '21E28FB368E213F77AF703A03C31A04E', // Bing verification
    },
  },
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/favicon.png',
    },
  ],
  openGraph: {
    title: 'boring qrs – Free Artistic QR Code Generator',
    description: 'Create beautiful, scannable QR codes for free. No login required. Generate artistic image-based QR codes instantly.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'boring qrs – Free QR Code Generator',
    description: 'Create beautiful, scannable QR codes for free. No login required.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="antialiased bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500">
        <div className="min-h-screen flex flex-col">
          <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  {/* Logo - will show when you upload logo.png to /public folder */}
                  <Logo />
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white tracking-tight">
                      boring qrs
                    </h1>
                    <p className="text-xs sm:text-sm text-white/90 mt-0.5 sm:mt-1">
                      Free QR generator • No login required
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex gap-2 text-xs sm:text-sm text-white/80">
                  <span className="bg-white/20 px-3 py-1.5 rounded-full font-medium">100% Free</span>
                  <span className="bg-white/20 px-3 py-1.5 rounded-full font-medium">Privacy-First</span>
                </div>
              </div>
            </div>
          </header>
          
          <main className="flex-1">
            {children}
          </main>
          
          <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <p className="text-center text-xs sm:text-sm text-white/80">
                 {new Date().getFullYear()} boring qrs • All QR codes generated securely in your browser
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
