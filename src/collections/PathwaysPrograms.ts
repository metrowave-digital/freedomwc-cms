import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const PathwaysPrograms: CollectionConfig = {
  slug: 'pathways-programs',

  labels: {
    singular: 'Pathways Program',
    plural: 'Pathways Programs',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Pathways',
    defaultColumns: ['title', 'status', 'updatedAt'],
  },

  access: {
    read: () => true, // programs are visible publicly
    create: ({ req }) => hasRoleAtLeast(req, 'leader'),
    update: ({ req }) => hasRoleAtLeast(req, 'leader'),
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
      admin: {
        description: 'Example: "Pathways Discipleship Journey"',
      },
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        description: 'URL-safe identifier (manual or generated).',
      },
    },

    {
      name: 'description',
      type: 'richText',
    },

    /* =====================================================
       AUDIENCE & PURPOSE
    ===================================================== */
    {
      name: 'targetAudience',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'New Believers', value: 'new-believers' },
        { label: 'Members', value: 'members' },
        { label: 'Leaders', value: 'leaders' },
        { label: 'Ministry Teams', value: 'ministry' },
        { label: 'General', value: 'general' },
      ],
    },

    {
      name: 'spiritualFocus',
      type: 'textarea',
      admin: {
        description: 'Spiritual intent of this program (formation goal, not curriculum).',
      },
    },

    /* =====================================================
       STRUCTURE
    ===================================================== */
    {
      name: 'phases',
      type: 'relationship',
      relationTo: 'pathways-phases',
      hasMany: true,
      admin: {
        description: 'Ordered phases that make up this Pathways program.',
      },
    },

    {
      name: 'estimatedDurationWeeks',
      type: 'number',
      min: 1,
    },

    /* =====================================================
       GOVERNANCE
    ===================================================== */
    {
      name: 'requiresEnrollment',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'If enabled, users must be enrolled to participate.',
      },
    },

    {
      name: 'requiresMentor',
      type: 'checkbox',
      defaultValue: false,
    },

    /* =====================================================
       STATUS
    ===================================================== */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
}
