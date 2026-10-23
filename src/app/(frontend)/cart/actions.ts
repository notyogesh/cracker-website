'use server'

import { minOrderFor, normalisePhone } from '@/lib/estimate'
import { formatINR } from '@/lib/format'
import { getPayloadClient, getSettings } from '@/lib/payload'
import { INDIAN_STATES } from '@/lib/states'

export type EstimateInput = {
  lines: { id: number; quantity: number }[]
  customerName: string
  phone: string
  email?: string
  address: string
  city: string
  state: string
  pincode: string
  notes?: string
}

export type EstimateResult =
  | { ok: true; orderNumber: string }
  | { ok: false; error: string; fieldErrors?: Partial<Record<keyof EstimateInput, string>> }

const clean = (v: unknown, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function placeEstimate(input: EstimateInput): Promise<EstimateResult> {
  const fieldErrors: Partial<Record<keyof EstimateInput, string>> = {}
  const customerName = clean(input.customerName, 100)
  const phone = normalisePhone(clean(input.phone, 20))
  const email = clean(input.email, 120)
  const address = clean(input.address, 500)
  const city = clean(input.city, 80)
  const state = clean(input.state, 80)
  const pincode = clean(input.pincode, 6)
  const notes = clean(input.notes, 1000)

  if (!customerName) fieldErrors.customerName = 'Enter your name.'
  if (!phone) fieldErrors.phone = 'Enter a valid 10-digit mobile number.'
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = 'Enter a valid email or leave it empty.'
  if (!address) fieldErrors.address = 'Enter your delivery address.'
  if (!city) fieldErrors.city = 'Enter your city.'
  if (!(INDIAN_STATES as readonly string[]).includes(state)) fieldErrors.state = 'Choose your state.'
  if (!/^\d{6}$/.test(pincode)) fieldErrors.pincode = 'Enter a 6-digit pincode.'
  if (Object.keys(fieldErrors).length) {
    return { ok: false, error: 'Please fix the highlighted fields.', fieldErrors }
  }

  const settings = await getSettings()
  if (settings.blockedStates?.includes(state as never)) {
    return {
      ok: false,
      error: `Sorry, we can't deliver crackers to ${state} because of local regulations.`,
      fieldErrors: { state: 'Delivery not available in this state.' },
    }
  }

  const quantities = new Map<number, number>()
  for (const line of Array.isArray(input.lines) ? input.lines : []) {
    const id = Number(line?.id)
    const qty = Math.floor(Number(line?.quantity))
    if (Number.isInteger(id) && qty >= 1 && qty <= 999) quantities.set(id, qty)
  }
  if (quantities.size === 0) return { ok: false, error: 'Your cart is empty.' }

  // Prices always come from the database, never from the browser.
  const payload = await getPayloadClient()
  const { docs: products } = await payload.find({
    collection: 'products',
    where: { id: { in: [...quantities.keys()] } },
    limit: quantities.size,
    depth: 0,
  })

  const unavailable = products.filter((p) => !p.inStock).map((p) => p.name)
  if (unavailable.length) {
    return { ok: false, error: `Now out of stock, please remove: ${unavailable.join(', ')}.` }
  }
  if (products.length !== quantities.size) {
    return { ok: false, error: 'Some items in your cart are no longer sold. Please refresh the cart.' }
  }

  const items = products.map((p) => {
    const quantity = quantities.get(p.id)!
    return {
      product: p.id,
      name: p.name,
      unit: p.unit,
      mrp: p.mrp,
      price: p.price,
      quantity,
      lineTotal: p.price * quantity,
    }
  })
  const total = items.reduce((n, i) => n + i.lineTotal, 0)
  const mrpTotal = items.reduce((n, i) => n + i.mrp * i.quantity, 0)

  const minimum = minOrderFor(state, settings)
  if (total < minimum) {
    return {
      ok: false,
      error: `Minimum order for ${state} is ${formatINR(minimum)}. Add ${formatINR(minimum - total)} more.`,
    }
  }

  const order = await payload.create({
    collection: 'orders',
    overrideAccess: true,
    data: {
      customerName,
      phone: phone!,
      email: email || undefined,
      address,
      city,
      state: state as (typeof INDIAN_STATES)[number],
      pincode,
      notes: notes || undefined,
      items,
      total,
      mrpTotal,
      status: 'new',
    },
  })

  return { ok: true, orderNumber: order.orderNumber! }
}
