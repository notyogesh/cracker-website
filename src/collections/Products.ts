import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidateSite'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'mrp', 'inStock', 'contentStatus'],
    listSearchableFields: ['name', 'code'],
  },
  defaultSort: 'sortOrder',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    slugField('name'),
    {
      type: 'row',
      fields: [
        {
          name: 'code',
          type: 'text',
          admin: { description: 'Item code from the price list, e.g. GC-01.' },
        },
        {
          name: 'unit',
          type: 'text',
          required: true,
          defaultValue: '1 Box',
          admin: { description: 'What one quantity means, e.g. "1 Box (10 pcs)".' },
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'mrp',
          label: 'MRP (₹)',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'price',
          label: 'Selling price (₹)',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'productType',
              type: 'text',
              admin: {
                description: 'What it is in plain words, e.g. "Sound Cracker", "Flower Pot", "Sky Shot". Used in titles and URLs.',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'video',
              type: 'text',
              admin: { description: 'YouTube link to a short firing video (optional).' },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: { description: '80–150 words in your own words: what it does, what is in the pack, who it suits.' },
            },
            {
              name: 'contentStatus',
              type: 'select',
              defaultValue: 'draft',
              options: [
                { label: 'Draft – needs review', value: 'draft' },
                { label: 'Reviewed', value: 'reviewed' },
              ],
              admin: { description: 'Mark as reviewed once the description, specs and FAQ are checked.' },
            },
          ],
        },
        {
          label: 'Specs',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'packContents', type: 'text', admin: { description: 'e.g. "5 pieces per packet"' } },
                { name: 'effect', type: 'text', admin: { description: 'e.g. "Single loud bang", "Golden sparks, 6–8 ft"' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'shots', type: 'number', min: 1, admin: { description: 'Number of shots, for sky shots' } },
                { name: 'duration', type: 'text', admin: { description: 'e.g. "30–40 seconds". Leave empty if unsure.' } },
                { name: 'size', type: 'text', admin: { description: 'e.g. 3½ inch, 10 cm, ¼ kg' } },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'noiseLevel',
                  type: 'select',
                  options: [
                    { label: 'No sound', value: 'none' },
                    { label: 'Low', value: 'low' },
                    { label: 'Medium', value: 'medium' },
                    { label: 'Loud', value: 'loud' },
                  ],
                },
                {
                  name: 'ageGroup',
                  type: 'select',
                  options: [
                    { label: 'Kids (with adult supervision)', value: 'kids' },
                    { label: 'Family', value: 'family' },
                    { label: 'Adults only', value: 'adults' },
                  ],
                },
                { name: 'greenCracker', label: 'Green cracker', type: 'checkbox', defaultValue: false },
              ],
            },
            { name: 'manufacturer', type: 'text', admin: { description: 'Factory / brand on the pack, if known.' } },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faqs',
              label: 'Questions & answers',
              type: 'array',
              admin: { description: 'Shown on the product page and given to Google as FAQ data.' },
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO',
          fields: [
            {
              name: 'titleName',
              type: 'text',
              admin: {
                description: 'Name used in page titles, e.g. "3½" Parrot Sound Cracker". Leave empty to use the product name.',
              },
            },
            {
              name: 'seoTitle',
              type: 'text',
              admin: { description: 'Leave empty to build one automatically from name, type and price.' },
            },
            {
              name: 'seoDescription',
              type: 'textarea',
              maxLength: 170,
              admin: { description: 'Up to ~155 characters. Leave empty to use the start of the description.' },
            },
            {
              name: 'oldSlugs',
              type: 'text',
              hasMany: true,
              admin: { description: 'Previous URLs of this product. Visitors to them are redirected here.' },
            },
          ],
        },
      ],
    },
    {
      name: 'inStock',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on the home page.' },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
