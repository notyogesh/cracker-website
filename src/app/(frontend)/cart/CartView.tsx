'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { useCart } from '@/components/cart/CartProvider'
import { QuantityInput } from '@/components/cart/QuantityInput'
import { minOrderFor } from '@/lib/estimate'
import { formatINR } from '@/lib/format'
import { HOME_STATE, INDIAN_STATES } from '@/lib/states'
import { placeEstimate, type EstimateInput } from './actions'

type FieldErrors = Partial<Record<keyof EstimateInput, string>>

export function CartView(props: {
  minOrderHomeState: number
  minOrderOtherStates: number
  blockedStates: string[]
}) {
  const { lines, ready, total, mrpTotal, clear } = useCart()
  const router = useRouter()
  const [state, setState] = useState<string>(HOME_STATE)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [pending, startTransition] = useTransition()

  if (!ready) return <p className="mt-6 text-muted">Loading your cart…</p>

  if (lines.length === 0) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-brand-200 bg-white p-10 text-center">
        <p className="text-lg font-semibold">Your cart is empty.</p>
        <Link href="/price-list" className="mt-4 inline-block rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700">
          Open the price list
        </Link>
      </div>
    )
  }

  const minimum = minOrderFor(state, props)
  const shortBy = Math.max(0, minimum - total)
  const blocked = props.blockedStates.includes(state)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const value = (k: string) => String(form.get(k) ?? '')
    setError(null)
    setFieldErrors({})
    startTransition(async () => {
      const result = await placeEstimate({
        lines: lines.map((l) => ({ id: l.id, quantity: l.quantity })),
        customerName: value('customerName'),
        phone: value('phone'),
        email: value('email'),
        address: value('address'),
        city: value('city'),
        state: value('state'),
        pincode: value('pincode'),
        notes: value('notes'),
      })
      if (result.ok) {
        clear()
        router.push(`/order/${result.orderNumber}`)
      } else {
        setError(result.error)
        setFieldErrors(result.fieldErrors ?? {})
      }
    })
  }

  const input = 'mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200'
  const field = (name: keyof EstimateInput, label: string, el: React.ReactElement) => (
    <label className="block text-sm font-medium">
      {label}
      {el}
      {fieldErrors[name] && <span className="mt-1 block text-xs text-sale-500">{fieldErrors[name]}</span>}
    </label>
  )

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px]">
      <section aria-label="Items">
        <ul className="divide-y divide-brand-100 rounded-xl border border-brand-100 bg-white">
          {lines.map((l) => (
            <li key={l.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <Link href={`/product/${l.slug}`} className="font-semibold hover:text-brand-700">{l.name}</Link>
                <p className="text-xs text-muted">
                  {l.unit} · {formatINR(l.price)} each
                </p>
              </div>
              <QuantityInput product={l} size="sm" />
              <p className="w-24 text-right font-bold">{formatINR(l.price * l.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1 rounded-xl bg-white p-4 text-sm">
          <div className="flex justify-between"><dt>MRP total</dt><dd className="text-muted line-through">{formatINR(mrpTotal)}</dd></div>
          <div className="flex justify-between text-emerald-700"><dt>You save</dt><dd>{formatINR(mrpTotal - total)}</dd></div>
          <div className="flex justify-between text-lg font-bold"><dt>Net total</dt><dd>{formatINR(total)}</dd></div>
          <p className="pt-2 text-xs text-muted">Transport charges are confirmed by phone and paid separately.</p>
        </dl>
      </section>

      <section aria-labelledby="delivery-heading" className="rounded-xl border border-brand-100 bg-white p-5">
        <h2 id="delivery-heading" className="text-lg font-bold">Delivery details</h2>
        <form onSubmit={onSubmit} className="mt-4 space-y-4" noValidate>
          {field('customerName', 'Full name', <input name="customerName" autoComplete="name" required className={input} />)}
          {field('phone', 'Mobile number', <input name="phone" type="tel" autoComplete="tel" inputMode="tel" required className={input} />)}
          {field('email', 'Email (optional)', <input name="email" type="email" autoComplete="email" className={input} />)}
          {field('address', 'Address', <textarea name="address" rows={3} autoComplete="street-address" required className={input} />)}
          <div className="grid grid-cols-2 gap-3">
            {field('city', 'City', <input name="city" autoComplete="address-level2" required className={input} />)}
            {field('pincode', 'Pincode', <input name="pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code" required className={input} />)}
          </div>
          {field(
            'state',
            'State',
            <select name="state" value={state} onChange={(e) => setState(e.target.value)} className={input}>
              {INDIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>,
          )}
          {field('notes', 'Notes (optional)', <textarea name="notes" rows={2} className={input} placeholder="Preferred delivery date, landmark…" />)}

          {blocked ? (
            <p className="rounded-lg bg-sale-100 p-3 text-sm text-sale-600">We can&apos;t deliver to {state} due to local regulations.</p>
          ) : shortBy > 0 ? (
            <p className="rounded-lg bg-brand-50 p-3 text-sm text-brand-900">
              Minimum order for {state} is {formatINR(minimum)}. Add {formatINR(shortBy)} more.
            </p>
          ) : null}
          {error && <p role="alert" className="rounded-lg bg-sale-100 p-3 text-sm text-sale-600">{error}</p>}

          <button
            type="submit"
            disabled={pending || shortBy > 0 || blocked}
            className="w-full rounded-full bg-brand-600 py-3 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-200"
          >
            {pending ? 'Sending…' : `Send estimate · ${formatINR(total)}`}
          </button>
          <p className="text-xs text-muted">No payment now. We call you to confirm the order.</p>
        </form>
      </section>
    </div>
  )
}
