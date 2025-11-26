// collections/APIKeys.ts
import type { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const APIKeys: CollectionConfig = {
  slug: 'api-keys',

  labels: {
    singular: 'API Key',
    plural: 'API Keys',
  },

  admin: {
    useAsTitle: 'label',
    group: 'Access',
  },

  access: {
    read: () => false,

    create: ({ req }) => Boolean(req.user?.roles?.includes('admin')),

    update: ({ req }) => Boolean(req.user?.roles?.includes('admin')),

    delete: ({ req }) => Boolean(req.user?.roles?.includes('admin')),
  },

  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },

    {
      name: 'key',
      type: 'text',
      required: true,
      admin: { readOnly: true },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (!data) return data
            if (!data.key) {
              data.key = crypto.randomUUID().replace(/-/g, '')
            }
            return data
          },
        ],
      },
    },

    // ⭐ THIS WAS MISSING
    {
      name: 'apiTags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
