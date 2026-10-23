const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export const formatINR = (value: number) => inr.format(Math.round(value))

export const discountPercent = (mrp: number, price: number) =>
  mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0

export const siteURL = () => (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
