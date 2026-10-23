import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { formatINR } from '@/lib/format'
import { getPayloadClient, getSettings } from '@/lib/payload'
import { whatsappLink } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Estimate received',
  robots: { index: false },
}

type Props = { params: Promise<{ orderNumber: string }> }

export default async function OrderPage({ params }: Props) {
  const { orderNumber } = await params
  const payload = await getPayloadClient()
  const [{ docs }, settings] = await Promise.all([
    payload.find({
      collection: 'orders',
      where: { orderNumber: { equals: orderNumber } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    }),
    getSettings(),
  ])
  const order = docs[0]
  if (!order) notFound()

  // Only the order number, items and totals are shown here; the address stays private.
  const message = [
    `Hi, I placed estimate ${order.orderNumber}.`,
    ...order.items.map((i) => `• ${i.name} × ${i.quantity} = ${formatINR(i.lineTotal)}`),
    `Total: ${formatINR(order.total)}`,
    `Name: ${order.customerName}, ${order.city}`,
  ].join('\n')
  const whatsapp = whatsappLink(settings.whatsapp, message)

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-emerald-200 bg-white p-6 text-center">
        <p className="text-4xl" aria-hidden="true">🎉</p>
        <h1 className="mt-2 text-2xl font-extrabold text-brand-800">Estimate received</h1>
        <p className="mt-2 text-muted">
          Your estimate number is <strong className="text-brand-800">{order.orderNumber}</strong>. We will call{' '}
          {order.customerName} shortly to confirm stock, transport and payment.
        </p>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white hover:bg-[#1ebe5b]"
        >
          Send on WhatsApp for faster confirmation
        </a>
      </div>

      <table className="mt-6 w-full rounded-xl bg-white text-sm">
        <thead className="text-left text-xs uppercase text-muted">
          <tr>
            <th scope="col" className="p-3">Item</th>
            <th scope="col" className="p-3 text-center">Qty</th>
            <th scope="col" className="p-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-brand-50">
          {order.items.map((i) => (
            <tr key={i.id}>
              <td className="p-3">{i.name} <span className="text-muted">({i.unit})</span></td>
              <td className="p-3 text-center">{i.quantity}</td>
              <td className="p-3 text-right">{formatINR(i.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="font-bold">
          <tr>
            <td className="p-3" colSpan={2}>Net total</td>
            <td className="p-3 text-right">{formatINR(order.total)}</td>
          </tr>
        </tfoot>
      </table>
      <p className="mt-6 text-center">
        <Link href="/" className="text-brand-700 hover:underline">Back to shop</Link>
      </p>
    </div>
  )
}
