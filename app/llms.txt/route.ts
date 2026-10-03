import { pages } from '@/lib/content'
import { siteUrl } from '@/lib/site'
export const dynamic = 'force-static'
export function GET() {
  const text = `# boring qrs\n\n> Free browser-based photo QR generator. Blend an existing image into a QR pattern, then export PNG. No account required. Not a prompt-based AI image generator.\n\n## Pages\n- [Generator](${siteUrl}/): Create a QR code from text or a link and an optional photo.\n- [About](${siteUrl}/about): Product and creator.\n${pages.map(p => `- [${p.heading}](${siteUrl}/${p.slug}): ${p.description}`).join('\n')}\n\n## Notes\nUploaded images are processed locally. Optional random images use external providers. Scan testing is required; exported destinations are fixed.\n`
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
