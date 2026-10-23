import type { Product } from '@/payload-types'
import { formatINR, siteURL } from '@/lib/format'
import { getSettings } from '@/lib/payload'
import { whatsappLink } from '@/lib/whatsapp'
import { WhatsAppIcon } from './WhatsAppIcon'

// "Buy now" for a single product: opens WhatsApp with the product, price and
// page link already typed.
export async function BuyOnWhatsApp({ product, size = 'md' }: { product: Product; size?: 'icon' | 'sm' | 'md' }) {
  const settings = await getSettings()
  const message = [
    `Hi! I want to buy this:`,
    `${product.name} (${product.unit}) – ${formatINR(product.price)}`,
    `${siteURL()}/product/${product.slug}`,
  ].join('\n')

  if (size === 'icon') {
    return (
      <a
        href={whatsappLink(settings.whatsapp, message)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Buy ${product.name} on WhatsApp`}
        title="Buy now on WhatsApp"
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366] text-white hover:bg-[#1ebe5b]"
      >
        <WhatsAppIcon className="h-4 w-4" />
      </a>
    )
  }

  return (
    <a
      href={whatsappLink(settings.whatsapp, message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Buy ${product.name} on WhatsApp`}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] font-semibold text-white hover:bg-[#1ebe5b] ${
        size === 'sm' ? 'w-full px-3 py-2 text-xs' : 'px-6 py-3 text-base'
      }`}
    >
      <WhatsAppIcon className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      Buy now on WhatsApp
    </a>
  )
}
