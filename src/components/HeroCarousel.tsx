'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

import { whatsappLink } from '@/lib/whatsapp'
import { BurstIcon } from './Logo'
import { WhatsAppIcon } from './WhatsAppIcon'

export type HeroSlide = {
  eyebrow: string
  title: string
  highlight?: string // part of the title shown in gold
  badge?: string // pink pill under the title
  text: string
  cta: { label: string; href: string }
  background: string
  image?: { url: string; alt: string }
}

const INTERVAL_MS = 6000

function Title({ as: Tag, title, highlight }: { as: 'h1' | 'h2'; title: string; highlight?: string }) {
  const i = highlight ? title.indexOf(highlight) : -1
  return (
    <Tag className="mt-3 max-w-xl text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl">
      {i === -1 ? (
        title
      ) : (
        <>
          {title.slice(0, i)}
          <span className="text-gold-400">{highlight}</span>
          {title.slice(i + highlight!.length)}
        </>
      )}
    </Tag>
  )
}

// All slides are rendered on the server so their text is indexable; only the
// first slide's title is the page <h1>.
export function HeroCarousel({ slides, whatsapp }: { slides: HeroSlide[]; whatsapp: string }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchX = useRef<number | null>(null)
  const count = slides.length

  const go = useCallback((i: number) => setIndex((i + count) % count), [count])

  useEffect(() => {
    if (paused || count < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [paused, count])

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Offers"
      className="relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1))
        touchX.current = null
      }}
    >
      <div
        className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div
            key={s.title}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            inert={i !== index}
            className={`relative w-full shrink-0 overflow-hidden text-white ${s.background}`}
          >
            {/* Decorative bursts and dots */}
            <BurstIcon className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 text-white/5" />
            <BurstIcon className="pointer-events-none absolute bottom-6 left-1/2 h-16 w-16 text-gold-400/30" />
            <span aria-hidden="true" className="absolute right-[42%] top-10 h-3 w-3 rounded-full bg-sale-500" />
            <span aria-hidden="true" className="absolute bottom-16 right-8 h-4 w-4 rounded-full bg-gold-400" />

            <div className="relative mx-auto grid min-h-[460px] max-w-6xl items-center gap-8 px-4 py-14 md:grid-cols-[1.2fr_1fr] md:px-16 xl:px-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-300">{s.eyebrow}</p>
                <Title as={i === 0 ? 'h1' : 'h2'} title={s.title} highlight={s.highlight} />
                {s.badge && (
                  <p className="mt-5 inline-block rounded-full bg-sale-500 px-4 py-1.5 text-sm font-bold uppercase tracking-wide">
                    {s.badge}
                  </p>
                )}
                <p className="mt-5 max-w-lg text-lg text-brand-100">{s.text}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={s.cta.href}
                    className="rounded-full bg-gold-400 px-7 py-3 font-semibold text-brand-950 shadow-lg shadow-black/10 hover:bg-gold-300"
                  >
                    {s.cta.label}
                  </Link>
                  <a
                    href={whatsappLink(whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white hover:bg-[#1ebe5b]"
                  >
                    <WhatsAppIcon />
                    Order on WhatsApp
                  </a>
                </div>
              </div>

              {s.image && (
                <div className="relative mx-auto hidden aspect-square w-full max-w-sm md:block">
                  <div className="absolute inset-0 rounded-full bg-white/10" />
                  <div className="absolute inset-6 overflow-hidden rounded-full bg-white shadow-2xl shadow-black/30">
                    <Image src={s.image.url} alt={s.image.alt} fill sizes="320px" className="object-contain p-8" priority={i === 0} />
                  </div>
                  <BurstIcon className="absolute -right-2 top-4 h-16 w-16 text-gold-400" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/30 md:flex"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/30 md:flex"
          >
            ›
          </button>
          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={`h-2.5 rounded-full transition-all ${i === index ? 'w-8 bg-gold-400' : 'w-2.5 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
