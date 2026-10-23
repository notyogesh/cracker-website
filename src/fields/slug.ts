import type { Field } from 'payload'

export const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Unique, URL-safe slug that is filled from `source` when left empty.
export const slugField = (source: string): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: 'Leave empty to generate from the name.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.trim()) return toSlug(value)
        const from = data?.[source]
        return typeof from === 'string' ? toSlug(from) : value
      },
    ],
  },
})
