// collections/APIKeys.ts
import type { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const APIKeys: CollectionConfig = {
  slug: 'api-keys',

  access: {
    read: () => false, // No one can publicly read API keys

    create: ({ req }) => {
      // Prevent undefined return
      return Boolean(req.user && Array.isArray(req.user.roles) && req.user.roles.includes('admin'))
    },

    update: ({ req }) => {
      return Boolean(req.user && Array.isArray(req.user.roles) && req.user.roles.includes('admin'))
    },

    delete: ({ req }) => {
      return Boolean(req.user && Array.isArray(req.user.roles) && req.user.roles.includes('admin'))
    },
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
      admin: {
        readOnly: true,
      },

      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (!data) return data // fix undefined warning
            if (!data.key) {
              data.key = crypto.randomUUID().replace(/-/g, '')
            }
            return data
          },
        ],
      },
    },
  ],
}
