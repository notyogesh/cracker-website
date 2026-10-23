import type { Metadata } from 'next'
import Link from 'next/link'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { BuyOnWhatsApp } from '@/components/BuyOnWhatsApp'
import { QuantityInput } from '@/components/cart/QuantityInput'
import { toCartProduct } from '@/components/ProductCard'
import { LineTotal } from './LineTotal'
import { discountPercent, formatINR } from '@/lib/format'
import { categoryOf, getCategories, getProducts } from '@/lib/payload'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Crackers Price List 2026 – Sivakasi Wholesale Rates',
  description:
    'Full Sivakasi crackers price list for Diwali 2026 with MRP, discount and net price. Enter quantities and send your estimate in one step.',
  alternates: { canonical: '/price-list' },
}

export default async function PriceListPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])
  const grouped = categories
    .map((c) => ({ category: c, items: products.filter((p) => categoryOf(p)?.id === c.id) }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs items={[{ name: 'Price list', href: '/price-list' }]} />
      <h1 className="text-3xl font-extrabold text-brand-800">Crackers price list 2026</h1>
      <p className="mt-2 max-w-3xl text-muted">
        Enter a quantity next to each item. Your total updates at the bottom of the screen, then send it as an
        estimate.
      </p>

      <nav aria-label="Jump to category" className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {grouped.map(({ category }) => (
          <a
            key={category.id}
            href={`#${category.slug}`}
            className="shrink-0 rounded-full border border-brand-200 bg-white px-3 py-1 text-sm hover:border-brand-500 hover:text-brand-700"
          >
            {category.name}
          </a>
        ))}
      </nav>

      <div className="mt-4 space-y-8">
        {grouped.map(({ category, items }) => (
          <section key={category.id} id={category.slug!} aria-labelledby={`h-${category.slug}`}>
            <h2 id={`h-${category.slug}`} className="rounded-t-lg bg-brand-600 px-4 py-2 text-lg font-bold text-white">
              <Link href={`/category/${category.slug}`} className="hover:underline">{category.name}</Link>
            </h2>
            <div className="overflow-x-auto rounded-b-lg border border-t-0 border-brand-100 bg-white">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="bg-brand-50 text-left text-xs uppercase text-muted">
                  <tr>
                    <th scope="col" className="px-3 py-2">Product</th>
                    <th scope="col" className="px-3 py-2">Content</th>
                    <th scope="col" className="px-3 py-2 text-right">MRP</th>
                    <th scope="col" className="px-3 py-2 text-right">Price</th>
                    <th scope="col" className="px-3 py-2 text-center">Qty</th>
                    <th scope="col" className="px-3 py-2 text-right">Total</th>
                    <th scope="col" className="px-3 py-2 text-center">Buy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-50">
                  {items.map((p) => (
                    <tr key={p.id} className={p.inStock ? '' : 'opacity-60'}>
                      <th scope="row" className="px-3 py-2 text-left font-medium">
                        <Link href={`/product/${p.slug}`} className="hover:text-brand-700">{p.name}</Link>
                        {discountPercent(p.mrp, p.price) > 0 && (
                          <span className="ml-2 text-xs font-semibold text-sale-500">
                            {discountPercent(p.mrp, p.price)}% off
                          </span>
                        )}
                      </th>
                      <td className="px-3 py-2 text-muted">{p.unit}</td>
                      <td className="px-3 py-2 text-right text-muted line-through">{formatINR(p.mrp)}</td>
                      <td className="px-3 py-2 text-right font-semibold">{formatINR(p.price)}</td>
                      <td className="px-3 py-2 text-center">
                        <QuantityInput product={toCartProduct(p)} disabled={!p.inStock} size="sm" />
                      </td>
                      <td className="px-3 py-2 text-right font-semibold">
                        <LineTotal id={p.id} price={p.price} />
                      </td>
                      <td className="px-3 py-2 text-center">
                        {p.inStock && <BuyOnWhatsApp product={p} size="icon" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
