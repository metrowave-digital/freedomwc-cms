// src/collections/Tags.ts
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  labels: {
    singular: 'Tag',
    plural: 'Tags',
  },

  admin: {
    group: 'Content',
    useAsTitle: 'name',
  },

  access: {
    read: () => true,
    create: ({ req }) =>
      !!req.user?.roles?.some((r) => ['admin', 'pastor', 'leader', 'staff'].includes(r)),
    update: ({ req }) =>
      !!req.user?.roles?.some((r) => ['admin', 'pastor', 'leader', 'staff'].includes(r)),
    delete: ({ req }) => !!req.user?.roles?.includes('admin'),
  },

  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
  ],

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data // FIXED

        if (!data.slug && data.name) {
          data.slug = data.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/(^-|-$)/g, '')
        }

        return data
      },
    ],
  },
}
