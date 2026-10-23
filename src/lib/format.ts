const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export const formatINR = (value: number) => inr.format(Math.round(value))

export const discountPercent = (mrp: number, price: number) =>
  mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0

// NEXT_PUBLIC_SITE_URL wins if set; on Vercel fall back to the production
// domain it provides (switches to a custom domain automatically).
export const siteURL = () =>
  (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    'http://localhost:3000'
  ).replace(/\/$/, '')

// Uploads are relative (/api/media/…) locally and full Blob URLs in production.
export const absoluteURL = (url: string) => (/^https?:\/\//.test(url) ? url : `${siteURL()}${url}`)
