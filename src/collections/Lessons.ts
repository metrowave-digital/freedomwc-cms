import type { CollectionConfig } from 'payload'

import { userHasRole, hasRoleAtLeast } from '../access/roles'

/* ======================================================
   Lessons Collection
====================================================== */

export const Lessons: CollectionConfig = {
  slug: 'lessons',

  labels: {
    singular: 'Lesson',
    plural: 'Lessons',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Commons (Education)',
    defaultColumns: ['title', 'lessonType', 'module', 'order', 'status', 'updatedAt'],
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
     * - Public previews allowed
     * - Full content visible to enrolled learners
     * - Mentors / instructors / leaders / pastors always allowed
     */
    read: ({ req }) => {
      if (!req.user) return true

      if (hasRoleAtLeast(req, 'mentor')) {
        return true
      }

      // Students / members handled by enrollment logic at app layer
      return true
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
      name: 'summary',
      type: 'textarea',
      maxLength: 240,
    },

    {
      name: 'order',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'Controls lesson order within the module.',
      },
    },

    /* ----------------------------------------------- */
    /* Module Relationship                             */
    /* ----------------------------------------------- */

    {
      name: 'module',
      type: 'relationship',
      relationTo: 'modules',
      required: true,
    },

    /* ----------------------------------------------- */
    /* Lesson Type                                     */
    /* ----------------------------------------------- */

    {
      name: 'lessonType',
      type: 'select',
      required: true,
      options: [
        { label: 'Video Lesson', value: 'video' },
        { label: 'Reading', value: 'reading' },
        { label: 'Devotional', value: 'devotional' },
        { label: 'Discussion', value: 'discussion' },
        { label: 'Assignment', value: 'assignment' },
        { label: 'Assessment / Quiz', value: 'assessment' },
        { label: 'Practice / Exercise', value: 'practice' },
      ],
    },

    /* ----------------------------------------------- */
    /* Content                                         */
    /* ----------------------------------------------- */

    {
      name: 'content',
      type: 'richText',
      admin: {
        description: 'Primary lesson content (text, scripture, images, embeds).',
      },
    },

    {
      name: 'media',
      type: 'group',
      fields: [
        {
          name: 'video',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'audio',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },

    /* ----------------------------------------------- */
    /* Scripture & Formation                           */
    /* ----------------------------------------------- */

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

    {
      name: 'reflectionPrompt',
      type: 'textarea',
      admin: {
        description: 'Prompt for journaling or personal reflection.',
      },
    },

    /* ----------------------------------------------- */
    /* Time & Completion                               */
    /* ----------------------------------------------- */

    {
      name: 'estimatedTime',
      type: 'number',
      admin: {
        description: 'Estimated completion time in minutes.',
      },
      min: 1,
    },

    {
      name: 'completionRequired',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Must this lesson be completed to progress?',
      },
    },

    /* ----------------------------------------------- */
    /* Assignments & Assessments                       */
    /* ----------------------------------------------- */

    {
      name: 'assignment',
      type: 'relationship',
      relationTo: 'assignments',
    },

    {
      name: 'assessment',
      type: 'relationship',
      relationTo: 'assessments',
    },

    /* ----------------------------------------------- */
    /* Mentor & Pathways Visibility                    */
    /* ----------------------------------------------- */

    {
      name: 'mentorVisibility',
      type: 'select',
      defaultValue: 'summary',
      options: [
        {
          label: 'Summary Only',
          value: 'summary',
        },
        {
          label: 'Full Content',
          value: 'full',
        },
        {
          label: 'Reflection Responses',
          value: 'reflection',
        },
      ],
      admin: {
        description: 'Controls what mentors can see for this lesson.',
      },
    },

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
    /* Visibility & Publishing                         */
    /* ----------------------------------------------- */

    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'enrolled',
      options: [
        { label: 'Public Preview', value: 'public' },
        { label: 'Enrolled Learners Only', value: 'enrolled' },
        { label: 'Cohort Members Only', value: 'cohort' },
      ],
    },

    {
      name: 'lessonState',
      label: 'Lesson Status',
      type: 'select',
      defaultValue: 'active',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
}
