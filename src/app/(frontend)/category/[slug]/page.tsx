import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { ProductCard } from '@/components/ProductCard'
import { getCategories, getCategoryBySlug, getProducts } from '@/lib/payload'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ slug: c.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: `${category.name} – Buy Online from Sivakasi`,
    description:
      category.description ||
      `Buy ${category.name} online at wholesale prices direct from Sivakasi. See MRP, discount and order in minutes.`,
    alternates: { canonical: `/category/${category.slug}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()
  const products = await getProducts({ categoryId: category.id })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs items={[{ name: category.name, href: `/category/${category.slug}` }]} />
      <h1 className="text-3xl font-extrabold text-brand-800">{category.name}</h1>
      {category.description && <p className="mt-2 max-w-3xl text-muted">{category.description}</p>}
      {products.length === 0 ? (
        <p className="mt-8 text-muted">No products in this category yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
