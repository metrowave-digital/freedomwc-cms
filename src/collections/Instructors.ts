import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const Instructors: CollectionConfig = {
  slug: 'instructors',

  labels: {
    singular: 'Instructor',
    plural: 'Instructors',
  },

  admin: {
    useAsTitle: 'id',
    group: 'Education',
    defaultColumns: ['profile', 'updatedAt'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => hasRoleAtLeast(req, 'leader'),
    update: ({ req }) => hasRoleAtLeast(req, 'leader'),
    delete: ({ req }) => hasRoleAtLeast(req, 'admin'),
  },

  fields: [
    /* -----------------------------
       LINK TO PERSON
    ----------------------------- */
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      unique: true,
    },

    /* -----------------------------
       TEACHING RESPONSIBILITY
    ----------------------------- */
    {
      name: 'coursesTaught',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
    },

    {
      name: 'credentials',
      type: 'relationship',
      relationTo: 'credentials',
      hasMany: true,
    },

    {
      name: 'instructorNotes',
      type: 'textarea',
    },
  ],
}
