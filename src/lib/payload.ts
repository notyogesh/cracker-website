import config from '@payload-config'
import { cache } from 'react'
import { getPayload } from 'payload'

import type { Category, Media, Product } from '@/payload-types'

export const getPayloadClient = () => getPayload({ config })

export const getSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({ slug: 'settings' })
})

export const getCategories = cache(async () => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    sort: 'sortOrder',
    limit: 200,
    depth: 1,
  })
  return docs
})

export const getCategoryBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

export const getProducts = cache(
  async (opts: { categoryId?: number; featured?: boolean } = {}) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'products',
      where: {
        ...(opts.categoryId ? { category: { equals: opts.categoryId } } : {}),
        ...(opts.featured ? { featured: { equals: true } } : {}),
      },
      sort: 'sortOrder',
      limit: 1000,
      depth: 1,
    })
    return docs
  },
)

export const getProductBySlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
})

// For redirecting old product URLs to the current one.
export const getProductByOldSlug = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: { oldSlugs: { in: [slug] } },
    limit: 1,
    depth: 0,
  })
  return docs[0] ?? null
})

export const categoryOf =(product: Product): Category | null =>
  typeof product.category === 'object' ? product.category : null

export const mediaOf = (value: number | Media | null | undefined): Media | null =>
  value && typeof value === 'object' ? value : null
