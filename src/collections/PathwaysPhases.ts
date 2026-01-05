import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const PathwaysPhases: CollectionConfig = {
  slug: 'pathways-phases',

  labels: {
    singular: 'Pathways Phase',
    plural: 'Pathways Phases',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Pathways',
    defaultColumns: ['title', 'program', 'order', 'updatedAt'],
  },

  access: {
    read: () => true,
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
        description: 'Example: "Phase 1 – Restore"',
      },
    },

    {
      name: 'order',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'Controls progression order within the program.',
      },
    },

    {
      name: 'program',
      type: 'relationship',
      relationTo: 'pathways-programs',
      required: true,
      index: true,
    },

    {
      name: 'theme',
      type: 'text',
      admin: {
        description: 'Theme word or phrase (e.g. Healing, Identity, Calling).',
      },
    },

    {
      name: 'description',
      type: 'richText',
    },

    /* =====================================================
       LEARNING & PRACTICE
    ===================================================== */
    {
      name: 'requiredCourses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
    },

    {
      name: 'requiredModules',
      type: 'relationship',
      relationTo: 'modules',
      hasMany: true,
    },

    {
      name: 'requiredLessons',
      type: 'relationship',
      relationTo: 'lessons',
      hasMany: true,
    },

    {
      name: 'requiredAssignments',
      type: 'relationship',
      relationTo: 'assignments',
      hasMany: true,
    },

    {
      name: 'requiredAssessments',
      type: 'relationship',
      relationTo: 'assessments',
      hasMany: true,
    },

    /* =====================================================
       FORMATION PRACTICES
    ===================================================== */
    {
      name: 'formationPractices',
      type: 'array',
      fields: [
        { name: 'practice', type: 'text', required: true },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },

    /* =====================================================
       COMPLETION RULES
    ===================================================== */
    {
      name: 'completionRule',
      type: 'select',
      defaultValue: 'all-required',
      options: [
        {
          label: 'Complete All Required Items',
          value: 'all-required',
        },
        {
          label: 'Percentage-Based Completion',
          value: 'percentage',
        },
        {
          label: 'Mentor Approval Required',
          value: 'mentor-approval',
        },
      ],
    },

    {
      name: 'requiredCompletionPercentage',
      type: 'number',
      min: 1,
      max: 100,
      admin: {
        condition: (_, siblingData) => siblingData?.completionRule === 'percentage',
      },
    },

    /* =====================================================
       MENTORSHIP & OVERSIGHT
    ===================================================== */
    {
      name: 'mentorReviewRequired',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'pastorApprovalRequired',
      type: 'checkbox',
      defaultValue: false,
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
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
}
