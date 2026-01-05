import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const Announcements: CollectionConfig = {
  slug: 'announcements',

  labels: {
    singular: 'Announcement',
    plural: 'Announcements',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Communications',
    defaultColumns: ['title', 'audience', 'priority', 'startDate', 'endDate'],
  },

  access: {
    read: () => true,

    create: ({ req }) => hasRoleAtLeast(req, 'staff'),
    update: ({ req }) => hasRoleAtLeast(req, 'staff'),
    delete: ({ req }) => hasRoleAtLeast(req, 'admin'),
  },

  fields: [
    /* =====================================================
       CORE CONTENT
    ===================================================== */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'message',
      type: 'richText',
      required: true,
    },

    {
      name: 'priority',
      type: 'select',
      defaultValue: 'normal',
      options: [
        { label: 'Low', value: 'low' },
        { label: 'Normal', value: 'normal' },
        { label: 'High', value: 'high' },
        { label: 'Urgent', value: 'urgent' },
      ],
    },

    /* =====================================================
       AUDIENCE TARGETING
    ===================================================== */
    {
      name: 'audience',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: 'Everyone', value: 'all' },
        { label: 'Members', value: 'members' },
        { label: 'Leaders', value: 'leaders' },
        { label: 'Students / Learners', value: 'learners' },
        { label: 'Mentors', value: 'mentors' },
        { label: 'Instructors', value: 'instructors' },
      ],
    },

    {
      name: 'relatedMinistries',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Worship', value: 'worship' },
        { label: 'Youth', value: 'youth' },
        { label: 'Outreach', value: 'outreach' },
        { label: 'Prayer Team', value: 'prayer' },
        { label: 'Media', value: 'media' },
      ],
    },

    /* =====================================================
       OPTIONAL CONTEXT
    ===================================================== */
    {
      name: 'relatedCourse',
      type: 'relationship',
      relationTo: 'courses',
    },

    {
      name: 'relatedPathwayPhase',
      type: 'relationship',
      relationTo: 'pathways-phases',
    },

    /* =====================================================
       DISPLAY CONTROL
    ===================================================== */
    {
      name: 'displayLocations',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Homepage Banner', value: 'homepage' },
        { label: 'Church Dashboard', value: 'church-dashboard' },
        { label: 'LMS Dashboard', value: 'lms-dashboard' },
        { label: 'Pathways Page', value: 'pathways' },
        { label: 'Email Digest', value: 'email' },
      ],
    },

    /* =====================================================
       SCHEDULING
    ===================================================== */
    {
      name: 'startDate',
      type: 'date',
    },

    {
      name: 'endDate',
      type: 'date',
    },

    /* =====================================================
       STATUS
    ===================================================== */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Expired', value: 'expired' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
}
