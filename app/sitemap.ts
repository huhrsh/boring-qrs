import type { MetadataRoute } from 'next'
import { pages } from '@/lib/content'
import { siteUrl, updated } from '@/lib/site'
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/about', ...pages.map(p => `/${p.slug}`)].map(path => ({ url: `${siteUrl}${path}`, lastModified: path === '/' ? '2026-10-04' : pages.find(p => '/' + p.slug === path)?.updated || updated }))
}
