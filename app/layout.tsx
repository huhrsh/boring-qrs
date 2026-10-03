import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Logo from '@/components/Logo'
import Link from 'next/link'
import { siteUrl } from '@/lib/site'

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
  authors: [{ name: 'Harsh Jain', url: 'https://the-portify.vercel.app/huhrsh' }],
  metadataBase: new URL(siteUrl),
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
        <a href="#main" className="sr-only focus:not-sr-only focus:block bg-white text-indigo-700 p-3">Skip to content</a>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                  {/* Logo - will show when you upload logo.png to /public folder */}
                  <Link href="/" aria-label="boring qrs homepage"><Logo /></Link>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-white tracking-tight">
                      boring qrs
                    </p>
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
          
          <main id="main" className="flex-1">
            {children}
          </main>
          
          <footer className="bg-black/20 border-t border-white/20 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid md:grid-cols-3 gap-8">
              <div><Link href="/" className="font-bold text-xl">boring qrs</Link><p className="mt-2 text-sm text-white/90">Photo QR codes, generated in your browser.</p><p className="mt-3 text-sm">Built by <a className="underline" href="https://the-portify.vercel.app/huhrsh">Harsh Jain</a> · <a className="underline" href="https://www.linkedin.com/in/huhrsh/">LinkedIn</a></p></div>
              <nav aria-label="Footer navigation" className="flex flex-col items-start gap-2 text-sm">
                <Link href="/qr-code-with-image">Image QR generator</Link><Link href="/portrait-qr-code">Portrait QR codes</Link><Link href="/landscape-qr-code">Landscape QR codes</Link><Link href="/guides">Guides</Link><Link href="/qr-print-size-calculator">Print size calculator</Link><Link href="/about">About</Link><Link href="/privacy">Privacy</Link>
              </nav>
              <div className="flex flex-col items-start gap-2 text-sm"><p className="font-bold">More things I’ve built</p><a href="https://the-daylo.vercel.app/">Daylo — habits and progress</a><a href="https://dosia.vercel.app/">Dosia — medicine stock and reminders</a><a href="https://fryly.vercel.app/">Fryly — shared plans and expenses</a><a href="https://the-portify.vercel.app/">Portify — personal portfolios</a></div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
