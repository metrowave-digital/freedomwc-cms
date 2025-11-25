// src/collections/SermonsMedia.ts
import type { CollectionConfig } from 'payload'
import { userHasRole } from '../access/roles'

export const SermonsMedia: CollectionConfig = {
  slug: 'sermons', // MUST match your S3 adapter config

  labels: {
    singular: 'Sermon Media',
    plural: 'Sermon Media',
  },

  admin: {
    group: 'Uploads',
    useAsTitle: 'filename',
  },

  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => userHasRole(req, ['admin']),
  },

  upload: {
    // ❗ staticURL / staticDir removed — not valid in Payload v3 + S3
    mimeTypes: [
      'audio/mpeg',
      'audio/mp3',
      'video/mp4',
      'audio/wav',
      'audio/x-m4a',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg',
    ],
  },

  fields: [{ name: 'alt', type: 'text' }],
}
