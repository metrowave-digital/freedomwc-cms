import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const FormationPractices: CollectionConfig = {
  slug: 'formation-practices',

  labels: {
    singular: 'Formation Practice',
    plural: 'Formation Practices',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Pathways',
    defaultColumns: ['title', 'practiceType', 'updatedAt'],
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
        description: 'Example: Prayer, Fasting, Sankofa Reflection',
      },
    },

    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        description: 'Optional URL-safe identifier.',
      },
    },

    {
      name: 'practiceType',
      type: 'select',
      required: true,
      options: [
        { label: 'Spiritual Discipline', value: 'spiritual' },
        { label: 'Embodied Practice', value: 'embodied' },
        { label: 'Communal Practice', value: 'communal' },
        { label: 'Justice / Service Practice', value: 'justice' },
        { label: 'Reflective Practice', value: 'reflective' },
      ],
    },

    /* =====================================================
       DESCRIPTION & GUIDANCE
    ===================================================== */
    {
      name: 'description',
      type: 'richText',
      admin: {
        description: 'What this practice is and why it matters spiritually.',
      },
    },

    {
      name: 'instructions',
      type: 'richText',
      admin: {
        description: 'How to practice this (step-by-step or guided).',
      },
    },

    /* =====================================================
       SCRIPTURE & THEOLOGY
    ===================================================== */
    {
      name: 'scriptureReferences',
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

    {
      name: 'theologicalReflection',
      type: 'textarea',
      admin: {
        description: 'Optional theological framing or pastoral note.',
      },
    },

    /* =====================================================
       JOURNAL & PRACTICE OUTPUT
    ===================================================== */
    {
      name: 'suggestedJournalPrompt',
      type: 'textarea',
    },

    {
      name: 'requiresJournalEntry',
      type: 'checkbox',
      defaultValue: false,
    },

    /* =====================================================
       PATHWAYS INTEGRATION
    ===================================================== */
    {
      name: 'usedInPathways',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'pathwaysPhases',
      type: 'relationship',
      relationTo: 'pathways-phases',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.usedInPathways === true,
      },
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
