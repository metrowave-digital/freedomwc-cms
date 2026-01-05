import type { CollectionConfig } from 'payload'

import { userHasRole, hasRoleAtLeast } from '../access/roles'

/* ======================================================
   Modules Collection
====================================================== */

export const Modules: CollectionConfig = {
  slug: 'modules',

  labels: {
    singular: 'Module',
    plural: 'Modules',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Commons (Education)',
    defaultColumns: ['title', 'course', 'order', 'unlockType', 'updatedAt'],
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
     * - Public (viewer and up)
     * - Required for course previews + Pathways
     */
    read: () => true,

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
      name: 'overview',
      type: 'richText',
    },

    {
      name: 'order',
      type: 'number',
      required: true,
      min: 1,
      admin: {
        description: 'Controls the order of modules within a course.',
      },
    },

    /* ----------------------------------------------- */
    /* Course Relationship                             */
    /* ----------------------------------------------- */

    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
    },

    /* ----------------------------------------------- */
    /* Lessons                                         */
    /* ----------------------------------------------- */

    {
      name: 'lessons',
      type: 'relationship',
      relationTo: 'lessons',
      hasMany: true,
      admin: {
        description: 'Lessons contained within this module.',
      },
    },

    /* ----------------------------------------------- */
    /* Learning Objectives                             */
    /* ----------------------------------------------- */

    {
      name: 'learningObjectives',
      type: 'array',
      fields: [
        {
          name: 'objective',
          type: 'text',
          required: true,
        },
      ],
    },

    /* ----------------------------------------------- */
    /* Unlock / Progress Rules                         */
    /* ----------------------------------------------- */

    {
      name: 'unlockType',
      type: 'select',
      defaultValue: 'sequential',
      options: [
        {
          label: 'Sequential (Complete Previous Module)',
          value: 'sequential',
        },
        {
          label: 'Date-Based',
          value: 'date',
        },
        {
          label: 'Manual (Admin / Instructor Unlock)',
          value: 'manual',
        },
        {
          label: 'Open Access',
          value: 'open',
        },
      ],
    },

    {
      name: 'unlockDate',
      type: 'date',
      admin: {
        condition: (_, siblingData) => siblingData?.unlockType === 'date',
      },
    },

    {
      name: 'manualUnlockRoles',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Pastor', value: 'pastor' },
        { label: 'Leader', value: 'leader' },
        { label: 'Instructor', value: 'instructor' },
      ],
      admin: {
        description: 'Roles allowed to manually unlock this module for learners.',
        condition: (_, siblingData) => siblingData?.unlockType === 'manual',
      },
    },

    /* ----------------------------------------------- */
    /* Pathways Integration                            */
    /* ----------------------------------------------- */

    {
      name: 'usedInPathways',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Indicates this module is used within a Pathways phase.',
      },
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
    /* Visibility / Access Control                     */
    /* ----------------------------------------------- */

    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'enrolled',
      options: [
        {
          label: 'Public Preview',
          value: 'public',
        },
        {
          label: 'Enrolled Learners Only',
          value: 'enrolled',
        },
        {
          label: 'Cohort Members Only',
          value: 'cohort',
        },
      ],
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
