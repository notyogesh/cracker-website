import type { Metadata } from 'next'

import { getSettings } from '@/lib/payload'
import { CartView } from './CartView'

export const metadata: Metadata = {
  title: 'Your estimate',
  robots: { index: false },
}

export default async function CartPage() {
  const settings = await getSettings()
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-extrabold text-brand-800">Your estimate</h1>
      <CartView
        minOrderHomeState={settings.minOrderHomeState}
        minOrderOtherStates={settings.minOrderOtherStates}
        blockedStates={settings.blockedStates ?? []}
      />
    </div>
  )
}
