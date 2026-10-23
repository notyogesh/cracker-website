'use client'

import { useCart } from '@/components/cart/CartProvider'
import { formatINR } from '@/lib/format'

export function LineTotal({ id, price }: { id: number; price: number }) {
  const qty = useCart().quantityOf(id)
  return <>{qty > 0 ? formatINR(qty * price) : <span className="text-brand-200">—</span>}</>
}
