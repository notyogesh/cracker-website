import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'

import { Breadcrumbs } from '@/components/Breadcrumbs'
import { BuyOnWhatsApp } from '@/components/BuyOnWhatsApp'
import { QuantityInput } from '@/components/cart/QuantityInput'
import { JsonLd } from '@/components/JsonLd'
import { ProductCard, ProductImage, toCartProduct } from '@/components/ProductCard'
import { discountPercent, formatINR, siteURL } from '@/lib/format'
import {
  categoryOf,
  getProductByOldSlug,
  getProductBySlug,
  getProducts,
  getSettings,
  mediaOf,
} from '@/lib/payload'
import { productMetaDescription, productSpecs, productTitle, youtubeId } from '@/lib/productSeo'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((p) => ({ slug: p.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  const image = mediaOf(product.image)
  const title = productTitle(product)
  const description = productMetaDescription(product)
  return {
    title,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `/product/${product.slug}`,
      ...(image?.url ? { images: [{ url: image.url, width: image.width ?? undefined, height: image.height ?? undefined, alt: image.alt }] } : {}),
    },
  }
}

// Offers are valid for the current season; Google asks for an end date.
const endOfYear = () => `${new Date().getFullYear()}-12-31`

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) {
    const moved = await getProductByOldSlug(slug)
    if (moved?.slug) permanentRedirect(`/product/${moved.slug}`)
    notFound()
  }
  const category = categoryOf(product)
  const [settings, siblings] = await Promise.all([
    getSettings(),
    category ? getProducts({ categoryId: category.id }) : Promise.resolve([]),
  ])
  const related = siblings.filter((p) => p.id !== product.id).slice(0, 4)
  const off = discountPercent(product.mrp, product.price)
  const image = mediaOf(product.image)
  const url = `${siteURL()}/product/${product.slug}`
  const specs = productSpecs(product, category?.name)
  const faqs = product.faqs ?? []
  const video = youtubeId(product.video)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumbs
        items={[
          ...(category ? [{ name: category.name, href: `/category/${category.slug}` }] : []),
          { name: product.name, href: `/product/${product.slug}` },
        ]}
      />
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl border border-brand-100 bg-white">
          <ProductImage product={product} sizes="(max-width: 768px) 100vw, 50vw" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-brand-800">{product.name}</h1>
          <p className="mt-1 text-muted">
            {product.productType && <>{product.productType} · </>}
            {product.packContents || product.unit}
          </p>
          <p className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-800">{formatINR(product.price)}</span>
            {off > 0 && (
              <>
                <span className="text-lg text-muted line-through">{formatINR(product.mrp)}</span>
                <span className="rounded-md bg-sale-100 px-2 py-0.5 text-sm font-bold text-sale-600">{off}% off</span>
              </>
            )}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QuantityInput product={toCartProduct(product)} disabled={!product.inStock} />
            {product.inStock && <BuyOnWhatsApp product={product} />}
          </div>
          {product.description && <p className="mt-6 whitespace-pre-line leading-relaxed text-ink">{product.description}</p>}
          <p className="mt-6 rounded-lg bg-brand-50 p-4 text-sm text-brand-900">
            Minimum order ₹{settings.minOrderHomeState} in Tamil Nadu and ₹{settings.minOrderOtherStates} for other
            states. We confirm every estimate by phone before dispatch.
          </p>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        {specs.length > 0 && (
          <section aria-labelledby="specs-heading">
            <h2 id="specs-heading" className="text-xl font-bold text-brand-800">
              {product.name} specifications
            </h2>
            <table className="mt-4 w-full overflow-hidden rounded-xl border border-brand-100 bg-white text-sm">
              <tbody className="divide-y divide-brand-50">
                {specs.map(([label, value]) => (
                  <tr key={label}>
                    <th scope="row" className="w-40 bg-brand-50 px-4 py-2.5 text-left font-medium text-muted">
                      {label}
                    </th>
                    <td className="px-4 py-2.5 text-ink">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {faqs.length > 0 && (
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-xl font-bold text-brand-800">
              Questions about {product.name}
            </h2>
            <div className="mt-4 divide-y divide-brand-100 rounded-xl border border-brand-100 bg-white">
              {faqs.map((f, i) => (
                <details key={f.id ?? i} className="group px-4 py-3" open={i === 0}>
                  <summary className="cursor-pointer list-none font-semibold text-ink marker:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {f.question}
                      <span aria-hidden="true" className="text-brand-600 transition group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}
      </div>

      {video && (
        <section aria-labelledby="video-heading" className="mt-12">
          <h2 id="video-heading" className="text-xl font-bold text-brand-800">Watch {product.name}</h2>
          <div className="mt-4 aspect-video max-w-3xl overflow-hidden rounded-xl bg-black">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video}`}
              title={`${product.name} video`}
              loading="lazy"
              allow="accelerometer; encrypted-media; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="mt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold text-brand-800">More {category?.name}</h2>
            <p className="text-sm">
              <Link href={`/category/${category?.slug}`} className="text-brand-700 hover:underline">
                See all {category?.name}
              </Link>
              <span className="mx-2 text-brand-200">|</span>
              <Link href="/price-list" className="text-brand-700 hover:underline">
                Full price list
              </Link>
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          '@id': `${url}#product`,
          name: product.titleName || product.name,
          url,
          ...(product.code ? { sku: product.code } : {}),
          ...(product.description ? { description: product.description } : {}),
          ...(image?.url ? { image: [`${siteURL()}${image.url}`] } : {}),
          ...(category ? { category: category.name } : {}),
          ...(product.manufacturer ? { brand: { '@type': 'Brand', name: product.manufacturer } } : {}),
          ...(specs.length
            ? {
                additionalProperty: specs
                  .filter(([label]) => !['Category', 'Item code', 'Manufacturer'].includes(label))
                  .map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
              }
            : {}),
          offers: {
            '@type': 'Offer',
            url,
            priceCurrency: 'INR',
            price: product.price,
            priceValidUntil: endOfYear(),
            itemCondition: 'https://schema.org/NewCondition',
            availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: { '@id': `${siteURL()}/#store` },
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'IN',
              ...(settings.returnsAccepted
                ? {
                    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                    merchantReturnDays: settings.returnDays ?? 7,
                  }
                : { returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted' }),
            },
          },
        }}
      />
      {faqs.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.question,
              acceptedAnswer: { '@type': 'Answer', text: f.answer },
            })),
          }}
        />
      )}
    </div>
  )
}
