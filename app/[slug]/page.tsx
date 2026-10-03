import Link from 'next/link'
import { notFound } from 'next/navigation'
import JsonLd from '@/components/JsonLd'
import PrintSizeCalculator from '@/components/PrintSizeCalculator'
import { pages } from '@/lib/content'
import { creator, pageMetadata, siteUrl, updated } from '@/lib/site'

export const dynamicParams = false
export function generateStaticParams() { return pages.map(p => ({ slug: p.slug })) }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const page = pages.find(p => p.slug === params.slug)
  return page ? pageMetadata(`/${page.slug}`, page.title, page.description) : {}
}
export default function ContentPage({ params }: { params: { slug: string } }) {
  const page = pages.find(p => p.slug === params.slug)
  if (!page) notFound()
  const url = `${siteUrl}/${page.slug}`
  const graph: unknown[] = [creator, { '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'boring qrs', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: page.heading, item: url },
  ] }, { '@type': page.article ? 'Article' : 'WebPage', '@id': `${url}#page`, url, headline: page.heading, name: page.heading, description: page.description, ...(page.article ? { author: { '@id': `${siteUrl}/#creator` }, datePublished: updated, dateModified: updated, image: `${siteUrl}/og-image.png`, mainEntityOfPage: url } : {}) }]
  if (page.faqs) graph.push({ '@type': 'FAQPage', mainEntity: page.faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) })
  return <article className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
    <JsonLd data={{ '@context': 'https://schema.org', '@graph': graph }} />
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl text-gray-800">
      <nav aria-label="Breadcrumb" className="text-sm mb-6"><Link href="/" className="text-indigo-700 underline">boring qrs</Link> / {page.heading}</nav>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-5">{page.heading}</h1>
      <p className="text-lg leading-relaxed mb-6">{page.description}</p>
      {page.article && <p className="text-sm text-gray-600 mb-6">By <a href="https://the-portify.vercel.app/huhrsh" className="underline">Harsh Jain</a> · Updated <time dateTime={updated}>{updated}</time></p>}
      <Link href="/#generator" className="inline-block rounded-xl bg-indigo-700 text-white px-6 py-3 font-semibold mb-6">Create your photo QR code</Link>
      {page.slug === 'qr-print-size-calculator' && <PrintSizeCalculator />}
      {page.sections.map(([heading, body]) => <section key={heading} className="my-7"><h2 className="text-xl sm:text-2xl font-bold mb-3">{heading}</h2><p className="leading-relaxed">{body}</p></section>)}
      {page.faqs && <section className="my-8"><h2 className="text-2xl font-bold mb-4">Questions and answers</h2>{page.faqs.map(([q, a]) => <details key={q} className="border-b py-4"><summary className="font-semibold cursor-pointer">{q}</summary><p className="mt-3 leading-relaxed">{a}</p></details>)}</section>}
      <section className="mt-10 border-t pt-6"><h2 className="text-2xl font-bold mb-4">Keep exploring</h2><div className="grid sm:grid-cols-2 gap-3">{pages.filter(p => p.slug !== page.slug && p.slug !== 'privacy').map(p => <Link key={p.slug} href={`/${p.slug}`} className="text-indigo-700 underline p-2">{p.heading}</Link>)}</div></section>
    </div>
  </article>
}


