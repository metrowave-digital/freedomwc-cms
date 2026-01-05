import type { CollectionConfig } from 'payload'

import { userHasRole, hasRoleAtLeast } from '../access/roles'

/* ======================================================
   Assessments Collection
====================================================== */

export const Assessments: CollectionConfig = {
  slug: 'assessments',

  labels: {
    singular: 'Assessment',
    plural: 'Assessments',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Commons (Education)',
    defaultColumns: ['title', 'assessmentType', 'lesson', 'passingScore', 'status', 'updatedAt'],
  },

  versions: {
    drafts: true,
    maxPerDoc: 50,
  },

  /* ======================================================
     Access Control (ROLE-BASED)
  ====================================================== */

  access: {
    /**
     * READ
     * - Students can take assessments
     * - Mentors+ can review
     */
    read: ({ req }) => {
      if (!req.user) return false

      // Mentors, instructors, leaders, pastors, admins
      if (hasRoleAtLeast(req, 'mentor')) {
        return true
      }

      // Students / members taking assessments
      return hasRoleAtLeast(req, 'student')
    },

    /**
     * CREATE
     * - admin
     * - pastor
     * - leader
     * - instructor
     */
    create: ({ req }) => userHasRole(req, ['admin', 'pastor', 'leader', 'instructor']),

    /**
     * UPDATE
     * - admin
     * - pastor
     * - leader
     * - instructor
     */
    update: ({ req }) => userHasRole(req, ['admin', 'pastor', 'leader', 'instructor']),

    /**
     * DELETE
     * - admin only
     */
    delete: ({ req }) => userHasRole(req, ['admin']),
  },

  /* ======================================================
     Fields
  ====================================================== */

  fields: [
    /* ----------------------------------------------- */
    /* Core Identity                                   */
    /* ----------------------------------------------- */

    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Instructions or overview shown before the assessment begins.',
      },
    },

    /* ----------------------------------------------- */
    /* Lesson Relationship                             */
    /* ----------------------------------------------- */

    {
      name: 'lesson',
      type: 'relationship',
      relationTo: 'lessons',
      required: true,
    },

    /* ----------------------------------------------- */
    /* Assessment Type                                 */
    /* ----------------------------------------------- */

    {
      name: 'assessmentType',
      type: 'select',
      required: true,
      options: [
        { label: 'Quiz', value: 'quiz' },
        { label: 'Exam', value: 'exam' },
        { label: 'Scripture Check', value: 'scripture' },
        { label: 'Knowledge Review', value: 'review' },
      ],
    },

    /* ----------------------------------------------- */
    /* Settings & Rules                                */
    /* ----------------------------------------------- */

    {
      name: 'timeLimitMinutes',
      type: 'number',
      min: 1,
      admin: {
        description: 'Optional time limit (minutes). Leave blank for untimed.',
      },
    },

    {
      name: 'allowRetakes',
      type: 'checkbox',
      defaultValue: true,
    },

    {
      name: 'maxAttempts',
      type: 'number',
      min: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.allowRetakes === true,
      },
    },

    {
      name: 'passingScore',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 70,
    },

    /* ----------------------------------------------- */
    /* Questions                                       */
    /* ----------------------------------------------- */

    {
      name: 'questions',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'questionText',
          type: 'textarea',
          required: true,
        },

        {
          name: 'questionType',
          type: 'select',
          required: true,
          options: [
            { label: 'Multiple Choice', value: 'multiple-choice' },
            { label: 'True / False', value: 'true-false' },
            { label: 'Short Answer', value: 'short-answer' },
            { label: 'Scripture Reference', value: 'scripture' },
          ],
        },

        {
          name: 'options',
          type: 'array',
          admin: {
            condition: (_, siblingData) => siblingData?.questionType === 'multiple-choice',
          },
          fields: [
            {
              name: 'optionText',
              type: 'text',
              required: true,
            },
            {
              name: 'isCorrect',
              type: 'checkbox',
            },
          ],
        },

        {
          name: 'correctAnswer',
          type: 'text',
          admin: {
            condition: (_, siblingData) => siblingData?.questionType !== 'multiple-choice',
          },
        },

        {
          name: 'points',
          type: 'number',
          defaultValue: 1,
          min: 1,
        },
      ],
    },

    /* ----------------------------------------------- */
    /* Pathways Integration                            */
    /* ----------------------------------------------- */

    {
      name: 'usedInPathways',
      type: 'checkbox',
      defaultValue: false,
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

    /* ----------------------------------------------- */
    /* Publishing                                      */
    /* ----------------------------------------------- */

    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
}
