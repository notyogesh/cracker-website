import type { Product } from '@/payload-types'
import { discountPercent, formatINR } from './format'

const clip = (text: string, max: number) => {
  if (text.length <= max) return text
  const cut = text.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' '))}…`
}

export const titleNameOf = (p: Product) => p.titleName || p.name

// e.g. "3½" Parrot Sound Cracker – Buy Online at ₹15" (layout adds "| Shop name").
export const productTitle = (p: Product) => p.seoTitle || `${titleNameOf(p)} – Buy Online at ${formatINR(p.price)}`

// Built at render time so the price in search results is always current.
export function productMetaDescription(p: Product) {
  if (p.seoDescription) return p.seoDescription
  const off = discountPercent(p.mrp, p.price)
  const firstSentence = p.description?.match(/^.+?[.!?](\s|$)/)?.[0].trim() ?? ''
  const price = `Buy ${titleNameOf(p)} online at ${formatINR(p.price)}${off > 0 ? ` (MRP ${formatINR(p.mrp)}, ${off}% off)` : ''}.`
  return clip(`${price} ${firstSentence}`.trim(), 158)
}

const NOISE: Record<string, string> = { none: 'No sound', low: 'Low', medium: 'Medium', loud: 'Loud' }
const AGE: Record<string, string> = { kids: 'Kids, with adult supervision', family: 'Family', adults: 'Adults only' }

// Rows for the specs table; empty values are left out.
export function productSpecs(p: Product, categoryName?: string) {
  const rows: [string, string | null | undefined][] = [
    ['Type', p.productType],
    ['Category', categoryName],
    ['Pack contents', p.packContents || p.unit],
    ['Size', p.size],
    ['Shots', p.shots ? String(p.shots) : null],
    ['Effect', p.effect],
    ['Duration', p.duration],
    ['Sound level', p.noiseLevel ? NOISE[p.noiseLevel] : null],
    ['Suitable for', p.ageGroup ? AGE[p.ageGroup] : null],
    ['Green cracker', p.greenCracker ? 'Yes' : null],
    ['Manufacturer', p.manufacturer],
    ['Item code', p.code],
  ]
  const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
  return rows
    .filter((r): r is [string, string] => Boolean(r[1]))
    .map(([label, value]): [string, string] => [label, capitalise(value.replace(/^an? /, ''))])
}

export function youtubeId(url?: string | null) {
  if (!url) return null
  return url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([\w-]{11})/)?.[1] ?? null
}
