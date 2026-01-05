import type { CollectionConfig, Where } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const PrayerRequests: CollectionConfig = {
  slug: 'prayer-requests',

  labels: {
    singular: 'Prayer Request',
    plural: 'Prayer Requests',
  },

  admin: {
    useAsTitle: 'summary',
    group: 'Church Life',
    defaultColumns: ['summary', 'visibility', 'status', 'createdAt'],
  },

  /* =====================================================
     ACCESS CONTROL
  ===================================================== */

  access: {
    /**
     * READ
     * - Public requests: everyone
     * - Private / leadership: restricted
     * - Owner can always read their own
     */
    read: ({ req }) => {
      // Anonymous users → public only
      if (!req.user) {
        return {
          visibility: {
            equals: 'public',
          },
        } as Where
      }

      // Leader+ → unrestricted
      if (hasRoleAtLeast(req, 'leader')) {
        return true
      }

      // Logged-in, non-leader
      return {
        or: [
          {
            visibility: {
              equals: 'public',
            },
          },
          {
            profile: {
              equals: req.user.profile,
            },
          },
          {
            visibility: {
              equals: 'leaders',
            },
          },
          {
            visibility: {
              equals: 'prayer-team',
            },
          },
        ],
      } as Where
    },

    /**
     * CREATE
     * - Any logged-in user
     */
    create: ({ req }) => Boolean(req.user),

    /**
     * UPDATE
     * - Owner (limited)
     * - Leaders / pastors
     */
    update: ({ req }) => {
      if (!req.user) return false
      if (hasRoleAtLeast(req, 'leader')) return true
      return {
        profile: {
          equals: req.user.profile,
        },
      }
    },

    /**
     * DELETE
     * - Admin only
     */
    delete: ({ req }) => hasRoleAtLeast(req, 'admin'),
  },

  /* =====================================================
     FIELDS
  ===================================================== */

  fields: [
    /* ----------------------------------
       REQUESTOR
    ---------------------------------- */
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      index: true,
      admin: {
        description: 'Person submitting the prayer request.',
      },
    },

    /* ----------------------------------
       CORE CONTENT
    ---------------------------------- */
    {
      name: 'summary',
      type: 'text',
      required: true,
      admin: {
        description: 'Short summary (shown in lists).',
      },
    },

    {
      name: 'request',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Full prayer request details.',
      },
    },

    /* ----------------------------------
       VISIBILITY & SAFETY
    ---------------------------------- */
    {
      name: 'visibility',
      type: 'select',
      required: true,
      defaultValue: 'leaders',
      options: [
        { label: 'Private (Pastoral Only)', value: 'private' },
        { label: 'Leaders', value: 'leaders' },
        { label: 'Prayer Team', value: 'prayer-team' },
        { label: 'Public', value: 'public' },
      ],
    },

    {
      name: 'allowFollowUp',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'May leaders/prayer team follow up?',
      },
    },

    /* ----------------------------------
       STATUS & OUTCOME
    ---------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      index: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Answered', value: 'answered' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Closed', value: 'closed' },
      ],
    },

    {
      name: 'answerTestimony',
      type: 'textarea',
      admin: {
        description: 'Optional testimony when prayer is answered.',
      },
    },

    {
      name: 'answeredAt',
      type: 'date',
    },

    /* ----------------------------------
       PRAYER CALL & COMMUNITY
    ---------------------------------- */
    {
      name: 'relatedEvent',
      type: 'relationship',
      relationTo: 'events',
      admin: {
        description: 'Optional prayer call or gathering connected to this request.',
      },
    },

    /* ----------------------------------
       PASTORAL FOLLOW-UP
    ---------------------------------- */
    {
      name: 'assignedLeader',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        description: 'Leader or pastor assigned for follow-up.',
      },
    },

    {
      name: 'followUpNotes',
      type: 'textarea',
      admin: {
        description: 'Internal pastoral notes (leaders only).',
      },
    },

    {
      name: 'followUpDate',
      type: 'date',
    },
  ],

  /* =====================================================
     HOOKS
  ===================================================== */

  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'update' && data.status === 'answered' && !data.answeredAt) {
          data.answeredAt = new Date().toISOString()
        }

        return data
      },
    ],
  },
}
