// src/collections/BlogPosts.ts
import type { CollectionConfig } from 'payload'
import { publicRead, allowRoles } from '../access/control'
import { SEOFields } from '../fields/seo'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  labels: {
    singular: 'Blog Post',
    plural: 'Blog Posts',
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
    { name: 'excerpt', type: 'textarea' },
    { name: 'body', type: 'richText', required: true },

    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },

    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags', // FIX: tags slug must match Tags.ts
      hasMany: true,
    },

    { name: 'publishedAt', type: 'date' },

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
