// src/collections/SermonSeries.ts
import type { CollectionConfig } from 'payload'
import { SEOFields } from '../fields/seo'
import { userHasRole } from '../access/roles' // ✅ needed for proper multi-role check

export const SermonSeries: CollectionConfig = {
  slug: 'sermon-series',

  labels: {
    singular: 'Sermon Series',
    plural: 'Sermon Series',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Content',
  },

  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,

    // ❗ FIXED: multi-role admin check
    delete: ({ req }) => userHasRole(req, ['admin']),
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'description', type: 'textarea' },

    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'sermons', // S3 sermons bucket
    },

    // SEO group
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: Array.isArray(SEOFields) ? [...SEOFields] : [SEOFields],
    },
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
