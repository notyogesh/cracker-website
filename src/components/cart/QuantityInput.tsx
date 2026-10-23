'use client'

import { useCart, type CartProduct } from './CartProvider'

export function QuantityInput({
  product,
  disabled,
  size = 'md',
}: {
  product: CartProduct
  disabled?: boolean
  size?: 'sm' | 'md'
}) {
  const { quantityOf, setQuantity, addQuantity } = useCart()
  const qty = quantityOf(product.id)
  const btn =
    size === 'sm'
      ? 'h-8 w-8 text-base'
      : 'h-10 w-10 text-lg'

  if (disabled) {
    return <span className="text-sm font-medium text-muted">Out of stock</span>
  }

  return (
    <div className="inline-flex items-center rounded-full border border-brand-200 bg-white">
      <button
        type="button"
        aria-label={`Remove one ${product.name}`}
        className={`${btn} rounded-l-full font-semibold text-brand-700 hover:bg-brand-50 disabled:opacity-40`}
        onClick={() => addQuantity(product, -1)}
        disabled={qty === 0}
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={999}
        aria-label={`Quantity of ${product.name}`}
        className={`${size === 'sm' ? 'h-8 w-12' : 'h-10 w-14'} border-x border-brand-100 text-center text-sm font-semibold [appearance:textfield] focus:outline-2 focus:outline-brand-500 [&::-webkit-inner-spin-button]:appearance-none`}
        value={qty || ''}
        placeholder="0"
        onChange={(e) => setQuantity(product, Number(e.target.value))}
      />
      <button
        type="button"
        aria-label={`Add one ${product.name}`}
        className={`${btn} rounded-r-full font-semibold text-brand-700 hover:bg-brand-50`}
        onClick={() => addQuantity(product, 1)}
      >
        +
      </button>
    </div>
  )
}
