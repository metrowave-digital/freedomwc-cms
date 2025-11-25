// src/collections/Sermons.ts

import type { CollectionConfig } from 'payload'
import { allowRoles, publicRead } from '../access/control'
import { SEOFields } from '../fields/seo'

export const Sermons: CollectionConfig = {
  slug: 'sermons-content',

  labels: {
    singular: 'Sermon',
    plural: 'Sermons',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'pastor', 'date', 'campus'],
  },

  access: {
    read: publicRead,
    create: allowRoles(['admin', 'pastor', 'leader', 'staff']),
    update: allowRoles(['admin', 'pastor', 'leader', 'staff']),
    delete: allowRoles(['admin']),
  },

  fields: [
    // Core metadata
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },

    // Pastor filter
    {
      name: 'pastor',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: { description: 'Only users with the "pastor" role appear here.' },
      filterOptions: () => ({
        roles: { contains: 'pastor' },
      }),
    },

    // Series
    {
      name: 'series',
      type: 'relationship',
      relationTo: 'sermon-series',
    },

    // Scripture
    { name: 'scripture', type: 'text' },

    // Tags
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
    },

    // Media (S3 — sermons bucket)
    {
      name: 'audio',
      type: 'upload',
      relationTo: 'sermons',
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'sermons',
    },
    {
      name: 'slides',
      type: 'upload',
      relationTo: 'sermons',
    },
    {
      name: 'transcript',
      type: 'upload',
      relationTo: 'sermons',
    },

    { name: 'duration', type: 'text' },

    // Date & Campus
    { name: 'date', type: 'date', required: true },
    {
      name: 'campus',
      type: 'select',
      required: true,
      options: [
        { label: 'Clarksville', value: 'clarksville' },
        { label: 'Murfreesboro', value: 'murfreesboro' },
        { label: 'Nashville', value: 'nashville' },
        { label: 'Online Only', value: 'online' },
      ],
    },

    // 🔥 UPDATED — Notes as a media file (PDF/DOCX/images/anything)
    {
      name: 'notes',
      type: 'upload',
      relationTo: 'sermons', // stays in the sermons S3 bucket
      admin: {
        description: 'Upload sermon notes (PDF, DOCX, images, etc.)',
      },
    },

    // Recommended sermons
    {
      name: 'recommended',
      type: 'relationship',
      relationTo: 'sermons-content',
      hasMany: true,
      admin: { description: 'Recommended sermons to show after watching.' },
    },

    // Status workflow
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Review', value: 'review' },
        { label: 'Published', value: 'published' },
      ],
    },

    // SEO
    {
      name: 'seo',
      label: 'SEO',
      type: 'group',
      fields: Array.isArray(SEOFields) ? [...SEOFields] : [SEOFields],
    },
  ],

  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data.slug) {
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
