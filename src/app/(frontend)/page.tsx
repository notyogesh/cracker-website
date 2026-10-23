import Image from 'next/image'
import Link from 'next/link'

import { HeroCarousel, type HeroSlide } from '@/components/HeroCarousel'
import { BurstIcon } from '@/components/Logo'
import { ProductCard } from '@/components/ProductCard'
import type { Media, Product } from '@/payload-types'
import { categoryOf, getCategories, getProducts, getSettings, mediaOf } from '@/lib/payload'

export const revalidate = 3600

const imageOf = (products: Product[], code: string) => {
  const p = products.find((x) => x.code === code)
  const m = p && mediaOf(p.image)
  return m?.url ? { url: m.url, alt: m.alt } : undefined
}

const heroSlides = (tagline: string | null | undefined, products: Product[]): HeroSlide[] => [
  {
    eyebrow: 'Direct from Sivakasi',
    title: 'Buy Sivakasi crackers online at wholesale prices',
    highlight: 'wholesale prices',
    badge: '157 crackers in stock',
    text: `${tagline || 'Factory prices'}. Pick your crackers, send the estimate, and we deliver to your door.`,
    cta: { label: 'Open price list', href: '/price-list' },
    background: 'bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800',
    image: imageOf(products, 'MK-025'),
  },
  {
    eyebrow: 'Diwali 2026 sale',
    title: 'Up to 80% off MRP on every cracker',
    highlight: '80% off',
    badge: 'Limited Diwali stock',
    text: 'Sparklers, flower pots, chakkars, rockets and sky shots at Sivakasi factory rates.',
    cta: { label: 'See today’s prices', href: '/price-list' },
    background: 'bg-gradient-to-br from-brand-800 via-brand-700 to-sale-600',
    image: imageOf(products, 'MK-134'),
  },
  {
    eyebrow: 'Gift boxes',
    title: 'Family gift boxes for a complete Diwali',
    highlight: 'gift boxes',
    badge: '25 to 51 items',
    text: 'A safe, easy gift for family, friends and staff, with everything in one box.',
    cta: { label: 'Shop gift boxes', href: '/category/gift-boxes' },
    background: 'bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500',
    image: imageOf(products, 'MK-155'),
  },
  {
    eyebrow: 'Sky shots',
    title: 'Light up the sky with multi-colour shots',
    highlight: 'multi-colour',
    badge: '7 to 240 shots',
    text: 'Perfect for weddings, temple festivals and New Year celebrations.',
    cta: { label: 'Shop sky shots', href: '/category/sky-shots' },
    background: 'bg-gradient-to-br from-brand-950 via-brand-800 to-brand-600',
    image: imageOf(products, 'MK-111'),
  },
]

function SectionHeading({ title, eyebrow, action }: { title: string; eyebrow?: string; action?: { label: string; href: string } }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-sale-500">
            <BurstIcon className="h-5 w-5 text-gold-400" />
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1 text-3xl font-bold text-brand-800 sm:text-4xl">{title}</h2>
      </div>
      {action && (
        <Link href={action.href} className="rounded-full border-2 border-brand-600 px-5 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-600 hover:text-white">
          {action.label}
        </Link>
      )}
    </div>
  )
}

const TRUST = [
  { title: 'Direct from Sivakasi', text: 'Factory-fresh crackers at wholesale rates', icon: 'burst' },
  { title: 'Safe, careful packing', text: 'Packed to travel safely by lorry or parcel', icon: 'box' },
  { title: 'Delivery across India', text: 'Tamil Nadu and other states', icon: 'truck' },
  { title: 'WhatsApp support', text: 'Order or ask anything on chat', icon: 'chat' },
] as const

function TrustIcon({ name }: { name: (typeof TRUST)[number]['icon'] }) {
  if (name === 'burst') return <BurstIcon className="h-7 w-7" />
  const paths = {
    box: 'M3 7l9-4 9 4-9 4-9-4zm0 0v10l9 4 9-4V7M12 11v10',
    truck: 'M3 6h11v9H3zM14 9h4l3 3v3h-7M7 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 18.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
    chat: 'M4 5h16v11H8l-4 4V5zM8 10h8M8 13h5',
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  )
}

export default async function HomePage() {
  const [settings, categories, products] = await Promise.all([getSettings(), getCategories(), getProducts()])
  const featured = products.filter((p) => p.featured)

  // Tile image: the category's own image, else its first product photo.
  const tileImage = new Map<number, Media>()
  const productCount = new Map<number, number>()
  for (const p of products) {
    const cat = categoryOf(p)
    if (!cat) continue
    productCount.set(cat.id, (productCount.get(cat.id) ?? 0) + 1)
    const m = mediaOf(p.image)
    if (m?.url && !tileImage.has(cat.id)) tileImage.set(cat.id, m)
  }

  return (
    <>
      <HeroCarousel slides={heroSlides(settings.tagline, products)} whatsapp={settings.whatsapp} />

      <section aria-label="Why buy from us" className="border-b border-brand-100">
        <ul className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map((t) => (
            <li key={t.title} className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gold-400 text-brand-900 shadow-md shadow-gold-400/30">
                <TrustIcon name={t.icon} />
              </span>
              <span>
                <span className="block font-display text-lg font-semibold text-brand-800">{t.title}</span>
                <span className="block text-sm text-muted">{t.text}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mx-auto max-w-6xl px-4 pb-6 text-center text-sm text-muted">
          Minimum order <strong className="text-brand-700">₹{settings.minOrderHomeState}</strong> in Tamil Nadu ·{' '}
          <strong className="text-brand-700">₹{settings.minOrderOtherStates}</strong> for other states · Call{' '}
          <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="font-semibold text-sale-600 hover:underline">
            {settings.phone}
          </a>
        </p>
      </section>

      <section id="categories" className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading eyebrow="Shop by type" title="Explore our crackers" action={{ label: 'Full price list', href: '/price-list' }} />
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => {
            const image = mediaOf(c.image) ?? tileImage.get(c.id)
            const n = productCount.get(c.id) ?? 0
            return (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden rounded-3xl sm:aspect-[4/5] bg-brand-50 ring-1 ring-brand-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-600/15"
                >
                  {image?.url ? (
                    <Image
                      src={image.url}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-contain p-3 pb-20 transition duration-500 group-hover:scale-105 sm:p-5 sm:pb-20"
                    />
                  ) : (
                    <BurstIcon className="absolute left-1/2 top-[38%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 text-brand-300" />
                  )}
                  <span className="absolute inset-x-0 bottom-0 rounded-tr-[2.5rem] bg-brand-600 px-3 pb-3 pt-3.5 text-white transition group-hover:bg-brand-700 sm:rounded-tr-[4rem] sm:px-4 sm:pb-4 sm:pt-5">
                    <span className="block font-display text-[15px] font-semibold leading-tight sm:text-lg">{c.name}</span>
                    <span className="mt-1 block text-xs text-brand-100">
                      {n} product{n === 1 ? '' : 's'}<span className="hidden sm:inline"> · <span className="text-gold-300">Shop now →</span></span>
                    </span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {featured.length > 0 && (
        <section className="border-t border-brand-100 py-14">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading eyebrow="Best sellers" title="Popular this Diwali" />
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading eyebrow="Simple & safe" title="How to order" />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ['Add crackers', 'From the price list or any category page.'],
            ['Send your estimate', 'With your delivery address. No payment is taken online.'],
            ['We call you', 'To confirm stock, transport charges and payment.'],
            ['Delivery', 'By lorry service or parcel to your nearest point or door.'],
          ].map(([title, text], i) => (
            <li key={title} className="rounded-3xl border border-brand-100 p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 font-display text-lg font-bold text-gold-300">
                {i + 1}
              </span>
              <p className="mt-4 font-display text-lg font-semibold text-brand-800">{title}</p>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
