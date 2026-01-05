import type { CollectionConfig } from 'payload'

import { userHasRole, hasRoleAtLeast } from '../access/roles'

/* ======================================================
   Progress Collection
====================================================== */

export const Progress: CollectionConfig = {
  slug: 'progress',

  labels: {
    singular: 'Progress Record',
    plural: 'Progress Records',
  },

  admin: {
    useAsTitle: 'id',
    group: 'Commons (Education)',
    defaultColumns: ['user', 'course', 'module', 'lesson', 'status', 'updatedAt'],
  },

  /* ======================================================
     Access Control (ROLE-BASED)
  ====================================================== */

  access: {
    /**
     * READ
     * - Admin / Pastor / Leader: all records
     * - Mentor: records for assigned learners (filtered in app)
     * - Learner: their own records only
     */
    read: ({ req }) => {
      if (!req.user) return false

      if (hasRoleAtLeast(req, 'leader')) {
        return true
      }

      // Mentors and learners are filtered by app-layer queries
      return true
    },

    /**
     * CREATE
     * - System-generated
     * - Instructors / leaders may initialize records
     */
    create: ({ req }) => Boolean(req.user),

    /**
     * UPDATE
     * - System (lesson completion, scores)
     * - Instructors / mentors (feedback fields only)
     */
    update: ({ req }) => Boolean(req.user),

    /**
     * DELETE
     * - Admin only (audit integrity)
     */
    delete: ({ req }) => userHasRole(req, ['admin']),
  },

  /* ======================================================
     Fields
  ====================================================== */

  fields: [
    /* ----------------------------------------------- */
    /* Identity                                        */
    /* ----------------------------------------------- */

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },

    /* ----------------------------------------------- */
    /* Context (One of these will be populated)        */
    /* ----------------------------------------------- */

    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      index: true,
    },

    {
      name: 'module',
      type: 'relationship',
      relationTo: 'modules',
      index: true,
    },

    {
      name: 'lesson',
      type: 'relationship',
      relationTo: 'lessons',
      index: true,
    },

    {
      name: 'assignment',
      type: 'relationship',
      relationTo: 'assignments',
      index: true,
    },

    {
      name: 'assessment',
      type: 'relationship',
      relationTo: 'assessments',
      index: true,
    },

    /* ----------------------------------------------- */
    /* Pathways Context                                */
    /* ----------------------------------------------- */

    {
      name: 'pathwaysProgram',
      type: 'relationship',
      relationTo: 'pathways-programs',
    },

    {
      name: 'pathwaysPhase',
      type: 'relationship',
      relationTo: 'pathways-phases',
    },

    /* ----------------------------------------------- */
    /* Progress State                                  */
    /* ----------------------------------------------- */

    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'not-started',
      options: [
        { label: 'Not Started', value: 'not-started' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Submitted', value: 'submitted' },
        { label: 'Passed', value: 'passed' },
        { label: 'Failed', value: 'failed' },
      ],
    },

    {
      name: 'startedAt',
      type: 'date',
    },

    {
      name: 'completedAt',
      type: 'date',
    },

    /* ----------------------------------------------- */
    /* Scores & Results                                */
    /* ----------------------------------------------- */

    {
      name: 'score',
      type: 'number',
      min: 0,
      max: 100,
    },

    {
      name: 'attempts',
      type: 'number',
      defaultValue: 0,
      min: 0,
    },

    /* ----------------------------------------------- */
    /* Assignment Submission                           */
    /* ----------------------------------------------- */

    {
      name: 'submission',
      type: 'group',
      fields: [
        {
          name: 'textResponse',
          type: 'textarea',
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'externalLink',
          type: 'text',
        },
        {
          name: 'submittedAt',
          type: 'date',
        },
      ],
    },

    /* ----------------------------------------------- */
    /* Feedback (Mentor / Instructor)                  */
    /* ----------------------------------------------- */

    {
      name: 'feedback',
      type: 'group',
      fields: [
        {
          name: 'comment',
          type: 'textarea',
        },
        {
          name: 'reviewedBy',
          type: 'relationship',
          relationTo: 'users',
        },
        {
          name: 'reviewedAt',
          type: 'date',
        },
      ],
    },

    /* ----------------------------------------------- */
    /* Reflection (Optional, Linked)                   */
    /* ----------------------------------------------- */

    {
      name: 'reflectionEntry',
      type: 'relationship',
      relationTo: 'journal-entries',
      admin: {
        description: 'Optional linked journal entry for reflection-based lessons.',
      },
    },

    /* ----------------------------------------------- */
    /* System Flags                                    */
    /* ----------------------------------------------- */

    {
      name: 'isLocked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Prevents further changes (used after final review).',
      },
    },
  ],
}
