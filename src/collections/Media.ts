// src/collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',

  labels: {
    singular: 'Media',
    plural: 'Media Library',
  },

  upload: {
    mimeTypes: [
      'image/*',
      'video/*',
      'audio/*',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    disableLocalStorage: true, // using S3/R2 only
  },

  admin: {
    useAsTitle: 'filename',
    group: 'System',
    defaultColumns: ['filename', 'mimeType', 'filesize', 'createdAt'],
  },

  access: {
    read: () => true,
    create: ({ req }) => !!req.user, // any logged-in user may upload
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user?.roles?.includes('admin'), // MUST wrap with !!
  },

  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },

    {
      name: 'visibility',
      type: 'select',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'LMS Private', value: 'private' },
      ],
      defaultValue: 'public',
    },
  ],
}
