import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
const read = path => readFileSync(path, 'utf8')
const origin = (process.env.NEXT_PUBLIC_SITE_URL || 'https://boring-qrs.vercel.app').replace(/\/$/, '')
const sitemap = read('.next/server/app/sitemap.xml.body')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
assert.equal(urls.length, 12, 'Expected all 12 public pages in sitemap')
assert.equal(new Set(urls).size, urls.length)
const paths = new Set(urls.map(url => new URL(url).pathname))
const titles = new Set(), descriptions = new Set()
for (const url of urls) {
  assert.ok(url.startsWith(origin + '/'), `Wrong origin: ${url}`)
  const path = new URL(url).pathname
  const html = read(join('.next/server/app', path === '/' ? 'index.html' : `${path.slice(1)}.html`))
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1]
  assert.ok(title && !titles.has(title), `Missing/duplicate title: ${path}`); titles.add(title)
  assert.ok(description && !descriptions.has(description), `Missing/duplicate description: ${path}`); descriptions.add(description)
  assert.equal(new URL(html.match(/rel="canonical" href="([^"]+)"/)?.[1]).href, new URL(url).href, `Canonical: ${path}`)
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `One H1: ${path}`)
  assert.ok(html.includes('name="robots" content="index, follow"'), `Indexable: ${path}`)
  assert.ok(html.includes('property="og:image"'), `Social image: ${path}`)
  assert.ok(html.includes('name="google-site-verification"'), `Verification: ${path}`)
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(match[1])
  for (const match of html.matchAll(/href="(\/[^"?#]*)/g)) {
    const href = match[1]
    assert.ok(paths.has(href) || href.startsWith('/_next/') || existsSync(join('public', href)), `Broken internal link: ${path} -> ${href}`)
  }
  for (const host of ['the-daylo.vercel.app', 'dosia.vercel.app', 'fryly.vercel.app', 'the-portify.vercel.app']) assert.ok(html.includes(`https://${host}/`), `Footer ${host}: ${path}`)
}
assert.ok(read('.next/server/app/robots.txt.body').includes(`${origin}/sitemap.xml`))
assert.ok(read('.next/server/app/llms.txt.body').includes(`${origin}/qr-code-with-image`))
assert.ok(!sitemap.includes('localhost'))
console.log(`SEO checks passed for ${urls.length} public pages: metadata, canonicals, headings, schema, footer, internal links, robots, sitemap, llms.`)

