import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const Mentors: CollectionConfig = {
  slug: 'mentors',

  labels: {
    singular: 'Mentor',
    plural: 'Mentors',
  },

  admin: {
    useAsTitle: 'id',
    group: 'Leadership',
    defaultColumns: ['profile', 'availability'],
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
       MENTOR ASSIGNMENTS
    ----------------------------- */
    {
      name: 'assignedCohorts',
      type: 'relationship',
      relationTo: 'cohorts',
      hasMany: true,
    },

    {
      name: 'assignedLearners',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      admin: {
        description: 'Profiles this mentor is directly responsible for.',
      },
    },

    /* -----------------------------
       CAPACITY
    ----------------------------- */
    {
      name: 'availability',
      type: 'select',
      defaultValue: 'moderate',
      options: [
        { label: 'Limited', value: 'limited' },
        { label: 'Moderate', value: 'moderate' },
        { label: 'Open', value: 'open' },
      ],
    },

    {
      name: 'mentorNotes',
      type: 'textarea',
    },
  ],
}
