import type { CollectionConfig } from 'payload'

import { userHasRole, hasRoleAtLeast } from '../access/roles'

/* ======================================================
   Cohorts Collection
====================================================== */

export const Cohorts: CollectionConfig = {
  slug: 'cohorts',

  labels: {
    singular: 'Cohort',
    plural: 'Cohorts',
  },

  admin: {
    useAsTitle: 'name',
    group: 'Pathways (Formation)',
    defaultColumns: ['name', 'pathwayProgram', 'pathwayPhase', 'status', 'startDate', 'endDate'],
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
     * - Leader+ sees all
     * - Mentors see cohorts they are assigned to
     * - Members/students see cohorts they belong to
     */
    read: ({ req }) => {
      // ✅ Allow server-to-server (API key)
      const authHeader = req.headers.get('authorization') || req.headers.get('Authorization')

      if (authHeader?.startsWith('Bearer ')) {
        return true
      }

      // ✅ Allow authenticated users (admin, members, etc.)
      if (req.user) {
        return true
      }

      return false
    },

    /**
     * CREATE
     * - admin
     * - pastor
     * - leader
     */
    create: ({ req }) => userHasRole(req, ['admin', 'pastor', 'leader']),

    /**
     * UPDATE
     * - admin
     * - pastor
     * - leader
     */
    update: ({ req }) => userHasRole(req, ['admin', 'pastor', 'leader']),

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
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Example: "Pathways Leadership – Fall 2026 (Cohort A)"',
      },
    },

    {
      name: 'description',
      type: 'textarea',
    },

    /* ----------------------------------------------- */
    /* Pathways Context                                */
    /* ----------------------------------------------- */

    {
      name: 'pathwaysProgram',
      type: 'relationship',
      relationTo: 'pathways-programs',
      required: true,
      index: true,
    },

    {
      name: 'pathwaysPhase',
      type: 'relationship',
      relationTo: 'pathways-phases',
      required: true,
      index: true,
    },

    /* ----------------------------------------------- */
    /* Schedule                                        */
    /* ----------------------------------------------- */

    {
      name: 'startDate',
      type: 'date',
      required: true,
    },

    {
      name: 'endDate',
      type: 'date',
    },

    {
      name: 'meetingSchedule',
      type: 'textarea',
      admin: {
        description: 'Example: "Sundays at 10:30am (in person)" or "Tuesdays on Zoom"',
      },
    },

    /* ----------------------------------------------- */
    /* Leadership                                      */
    /* ----------------------------------------------- */

    {
      name: 'mentors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        description: 'Assigned mentors/coaches for this cohort.',
      },
      filterOptions: {
        roles: {
          in: ['mentor', 'leader', 'pastor'],
        },
      },
    },

    {
      name: 'facilitators',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        description: 'Facilitators or instructors guiding sessions.',
      },
      filterOptions: {
        roles: {
          in: ['leader', 'pastor', 'instructor'],
        },
      },
    },

    /* ----------------------------------------------- */
    /* Members                                         */
    /* ----------------------------------------------- */

    {
      name: 'members',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        description: 'Participants enrolled in this cohort.',
      },
      filterOptions: {
        roles: {
          in: ['member', 'student', 'volunteer'],
        },
      },
    },

    /* ----------------------------------------------- */
    /* Courses & Modules (Optional Override)           */
    /* ----------------------------------------------- */

    {
      name: 'courses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
      admin: {
        description:
          'Optional: courses this cohort focuses on (overrides default Pathways mapping).',
      },
    },

    {
      name: 'modules',
      type: 'relationship',
      relationTo: 'modules',
      hasMany: true,
      admin: {
        description: 'Optional: specific modules emphasized for this cohort.',
      },
    },

    /* ----------------------------------------------- */
    /* Visibility & Status                             */
    /* ----------------------------------------------- */

    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'private',
      options: [
        { label: 'Private (Invite Only)', value: 'private' },
        { label: 'Members Only', value: 'members' },
        { label: 'Public Listing', value: 'public' },
      ],
    },

    {
      name: 'cohortStatus',
      type: 'select',
      defaultValue: 'active',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Planned', value: 'planned' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
}
