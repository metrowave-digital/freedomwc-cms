import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const Sessions: CollectionConfig = {
  slug: 'sessions',

  labels: {
    singular: 'Session',
    plural: 'Sessions',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Pathways & Courses',
    defaultColumns: ['title', 'sessionType', 'startDateTime', 'course', 'cohort'],
  },

  access: {
    read: () => true,

    create: ({ req }) => hasRoleAtLeast(req, 'instructor'),
    update: ({ req }) => hasRoleAtLeast(req, 'instructor'),
    delete: ({ req }) => hasRoleAtLeast(req, 'admin'),
  },

  fields: [
    /* =====================================================
       CORE IDENTITY
    ===================================================== */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'sessionType',
      type: 'select',
      required: true,
      options: [
        { label: 'Course Class', value: 'course' },
        { label: 'Cohort Gathering', value: 'cohort' },
        { label: 'Weekly Experience', value: 'weekly-experience' },
        { label: 'Workshop / Intensive', value: 'workshop' },
      ],
    },

    /* =====================================================
       CONTEXT LINKS (ONE REQUIRED)
    ===================================================== */
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      admin: {
        condition: (_, data) => data?.sessionType === 'course',
      },
    },

    {
      name: 'cohort',
      type: 'relationship',
      relationTo: 'cohorts',
      admin: {
        condition: (_, data) => ['cohort', 'weekly-experience'].includes(data?.sessionType),
      },
    },

    {
      name: 'weeklyExperience',
      type: 'relationship',
      relationTo: 'weekly-experiences',
      admin: {
        condition: (_, data) => data?.sessionType === 'weekly-experience',
      },
    },

    /* =====================================================
       TIME & LOCATION
    ===================================================== */
    {
      name: 'startDateTime',
      type: 'date',
      required: true,
    },

    {
      name: 'endDateTime',
      type: 'date',
    },

    {
      name: 'deliveryMode',
      type: 'select',
      defaultValue: 'in-person',
      options: [
        { label: 'In Person', value: 'in-person' },
        { label: 'Virtual', value: 'virtual' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
    },

    {
      name: 'location',
      type: 'text',
    },

    {
      name: 'virtualLink',
      type: 'text',
    },

    /* =====================================================
       LEADERSHIP
    ===================================================== */
    {
      name: 'facilitators',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
    },

    /* =====================================================
       ATTENDANCE CONTROL
    ===================================================== */
    {
      name: 'attendanceRequired',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'If false, attendance will not affect progress.',
      },
    },

    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
