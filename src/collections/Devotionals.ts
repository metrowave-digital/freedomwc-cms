// src/collections/Devotionals.ts
import type { CollectionConfig } from 'payload'
import { publicRead, allowRoles } from '../access/control'
import { SEOFields } from '../fields/seo'

export const Devotionals: CollectionConfig = {
  slug: 'devotionals',
  labels: {
    singular: 'Devotional',
    plural: 'Devotionals',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },

  access: {
    read: publicRead,
    create: allowRoles(['admin', 'pastor', 'leader', 'staff']),
    update: allowRoles(['admin', 'pastor', 'leader', 'staff']),
    delete: allowRoles(['admin']),
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'scripture', type: 'text' },
    { name: 'body', type: 'richText', required: true },

    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },

    { name: 'date', type: 'date', required: true },

    ...(Array.isArray(SEOFields) ? SEOFields : [SEOFields]),
  ],

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data

        if (!data.slug && data.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }

        return data
      },
    ],
  },
}
