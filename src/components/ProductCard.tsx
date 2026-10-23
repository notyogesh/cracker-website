import Image from 'next/image'
import Link from 'next/link'

import type { Product } from '@/payload-types'
import { discountPercent, formatINR } from '@/lib/format'
import { mediaOf } from '@/lib/payload'
import { BuyOnWhatsApp } from './BuyOnWhatsApp'
import { BurstIcon } from './Logo'
import { QuantityInput } from './cart/QuantityInput'

export const toCartProduct = (p: Product) => ({
  id: p.id,
  name: p.name,
  slug: p.slug ?? String(p.id),
  unit: p.unit,
  mrp: p.mrp,
  price: p.price,
})

export function ProductImage({ product, sizes }: { product: Product; sizes: string }) {
  const image = mediaOf(product.image)
  if (image?.url) {
    return (
      <Image
        src={image.url}
        alt={image.alt || product.name}
        fill
        sizes={sizes}
        className="object-contain"
      />
    )
  }
  return (
    <div aria-hidden="true" className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
      <BurstIcon className="h-1/3 w-1/3 text-brand-300" />
    </div>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.mrp, product.price)
  return (
    <article className="group flex flex-col rounded-3xl bg-brand-50 p-2.5 ring-1 ring-brand-100 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-600/10">
      <Link href={`/product/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-2xl bg-white">
        <ProductImage product={product} sizes="(max-width: 640px) 50vw, 25vw" />
        {off > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-sale-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            {off}% OFF
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 px-1.5 pb-1 pt-3">
        {product.productType && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-500">{product.productType}</p>
        )}
        <h3 className="font-display text-base font-semibold leading-snug text-ink">
          <Link href={`/product/${product.slug}`} className="hover:text-brand-600">
            {product.name}
          </Link>
        </h3>
        <p className="text-xs text-muted">{product.unit}</p>
        <p className="mt-auto pt-1">
          <span className="text-xl font-bold text-brand-700">{formatINR(product.price)}</span>{' '}
          {off > 0 && <span className="text-xs text-muted line-through">{formatINR(product.mrp)}</span>}
        </p>
        <QuantityInput product={toCartProduct(product)} disabled={!product.inStock} size="sm" />
        {product.inStock && <BuyOnWhatsApp product={product} size="sm" />}
      </div>
    </article>
  )
}
