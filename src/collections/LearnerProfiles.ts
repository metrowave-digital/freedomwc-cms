import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const LearnerProfiles: CollectionConfig = {
  slug: 'learner-profiles',

  labels: {
    singular: 'Learner Profile',
    plural: 'Learner Profiles',
  },

  admin: {
    useAsTitle: 'id',
    group: 'Education',
    defaultColumns: ['profile', 'updatedAt'],
  },

  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => hasRoleAtLeast(req, 'leader'),
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
       LMS STATE
    ----------------------------- */
    {
      name: 'enrolledCourses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
    },

    {
      name: 'activePathways',
      type: 'relationship',
      relationTo: 'pathways-programs',
      hasMany: true,
    },

    {
      name: 'credentialsEarned',
      type: 'relationship',
      relationTo: 'credentials',
      hasMany: true,
    },

    {
      name: 'learningGoals',
      type: 'textarea',
    },

    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal learning notes (not visible to learner by default).',
      },
    },
  ],
}
