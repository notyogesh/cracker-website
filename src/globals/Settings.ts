import type { GlobalConfig } from 'payload'

import { revalidateGlobal } from '@/hooks/revalidateSite'
import { INDIAN_STATES } from '@/lib/states'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'Shop settings',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'shopName', type: 'text', required: true, defaultValue: 'Sivakasi Crackers' },
        { name: 'tagline', type: 'text', defaultValue: 'Direct from Sivakasi at wholesale prices' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', required: true, defaultValue: '+91 97878 20695' },
        {
          name: 'whatsapp',
          type: 'text',
          required: true,
          defaultValue: '919787820695',
          admin: { description: 'Country code + number, digits only. Estimates are sent here.' },
        },
        { name: 'email', type: 'email' },
      ],
    },
    {
      name: 'address',
      type: 'textarea',
      defaultValue: 'Sivakasi, Virudhunagar District, Tamil Nadu 626123',
    },
    {
      type: 'row',
      fields: [
        { name: 'city', type: 'text', defaultValue: 'Sivakasi' },
        { name: 'pincode', type: 'text', defaultValue: '626123' },
        { name: 'licenseNumber', label: 'PESO licence no.', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'minOrderHomeState',
          label: 'Minimum order, Tamil Nadu (₹)',
          type: 'number',
          required: true,
          defaultValue: 3000,
        },
        {
          name: 'minOrderOtherStates',
          label: 'Minimum order, other states (₹)',
          type: 'number',
          required: true,
          defaultValue: 5000,
        },
      ],
    },
    {
      name: 'blockedStates',
      type: 'select',
      hasMany: true,
      options: INDIAN_STATES.map((s) => ({ label: s, value: s })),
      admin: {
        description: 'States you cannot deliver to (bans, green-crackers-only rules, etc.).',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'returnsAccepted',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Shown to Google as your return policy. Crackers are usually non-returnable.' },
        },
        {
          name: 'returnDays',
          type: 'number',
          min: 1,
          admin: { description: 'Days allowed for returns, if accepted.', condition: (data) => Boolean(data?.returnsAccepted) },
        },
      ],
    },
    {
      name: 'announcement',
      type: 'text',
      defaultValue: 'Diwali 2026 sale is live. Up to 80% off MRP.',
    },
  ],
}
