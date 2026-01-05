import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const WeeklyExperiences: CollectionConfig = {
  slug: 'weekly-experiences',

  labels: {
    singular: 'Weekly Experience',
    plural: 'Weekly Experiences',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Pathways',
    defaultColumns: ['title', 'pathwayPhase', 'weekNumber', 'updatedAt'],
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
        description: 'Example: "Week 3 – Healing the Inner Self"',
      },
    },

    {
      name: 'weekNumber',
      type: 'number',
      required: true,
      min: 1,
    },

    {
      name: 'pathwaysPhase',
      type: 'relationship',
      relationTo: 'pathways-phases',
      required: true,
      index: true,
    },

    /* =====================================================
       THEME & FOCUS
    ===================================================== */
    {
      name: 'theme',
      type: 'text',
      admin: {
        description: 'Weekly theme or focus word (e.g. Identity, Healing, Calling).',
      },
    },

    {
      name: 'scriptureFocus',
      type: 'array',
      fields: [
        {
          name: 'reference',
          type: 'text',
          required: true,
        },
        {
          name: 'translation',
          type: 'text',
        },
      ],
    },

    /* =====================================================
       TEACHING & CONTENT
    ===================================================== */
    {
      name: 'teachingContent',
      type: 'richText',
      admin: {
        description: 'Teaching, devotional content, or weekly lesson.',
      },
    },

    {
      name: 'relatedLessons',
      type: 'relationship',
      relationTo: 'lessons',
      hasMany: true,
    },

    /* =====================================================
       FORMATION PRACTICES
    ===================================================== */
    {
      name: 'formationPractices',
      type: 'relationship',
      relationTo: 'formation-practices',
      hasMany: true,
      admin: {
        description: 'Practices participants should engage this week.',
      },
    },

    /* =====================================================
       REFLECTION & JOURNALING
    ===================================================== */
    {
      name: 'reflectionQuestions',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'textarea',
          required: true,
        },
      ],
    },

    {
      name: 'journalRequired',
      type: 'checkbox',
      defaultValue: true,
    },

    /* =====================================================
       COMMUNITY & COHORT
    ===================================================== */
    {
      name: 'groupActivity',
      type: 'textarea',
      admin: {
        description: 'Cohort or small-group activity for this week.',
      },
    },

    {
      name: 'mentorGuidance',
      type: 'textarea',
      admin: {
        description: 'Private notes or guidance for mentors facilitating this week.',
      },
    },

    /* =====================================================
       PROGRESS & COMPLETION
    ===================================================== */
    {
      name: 'completionRequired',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'estimatedTimeMinutes',
      type: 'number',
      min: 5,
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
