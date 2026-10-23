import type { CollectionConfig } from 'payload'

import { INDIAN_STATES } from '@/lib/states'

// Estimates placed from the cart. The storefront creates them through a server
// action with prices re-read from the database, so the public API is closed.
export const Orders: CollectionConfig = {
  slug: 'orders',
  labels: { singular: 'Estimate', plural: 'Estimates' },
  admin: {
    useAsTitle: 'orderNumber',
    defaultColumns: ['orderNumber', 'customerName', 'phone', 'state', 'total', 'status', 'createdAt'],
    listSearchableFields: ['orderNumber', 'customerName', 'phone'],
  },
  defaultSort: '-createdAt',
  access: {
    create: ({ req }) => Boolean(req.user),
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'orderNumber',
      type: 'text',
      unique: true,
      index: true,
      admin: { readOnly: true, position: 'sidebar' },
      hooks: {
        beforeValidate: [
          ({ value, operation }) => {
            if (value || operation !== 'create') return value
            const date = new Date().toISOString().slice(2, 10).replace(/-/g, '')
            const rand = Math.floor(1000 + Math.random() * 9000)
            return `CS${date}${rand}`
          },
        ],
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Confirmed with customer', value: 'confirmed' },
        { label: 'Payment received', value: 'paid' },
        { label: 'Dispatched', value: 'dispatched' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'collapsible',
      label: 'Customer',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'customerName', type: 'text', required: true },
            { name: 'phone', type: 'text', required: true },
            { name: 'email', type: 'email' },
          ],
        },
        { name: 'address', type: 'textarea', required: true },
        {
          type: 'row',
          fields: [
            { name: 'city', type: 'text', required: true },
            {
              name: 'state',
              type: 'select',
              required: true,
              options: INDIAN_STATES.map((s) => ({ label: s, value: s })),
            },
            { name: 'pincode', type: 'text', required: true },
          ],
        },
        { name: 'notes', type: 'textarea' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'product', type: 'relationship', relationTo: 'products' },
            { name: 'name', type: 'text', required: true },
            { name: 'unit', type: 'text' },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'mrp', type: 'number', required: true },
            { name: 'price', type: 'number', required: true },
            { name: 'quantity', type: 'number', required: true, min: 1 },
            { name: 'lineTotal', type: 'number', required: true },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'mrpTotal', label: 'MRP total (₹)', type: 'number', required: true },
        { name: 'total', label: 'Net total (₹)', type: 'number', required: true },
      ],
    },
  ],
}
