import type { Metadata } from 'next'
import { Fredoka, Inter } from 'next/font/google'
import Link from 'next/link'
import React from 'react'

import { CartBar, CartLink } from '@/components/cart/CartBar'
import { CartProvider } from '@/components/cart/CartProvider'
import { JsonLd } from '@/components/JsonLd'
import { Logo } from '@/components/Logo'
import { SearchBox } from '@/components/SearchBox'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { siteURL } from '@/lib/format'
import { getCategories, getSettings } from '@/lib/payload'
import { whatsappLink } from '@/lib/whatsapp'
import './styles.css'

const fredoka = Fredoka({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-fredoka', display: 'swap' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

// Shown in the white menu bar, in this order, when the category exists.
const MENU_SLUGS = ['sparklers', 'flower-pots', 'ground-chakkars', 'sky-shots', 'gift-boxes', 'rockets', 'sound-crackers']

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const title = `${settings.shopName} | Buy Sivakasi Crackers Online at Wholesale Price`
  return {
    metadataBase: new URL(siteURL()),
    title: { default: title, template: `%s | ${settings.shopName}` },
    description: `${settings.tagline}. Order Diwali crackers, gift boxes and sky shots direct from Sivakasi.`,
    openGraph: { siteName: settings.shopName, locale: 'en_IN', type: 'website' },
    alternates: { canonical: '/' },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories] = await Promise.all([getSettings(), getCategories()])
  const menu = MENU_SLUGS.map((s) => categories.find((c) => c.slug === s)).filter((c) => c !== undefined)
  const tel = `tel:${settings.phone.replace(/\s/g, '')}`

  return (
    <html lang="en-IN" className={`${fredoka.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-white font-sans text-ink antialiased">
        <CartProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-2">
            Skip to content
          </a>

          <div className="bg-brand-800 text-xs text-white/90 sm:text-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1.5">
              <p className="truncate">{settings.announcement}</p>
              <p className="hidden shrink-0 items-center gap-3 sm:flex">
                <Link href="/price-list" className="hover:text-gold-300">Price list</Link>
                <span aria-hidden="true" className="text-white/30">|</span>
                <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:text-gold-300">
                  WhatsApp
                </a>
              </p>
            </div>
          </div>

          <header className="sticky top-0 z-30 shadow-sm">
            <div className="bg-brand-600">
              <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 px-4 py-3 md:grid-cols-[auto_1fr_auto] md:py-4">
                <Logo name={settings.shopName} />
                <SearchBox className="col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1 md:mx-6 md:max-w-xl md:justify-self-center md:w-full" />
                <CartLink />
              </div>
            </div>
            <nav aria-label="Categories" className="border-b border-brand-100 bg-white">
              <div className="mx-auto flex max-w-6xl items-center gap-6 px-4">
                <ul className="-mx-1 flex flex-1 items-center gap-1 overflow-x-auto py-2 text-sm font-medium [scrollbar-width:none]">
                  <li>
                    <Link href="/price-list" className="block whitespace-nowrap rounded-full bg-brand-50 px-3 py-1.5 font-semibold text-brand-700 hover:bg-brand-100">
                      Price list
                    </Link>
                  </li>
                  {menu.map((c) => (
                    <li key={c.id}>
                      <Link href={`/category/${c.slug}`} className="block whitespace-nowrap rounded-full px-3 py-1.5 text-ink hover:bg-brand-50 hover:text-brand-700">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/#categories" className="block whitespace-nowrap rounded-full px-3 py-1.5 text-brand-600 hover:bg-brand-50">
                      All categories →
                    </Link>
                  </li>
                </ul>
                <a href={tel} className="hidden shrink-0 items-center gap-2 border-l border-brand-100 pl-5 text-sm font-semibold text-sale-600 lg:flex">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="6" y="2" width="12" height="20" rx="2" />
                    <path d="M11 18h2" strokeLinecap="round" />
                  </svg>
                  {settings.phone}
                </a>
              </div>
            </nav>
          </header>

          <main id="main" className="pb-24">{children}</main>

          <footer className="bg-brand-900 text-brand-100">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <Logo name={settings.shopName} />
                <p className="mt-4 text-sm leading-relaxed text-brand-200">{settings.tagline}.</p>
                <p className="mt-3 whitespace-pre-line text-sm text-brand-200">{settings.address}</p>
                {settings.licenseNumber && <p className="mt-2 text-sm">PESO licence: {settings.licenseNumber}</p>}
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-white">Popular categories</p>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {menu.map((c) => (
                    <li key={c.id}>
                      <Link href={`/category/${c.slug}`} className="hover:text-gold-300">{c.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-sm">
                <p className="font-display text-lg font-semibold text-white">How ordering works</p>
                <p className="mt-3 leading-relaxed text-brand-200">
                  Add items to your cart and send the estimate. We call you to confirm stock, transport and payment.
                  Minimum order ₹{settings.minOrderHomeState} in Tamil Nadu, ₹{settings.minOrderOtherStates} for other
                  states.
                </p>
                <p className="mt-3 leading-relaxed text-brand-200">
                  Crackers are subject to local laws. Please check your state&apos;s rules before ordering.
                </p>
              </div>
              <div className="text-sm">
                <p className="font-display text-lg font-semibold text-white">Talk to us</p>
                <ul className="mt-3 space-y-2">
                  <li>
                    <a href={tel} className="font-semibold text-gold-300 hover:text-gold-400">{settings.phone}</a>
                  </li>
                  <li>
                    <a href={whatsappLink(settings.whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:text-gold-300">
                      Chat on WhatsApp
                    </a>
                  </li>
                  {settings.email && (
                    <li>
                      <a href={`mailto:${settings.email}`} className="hover:text-gold-300">{settings.email}</a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <p className="border-t border-white/10 px-4 py-4 text-center text-xs text-brand-300">
              © {new Date().getFullYear()} {settings.shopName}. Direct from Sivakasi.
            </p>
          </footer>
          <CartBar />
          <WhatsAppButton number={settings.whatsapp} />
        </CartProvider>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'Store',
            '@id': `${siteURL()}/#store`,
            name: settings.shopName,
            url: siteURL(),
            telephone: settings.phone,
            ...(settings.email ? { email: settings.email } : {}),
            address: {
              '@type': 'PostalAddress',
              streetAddress: settings.address,
              addressLocality: settings.city,
              postalCode: settings.pincode,
              addressRegion: 'Tamil Nadu',
              addressCountry: 'IN',
            },
            priceRange: '₹',
          }}
        />
      </body>
    </html>
  )
}
