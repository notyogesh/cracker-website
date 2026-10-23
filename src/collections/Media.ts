import type { CollectionConfig } from 'payload'

// Every uploaded image (PNG, JPG, …) is stored as WebP, plus smaller WebP
// copies for cards and thumbnails. Converted with sharp, already a dependency.
const webp = { format: 'webp' as const, options: { quality: 82 } }

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image, e.g. "10 cm colour sparklers box". Used by Google and screen readers.' },
    },
  ],
  upload: {
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif'],
    // Keep originals at a sensible size; never upscale small images.
    resizeOptions: { width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true },
    formatOptions: webp,
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 300, fit: 'cover', formatOptions: webp },
      { name: 'card', width: 800, height: 800, fit: 'cover', formatOptions: webp },
      { name: 'hero', width: 1920, withoutEnlargement: true, formatOptions: webp },
    ],
    adminThumbnail: 'thumbnail',
  },
}
