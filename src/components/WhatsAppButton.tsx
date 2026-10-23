'use client'

import { usePathname } from 'next/navigation'

import { whatsappLink } from '@/lib/whatsapp'
import { useCart } from './cart/CartProvider'
import { WhatsAppIcon } from './WhatsAppIcon'

// Floating click-to-chat button. Sits above the cart bar when that is showing.
export function WhatsAppButton({ number }: { number: string }) {
  const { count, ready } = useCart()
  const pathname = usePathname()
  const cartBarVisible = ready && count > 0 && !pathname.startsWith('/cart') && !pathname.startsWith('/order')

  return (
    <a
      href={whatsappLink(number)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp to buy crackers"
      className={`group fixed right-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] p-3.5 text-white shadow-lg shadow-black/20 transition-all hover:bg-[#1ebe5b] sm:px-5 ${
        cartBarVisible ? 'bottom-24' : 'bottom-5'
      }`}
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="hidden text-sm font-semibold sm:inline">Buy on WhatsApp</span>
    </a>
  )
}
