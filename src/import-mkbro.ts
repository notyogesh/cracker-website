// Replaces the catalogue with MK Bro Crackers' products.
// Data: data/mkbro-products.json, images: data/mkbro-images/NNN.webp
// (made by scripts/clean-product-images.mjs). Run with `pnpm import:mkbro`.
// Estimates already placed are kept: they store their own item names and prices.
import config from '@payload-config'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { getPayload } from 'payload'

import { toSlug } from './fields/slug'
import { buildContent } from './import/mkbro-content'

type Source = { no: number; name: string; unit: string; mrp: number; price: number; category: string }

const CATEGORIES: Record<string, { name: string; description: string }> = {
  'SOUND CRACKERS': { name: 'Sound Crackers', description: 'Classic one-sound crackers like Kuruvi, Lakshmi and Bahubali.' },
  'CHORSA GIANT & DELUX CRACKERS': { name: 'Chorsa, Giant & Deluxe Crackers', description: 'Chorsa, Giant and Deluxe string crackers.' },
  'GROUND CHAKKARAM': { name: 'Ground Chakkars', description: 'Spinning ground chakkars in big, special and deluxe sizes.' },
  'WHEEL SERIES SPINNERS': { name: 'Wheels & Spinners', description: 'Spinners, wheels, bambaram and butterfly.' },
  'FLOWER POTS': { name: 'Flower Pots', description: 'Flower pots from small to colour kotti deluxe.' },
  'COLOR MATCHES': { name: 'Colour Matches', description: 'Colour matches for kids and family.' },
  BOMBS: { name: 'Bombs', description: 'Bullet, atom, hydro and digital bombs.' },
  'PAPER BOMBS': { name: 'Paper Bombs', description: 'Paper bombs from ¼ kg to 1 kg, plus cylinder and colour bombs.' },
  'TWINKLING STARS & PENCIL': { name: 'Twinkling Stars & Pencils', description: 'Twinkling stars, laser candles and pencils.' },
  ROCKETS: { name: 'Rockets', description: 'Baby, bomb, lunik and whistling rockets.' },
  'WALA ITEMS': { name: 'Wala Crackers', description: '100 wala to 10,000 wala garlands.' },
  'COLOR FOUNTAIN ITEMS': { name: 'Colour Fountains', description: 'Peacock and other colour fountains.' },
  'SHOWER FOUNTAIN ITEMS': { name: 'Shower Fountains', description: 'Shower fountains like H2O, Tic Tac and Moon Star.' },
  'MINI COLOR FOUNTAIN ITEMS': { name: 'Mini Colour Fountains', description: 'Fun mini fountains: helicopter, drone, siren and more.' },
  'FANCY ITEMS': { name: 'Fancy Items', description: 'Single fancy aerial shells from 1" to 4".' },
  'MULTI FANCY ITEMS': { name: 'Multi Fancy Items', description: 'Multi-piece fancy aerial shells.' },
  'STEP FANCY ITEMS': { name: 'Step Fancy Items', description: '3, 7 and 12 step fancy aerial shots.' },
  'MULTI COLOR SHOT ITEMS': { name: 'Sky Shots', description: 'Multi-colour sky shots from 7 to 240 shots.' },
  'STONE ITEMS': { name: 'Stone Items', description: 'Pop pop, roll caps, snake tablets and other kids’ favourites.' },
  'BIJILLI CRACKERS': { name: 'Bijili Crackers', description: 'Red and gold bijili, palm leaf and nattu vedi.' },
  SPARKLERS: { name: 'Sparklers', description: 'Electric, colour, green and red sparklers from 7 cm to 50 cm.' },
  'SPECIAL SPARKLERS': { name: 'Special Sparklers', description: 'Rotating and special sparklers.' },
  'GIFT BOX': { name: 'Gift Boxes', description: 'Ready gift boxes with 25 to 51 items.' },
}

const TYPOS: Record<string, string> = { Whisiling: 'Whistling', Helicoptter: 'Helicopter', Autom: 'Atom', 'Bat& Ball': 'Bat & Ball' }

const FEATURED = new Set([157, 111, 60, 25, 14, 134, 65, 106])

// Source photo isn't the product: #33 is a footballer wallpaper, #108 and #113
// show a Colour Koti flower pot. Imported without an image until MK Bro sends the right ones.
const WRONG_IMAGE = new Set([33, 108, 113])

// Source units are counts ("1PKT", "BOX", "5 Pcs") or, for a few items, a variant name.
function parseUnit(raw: string): { unit: string; variant?: string } {
  const u = raw.trim()
  if (/^1?\s*pkt$/i.test(u)) return { unit: '1 Pkt' }
  if (/^1?\s*box$/i.test(u)) return { unit: '1 Box' }
  if (/^1\s*pcs?$/i.test(u)) return { unit: '1 Pc' }
  const count = u.match(/^(\d+)\s*pcs?$/i)
  if (count) return { unit: `${count[1]} Pcs` }
  return { unit: '1 Pc', variant: u.replace(/\bCigret\b/i, 'Cigarette') }
}

function cleanName(raw: string) {
  let name = raw.trim().replace(/\s+/g, ' ')
  for (const [from, to] of Object.entries(TYPOS)) name = name.replace(from, to)
  // Capitalise words that start lowercase ("100 wala" → "100 Wala").
  return name.replace(/(^|[\s(/])([a-z])/g, (_, pre, c) => pre + c.toUpperCase())
}

const root = process.cwd()
const source: Source[] = JSON.parse(fs.readFileSync(path.join(root, 'data/mkbro-products.json'), 'utf8'))
const imageDir = path.join(root, 'data/mkbro-images')

const rows = source.map((s) => {
  const { unit, variant } = parseUnit(s.unit)
  const base = cleanName(s.name)
  return { ...s, unit, name: variant ? `${base} – ${variant}` : base }
})
// Same name twice (e.g. 4" Fancy as 1 Pc and 2 Pcs): add the unit so pages and slugs differ.
const counts = new Map<string, number>()
rows.forEach((r) => counts.set(r.name, (counts.get(r.name) ?? 0) + 1))
rows.forEach((r) => {
  if (counts.get(r.name)! > 1) r.name = `${r.name} (${r.unit})`
})

const payload = await getPayload({ config })

// Keep each product's current and earlier URLs so links people already shared redirect.
const previous = await payload.find({ collection: 'products', limit: 1000, depth: 0, pagination: false })
const oldSlugsByCode = new Map(
  previous.docs.map((p) => [p.code, [...new Set([p.slug, ...(p.oldSlugs ?? [])].filter((s): s is string => Boolean(s)))]]),
)

// Descriptive image file names (3-5-inch-parrot-sound-cracker.webp) instead of 001.webp.
const namedDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mkbro-images-'))

for (const collection of ['products', 'categories', 'media'] as const) {
  const { docs } = await payload.delete({ collection, where: { id: { exists: true } }, depth: 0 })
  payload.logger.info(`Removed ${docs.length} ${collection}`)
}

const categoryIds = new Map<string, number>()
let order = 0
for (const key of [...new Set(rows.map((r) => r.category))]) {
  const meta = CATEGORIES[key] ?? { name: cleanName(key.toLowerCase()), description: '' }
  const doc = await payload.create({
    collection: 'categories',
    data: { name: meta.name, slug: toSlug(meta.name), description: meta.description, sortOrder: (order += 10) },
  })
  categoryIds.set(key, doc.id)
}
payload.logger.info(`Created ${categoryIds.size} categories`)

let withImage = 0
for (const [index, r] of rows.entries()) {
  const code = `MK-${String(r.no).padStart(3, '0')}`
  const content = buildContent(r, index)
  const slug = toSlug(content.slugBase)
  const file = path.join(imageDir, `${String(r.no).padStart(3, '0')}.webp`)
  let image: number | undefined
  if (!WRONG_IMAGE.has(r.no) && fs.existsSync(file)) {
    const named = path.join(namedDir, `${slug}.webp`)
    fs.copyFileSync(file, named)
    const media = await payload.create({ collection: 'media', data: { alt: content.altText }, filePath: named })
    image = media.id
    withImage++
  }
  await payload.create({
    collection: 'products',
    data: {
      name: content.name,
      slug,
      titleName: content.slugBase.includes(content.productType) ? `${content.name} ${content.productType}` : content.name,
      code,
      unit: r.unit,
      mrp: r.mrp,
      price: r.price,
      category: categoryIds.get(r.category)!,
      productType: content.productType,
      image,
      description: content.description,
      contentStatus: 'draft',
      packContents: content.packContents,
      effect: content.effect,
      shots: content.shots,
      size: content.size,
      noiseLevel: content.noiseLevel,
      ageGroup: content.ageGroup,
      faqs: content.faqs,
      oldSlugs: (oldSlugsByCode.get(code) ?? []).filter((s) => s !== slug),
      inStock: true,
      featured: FEATURED.has(r.no),
      sortOrder: r.no * 10,
    },
  })
}
fs.rmSync(namedDir, { recursive: true, force: true })

payload.logger.info(`Imported ${rows.length} products (${withImage} with images)`)
process.exit(0)
