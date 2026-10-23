'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

// Display copy of a product. Prices here are for showing totals only; the
// server re-reads every price before an estimate is saved.
export type CartProduct = {
  id: number
  name: string
  slug: string
  unit: string
  mrp: number
  price: number
}

export type CartLine = CartProduct & { quantity: number }

type CartContextValue = {
  lines: CartLine[]
  ready: boolean
  count: number
  mrpTotal: number
  total: number
  quantityOf: (id: number) => number
  setQuantity: (product: CartProduct, quantity: number) => void
  addQuantity: (product: CartProduct, delta: number) => void
  clear: () => void
}

const STORAGE_KEY = 'cracker-cart-v1'
const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)

  // Restored after hydration so the server and first client render match.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setLines(JSON.parse(saved))
    } catch {
      // Storage unavailable or corrupt: start with an empty cart.
    }
    setReady(true)
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      // Cart still works for this visit without storage.
    }
  }, [lines, ready])

  // `next` receives the latest quantity so rapid clicks don't read a stale value.
  const updateQuantity = useCallback((product: CartProduct, next: (current: number) => number) => {
    setLines((prev) => {
      const current = prev.find((l) => l.id === product.id)?.quantity ?? 0
      const qty = Math.max(0, Math.min(999, Math.floor(next(current) || 0)))
      const rest = prev.filter((l) => l.id !== product.id)
      if (qty === 0) return rest
      const existing = prev.findIndex((l) => l.id === product.id)
      const line = { ...product, quantity: qty }
      if (existing === -1) return [...prev, line]
      const updated = [...prev]
      updated[existing] = line
      return updated
    })
  }, [])

  const setQuantity = useCallback(
    (product: CartProduct, quantity: number) => updateQuantity(product, () => quantity),
    [updateQuantity],
  )
  const addQuantity = useCallback(
    (product: CartProduct, delta: number) => updateQuantity(product, (current) => current + delta),
    [updateQuantity],
  )

  const value = useMemo<CartContextValue>(() => {
    const byId = new Map(lines.map((l) => [l.id, l.quantity]))
    return {
      lines,
      ready,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      mrpTotal: lines.reduce((n, l) => n + l.mrp * l.quantity, 0),
      total: lines.reduce((n, l) => n + l.price * l.quantity, 0),
      quantityOf: (id) => byId.get(id) ?? 0,
      setQuantity,
      addQuantity,
      clear: () => setLines([]),
    }
  }, [lines, ready, setQuantity, addQuantity])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
