'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { formatINR } from '@/lib/format'
import { useCart } from './CartProvider'

// Sticky summary at the bottom of the screen once something is in the cart.
export function CartBar() {
  const { count, total, mrpTotal, ready } = useCart()
  const pathname = usePathname()
  if (!ready || count === 0 || pathname.startsWith('/cart') || pathname.startsWith('/order')) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-100 bg-white/95 shadow-[0_-4px_20px_rgba(74,26,96,0.12)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="text-sm">
          <span className="font-semibold">{count} items</span>
          <span className="mx-2 text-brand-200">|</span>
          <span className="text-muted line-through">{formatINR(mrpTotal)}</span>{' '}
          <span className="text-lg font-bold text-brand-700">{formatINR(total)}</span>
        </div>
        <Link
          href="/cart"
          className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          View estimate →
        </Link>
      </div>
    </div>
  )
}

export function CartLink() {
  const { count } = useCart()
  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 6h15l-1.5 9h-12z M6 6 5 3H2 M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
      </svg>
      <span className="hidden sm:inline">Cart</span>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-gold-400 px-1 text-center text-xs font-bold leading-5 text-brand-950 sm:static">{count}</span>
      )}
    </Link>
  )
}
