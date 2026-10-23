// Sample catalog so the storefront has something to show.
// Run with `pnpm seed`. Safe to re-run: existing slugs are skipped.
import config from '@payload-config'
import { getPayload } from 'payload'

import { toSlug } from './fields/slug'

type SeedProduct = [name: string, unit: string, mrp: number, price: number, featured?: boolean]

const catalog: Record<string, SeedProduct[]> = {
  'Sparklers': [
    ['7 cm Electric Sparklers', '1 Box (10 pcs)', 60, 12],
    ['10 cm Colour Sparklers', '1 Box (10 pcs)', 100, 20, true],
    ['15 cm Green Sparklers', '1 Box (10 pcs)', 250, 50],
    ['30 cm Gold Sparklers', '1 Box (5 pcs)', 500, 100],
  ],
  'Ground Chakkars': [
    ['Ground Chakkar Big', '1 Box (10 pcs)', 250, 50],
    ['Ground Chakkar Deluxe', '1 Box (10 pcs)', 450, 90, true],
    ['Spinner Wheel', '1 Box (5 pcs)', 400, 80],
  ],
  'Flower Pots': [
    ['Flower Pot Small', '1 Box (10 pcs)', 280, 56],
    ['Flower Pot Big', '1 Box (10 pcs)', 450, 90],
    ['Flower Pot Special', '1 Box (10 pcs)', 650, 130, true],
    ['Colour Koti', '1 Box (10 pcs)', 1200, 240],
  ],
  'One Sound Crackers': [
    ['2¾" Kuruvi', '1 Pkt (5 pcs)', 30, 6],
    ['4" Lakshmi', '1 Pkt (5 pcs)', 80, 16],
    ['Two Sound', '1 Pkt (5 pcs)', 150, 30],
  ],
  'Rockets': [
    ['Baby Rocket', '1 Box (10 pcs)', 200, 40],
    ['Colour Rocket', '1 Box (10 pcs)', 450, 90],
    ['Whistling Rocket', '1 Box (5 pcs)', 500, 100],
  ],
  'Sky Shots': [
    ['12 Shot Multi Colour', '1 Box', 600, 120, true],
    ['30 Shot Multi Colour', '1 Box', 1500, 300],
    ['60 Shot Celebration', '1 Box', 3000, 600],
    ['120 Shot Grand Finale', '1 Box', 6000, 1200, true],
  ],
  'Gift Boxes': [
    ['Family Gift Box (21 items)', '1 Box', 3500, 1050, true],
    ['Kids Special Gift Box', '1 Box', 2000, 600],
    ['Mega Gift Box (50 items)', '1 Box', 9000, 2700],
  ],
}

const payload = await getPayload({ config })

await payload.updateGlobal({
  slug: 'settings',
  data: {},
})

let categoryOrder = 0
for (const [categoryName, products] of Object.entries(catalog)) {
  const slug = toSlug(categoryName)
  const existing = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
  const category =
    existing.docs[0] ??
    (await payload.create({
      collection: 'categories',
      data: {
        name: categoryName,
        slug,
        sortOrder: categoryOrder,
        description: `Buy ${categoryName.toLowerCase()} online direct from Sivakasi at wholesale prices.`,
      },
    }))
  categoryOrder += 10

  let productOrder = 0
  for (const [name, unit, mrp, price, featured] of products) {
    const productSlug = toSlug(name)
    const found = await payload.find({ collection: 'products', where: { slug: { equals: productSlug } }, limit: 1 })
    productOrder += 10
    if (found.docs.length) continue
    await payload.create({
      collection: 'products',
      data: {
        name,
        slug: productSlug,
        unit,
        mrp,
        price,
        category: category.id,
        featured: Boolean(featured),
        inStock: true,
        sortOrder: productOrder,
      },
    })
  }
  payload.logger.info(`Seeded ${categoryName}`)
}

payload.logger.info('Seed complete')
process.exit(0)
