import Link from 'next/link'
import QRGenerator from '@/components/QRGenerator'
import JsonLd from '@/components/JsonLd'
import { faqs, pages } from '@/lib/content'
import { creator, pageMetadata, siteUrl } from '@/lib/site'

export const metadata = pageMetadata('/', 'Free Image QR Code Generator — Photos & QR Art | boring qrs', 'Turn portraits, landscapes, and brand images into artistic QR codes. Free photo QR generator with color controls and PNG downloads. No login required.')
export default function HomePage() {
  return <>
    <JsonLd data={{ '@context': 'https://schema.org', '@graph': [
      creator,
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'boring qrs', url: siteUrl },
      { '@type': 'SoftwareApplication', '@id': `${siteUrl}/#app`, name: 'boring qrs', url: siteUrl, applicationCategory: 'DesignApplication', operatingSystem: 'Web browser', description: 'Free browser-based generator that blends uploaded photos into QR codes and exports PNG images.', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, creator: { '@id': `${siteUrl}/#creator` }, featureList: ['Photo QR blending', 'Color and grayscale modes', 'PNG download', 'No account required'] },
      { '@type': 'FAQPage', mainEntity: faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) },
    ] }} />
    <QRGenerator />
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 text-white">
      <h2 className="text-2xl font-bold mb-4">How to make an image QR code</h2>
      <ol className="grid md:grid-cols-3 gap-4 mb-10 list-decimal list-inside">
        <li className="rounded-2xl bg-white/10 p-5">Enter the link or text you want the code to read.</li>
        <li className="rounded-2xl bg-white/10 p-5">Upload a portrait, landscape, or brand photo and adjust the blend.</li>
        <li className="rounded-2xl bg-white/10 p-5">Download the PNG and scan it before sharing or printing.</li>
      </ol>
      <h2 className="text-2xl font-bold mb-4">Explore photo QR ideas and guides</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">{pages.filter(p => p.slug !== 'privacy').map(p => <Link key={p.slug} href={`/${p.slug}`} className="rounded-2xl bg-white/10 p-5 border border-white/20 hover:bg-white/20"><h3 className="font-bold mb-2">{p.heading}</h3><p className="text-sm text-white/90">{p.description}</p></Link>)}</div>
      <h2 className="text-2xl font-bold mb-4">Image QR code questions</h2>
      <div className="space-y-3">{faqs.map(([q, a]) => <details key={q} className="rounded-xl bg-white/10 p-5"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-3 leading-relaxed text-white/90">{a}</p></details>)}</div>
    </section>
  </>
}
