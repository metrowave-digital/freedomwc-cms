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
    defaultColumns: ['title', 'date', 'visibility'],
  },

  access: {
    read: publicRead,
    create: allowRoles(['admin', 'pastor', 'leader', 'staff']),
    update: allowRoles(['admin', 'pastor', 'leader', 'staff']),
    delete: allowRoles(['admin']),
  },

  fields: [
    /* ----------------------------------
       CORE CONTENT
    ---------------------------------- */
    { name: 'title', type: 'text', required: true },

    { name: 'slug', type: 'text', unique: true },

    {
      name: 'scripture',
      type: 'text',
      admin: {
        description: 'Primary scripture reference',
      },
    },

    {
      name: 'body',
      type: 'richText',
      required: true,
    },

    {
      name: 'reflectionPrompt',
      type: 'textarea',
      admin: {
        description: 'Optional prompt for journaling or reflection.',
      },
    },

    /* ----------------------------------
       AUTHORSHIP
    ---------------------------------- */
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
    },

    {
      name: 'date',
      type: 'date',
      required: true,
    },

    /* ----------------------------------
       FORMATION WIRING (OPTIONAL)
    ---------------------------------- */
    {
      name: 'formationPractices',
      type: 'relationship',
      relationTo: 'formation-practices',
      hasMany: true,
    },

    {
      name: 'pathwaysPhases',
      type: 'relationship',
      relationTo: 'pathways-phases',
      hasMany: true,
    },

    /* ----------------------------------
       MEDIA / RESOURCES
    ---------------------------------- */
    {
      name: 'relatedResources',
      type: 'relationship',
      relationTo: 'resources',
      hasMany: true,
    },

    /* ----------------------------------
       VISIBILITY
    ---------------------------------- */
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Members Only', value: 'members' },
        { label: 'Leaders Only', value: 'leaders' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    /* ----------------------------------
       SEO
    ---------------------------------- */
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
