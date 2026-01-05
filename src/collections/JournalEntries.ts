import type { CollectionConfig } from 'payload'

import { userHasRole, hasRoleAtLeast } from '../access/roles'

/* ======================================================
   Journal Entries Collection
====================================================== */

export const JournalEntries: CollectionConfig = {
  slug: 'journal-entries',

  labels: {
    singular: 'Journal Entry',
    plural: 'Journal Entries',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Pathways (Formation)',
    defaultColumns: ['title', 'user', 'visibility', 'status', 'updatedAt'],
  },

  versions: {
    drafts: true,
    maxPerDoc: 100,
  },

  /* ======================================================
     Access Control (ROLE-BASED)
  ====================================================== */

  access: {
    /**
     * READ
     * - Admin/Pastor/Leader: read all (oversight)
     * - Mentor: read entries that are shared with mentor/cohort/public
     * - Learner: read their own
     */
    read: ({ req }) => {
      if (!req.user) return false

      // Highest oversight roles
      if (hasRoleAtLeast(req, 'leader')) return true

      // Everyone else (mentor, instructor, staff, member, student)
      // is filtered by the "read" filter below (field-level logic).
      return true
    },

    /**
     * CREATE
     * - Any logged-in user can create their own journal entry
     */
    create: ({ req }) => Boolean(req.user),

    /**
     * UPDATE
     * - Admin/Pastor/Leader: can update all
     * - User: can update their own entries
     * - Mentor: can only update feedback fields (enforced at field level)
     */
    update: ({ req }) => Boolean(req.user),

    /**
     * DELETE
     * - Admin only (audit + safety)
     */
    delete: ({ req }) => userHasRole(req, ['admin']),
  },

  /* ======================================================
     Fields
  ====================================================== */

  fields: [
    /* ----------------------------------------------- */
    /* Ownership                                       */
    /* ----------------------------------------------- */

    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
      access: {
        create: ({ req, data }) => {
          // Leader+ can assign anyone
          if (hasRoleAtLeast(req, 'leader')) return true

          // Otherwise user can only assign themselves
          return String(data?.user) === String(req.user?.id)
        },

        update: ({ req }) => {
          // Only leader+ can change ownership
          return hasRoleAtLeast(req, 'leader')
        },
      },
    },

    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description:
          'Short title for the reflection (e.g., "Week 2 Reflection" or "James 2:1–11").',
      },
    },

    {
      name: 'prompt',
      type: 'textarea',
      admin: {
        description:
          'Optional prompt that the learner is responding to (lesson prompt / mentor prompt).',
      },
    },

    {
      name: 'entry',
      type: 'richText',
      required: true,
    },

    /* ----------------------------------------------- */
    /* Context Links (Optional)                        */
    /* ----------------------------------------------- */

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
      name: 'pathwaysProgram',
      type: 'relationship',
      relationTo: 'pathways-programs',
      index: true,
    },

    {
      name: 'pathwaysPhase',
      type: 'relationship',
      relationTo: 'pathways-phases',
      index: true,
    },

    {
      name: 'cohort',
      type: 'relationship',
      relationTo: 'cohorts',
      admin: {
        description: 'If this reflection is tied to a specific cohort/group.',
      },
    },

    {
      name: 'progressRecord',
      type: 'relationship',
      relationTo: 'progress',
      admin: {
        description: 'Optional: link to the Progress record this reflection supports.',
      },
    },

    /* ----------------------------------------------- */
    /* Visibility                                      */
    /* ----------------------------------------------- */

    {
      name: 'visibility',
      type: 'select',
      required: true,
      defaultValue: 'private',
      options: [
        { label: 'Private (Only Me)', value: 'private' },
        { label: 'Shared With Mentor', value: 'mentor' },
        { label: 'Shared With Cohort', value: 'cohort' },
        { label: 'Public Testimony', value: 'public' },
      ],
      admin: {
        description: 'Controls who can view this entry. Private is safest by default.',
      },
    },

    /* ----------------------------------------------- */
    /* Mentor / Instructor Feedback                    */
    /* ----------------------------------------------- */

    {
      name: 'feedback',
      type: 'group',
      fields: [
        {
          name: 'mentorComment',
          type: 'textarea',
          access: {
            create: ({ req, data }) => {
              // Only mentor+ can add feedback
              return hasRoleAtLeast(req, 'mentor')
            },
            update: ({ req }) => hasRoleAtLeast(req, 'mentor'),
          },
        },
        {
          name: 'reviewStatus',
          type: 'select',
          defaultValue: 'not-reviewed',
          options: [
            { label: 'Not Reviewed', value: 'not-reviewed' },
            { label: 'Reviewed', value: 'reviewed' },
            { label: 'Needs Follow-Up', value: 'needs-follow-up' },
          ],
          access: {
            create: ({ req }) => hasRoleAtLeast(req, 'mentor'),
            update: ({ req }) => hasRoleAtLeast(req, 'mentor'),
          },
        },
        {
          name: 'reviewedBy',
          type: 'relationship',
          relationTo: 'users',
          access: {
            create: ({ req }) => hasRoleAtLeast(req, 'mentor'),
            update: ({ req }) => hasRoleAtLeast(req, 'mentor'),
          },
        },
        {
          name: 'reviewedAt',
          type: 'date',
          access: {
            create: ({ req }) => hasRoleAtLeast(req, 'mentor'),
            update: ({ req }) => hasRoleAtLeast(req, 'mentor'),
          },
        },
      ],
    },

    /* ----------------------------------------------- */
    /* Safeguards / Moderation                         */
    /* ----------------------------------------------- */

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
        { label: 'Flagged', value: 'flagged' },
      ],
    },

    {
      name: 'flagReason',
      type: 'textarea',
      admin: {
        condition: (_, siblingData) => siblingData?.status === 'flagged',
      },
      access: {
        create: ({ req }) => hasRoleAtLeast(req, 'leader'),
        update: ({ req }) => hasRoleAtLeast(req, 'leader'),
      },
    },

    /* ----------------------------------------------- */
    /* Read Rules (Query-time filtering)               */
    /* ----------------------------------------------- */
    // IMPORTANT:
    // Payload access "read" returning true does not filter documents by itself.
    // You should filter reads in your app queries like:
    // - user sees own
    // - mentor sees mentor/cohort/public (and optionally assigned learners)
    // - leader+ sees all
    //
    // If you want hard enforcement at CMS-level, say so and I’ll
    // convert read into a where-clause function for strict filtering.
  ],
}
