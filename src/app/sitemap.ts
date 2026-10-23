import type { MetadataRoute } from 'next'

import { siteURL } from '@/lib/format'
import { getCategories, getProducts } from '@/lib/payload'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteURL()
  const [categories, products] = await Promise.all([getCategories(), getProducts()])
  return [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/price-list`, changeFrequency: 'daily', priority: 0.9 },
    ...categories.map((c) => ({
      url: `${base}/category/${c.slug}`,
      lastModified: new Date(c.updatedAt),
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      priority: 0.6,
    })),
  ]
}
