import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

// Catalog edits in the admin show up on the storefront straight away instead of
// waiting for the hourly revalidate. Skipped outside Next (e.g. the seed script).
const revalidateAll = () => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Not running inside a Next.js request.
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidateAll()
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateAll()
  return doc
}

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc }) => {
  revalidateAll()
  return doc
}
