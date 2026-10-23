import type { Metadata } from 'next'
import Link from 'next/link'

import { ProductCard } from '@/components/ProductCard'
import { getPayloadClient } from '@/lib/payload'
import type { Where } from 'payload'

export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
}

type Props = { searchParams: Promise<{ q?: string }> }

export default async function SearchPage({ searchParams }: Props) {
  const q = (await searchParams).q?.trim().slice(0, 80) ?? ''
  const words = q.split(/\s+/).filter((w) => w.length > 0)

  const payload = await getPayloadClient()
  // Every word must appear in the name, type or category.
  const results = words.length
    ? (
        await payload.find({
          collection: 'products',
          where: {
            and: words.map(
              (w): Where => ({
                or: [{ name: { like: w } }, { productType: { like: w } }, { 'category.name': { like: w } }],
              }),
            ),
          },
          sort: 'sortOrder',
          limit: 60,
          depth: 1,
        })
      ).docs
    : []

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold text-brand-800">{q ? `Results for “${q}”` : 'Search crackers'}</h1>
      {q && (
        <p className="mt-2 text-muted">
          {results.length === 0 ? 'No products found.' : `${results.length} product${results.length === 1 ? '' : 's'} found.`}
        </p>
      )}

      {results.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="mt-6 text-ink">
          Try a shorter word like “sparkler”, “shot” or “bomb”, or browse the{' '}
          <Link href="/price-list" className="font-semibold text-brand-600 hover:underline">full price list</Link>.
        </p>
      )}
    </div>
  )
}
