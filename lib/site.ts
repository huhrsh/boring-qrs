import type { Metadata } from 'next'

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://boring-qrs.vercel.app').replace(/\/$/, '')
export const updated = '2026-10-03'
export const creator = { '@type': 'Person', '@id': `${siteUrl}/#creator`, name: 'Harsh Jain', url: 'https://the-portify.vercel.app/huhrsh', sameAs: ['https://www.linkedin.com/in/huhrsh/'] }

export function pageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title: { absolute: title }, description, alternates: { canonical: `${siteUrl}${path}` },
    openGraph: { title, description, url: `${siteUrl}${path}`, siteName: 'boring qrs', type: 'website', images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'boring qrs — photo and artistic QR code generator' }] },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
  }
}

