import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const EnrollmentRequests: CollectionConfig = {
  slug: 'enrollment-requests',

  labels: {
    singular: 'Enrollment Request',
    plural: 'Enrollment Requests',
  },

  admin: {
    useAsTitle: 'id',
    group: 'Pathways & Courses',
    defaultColumns: ['profile', 'course', 'pathwayProgram', 'status', 'submittedAt'],
  },

  /* =====================================================
     ACCESS CONTROL
  ===================================================== */

  access: {
    /**
     * READ
     * - Applicant can read their own
     * - Leaders/Pastors/Admins can read all
     */
    read: ({ req }) => {
      if (!req.user) return false
      if (hasRoleAtLeast(req, 'leader')) return true
      return {
        profile: {
          equals: req.user.profile,
        },
      }
    },

    /**
     * CREATE
     * - Any logged-in user
     */
    create: ({ req }) => Boolean(req.user),

    /**
     * UPDATE
     * - Leaders/Pastors/Admins
     */
    update: ({ req }) => hasRoleAtLeast(req, 'leader'),

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
    /* ---------------------------------------------
       APPLICANT
    --------------------------------------------- */
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      index: true,
      admin: {
        description: 'The person requesting enrollment.',
      },
    },

    /* ---------------------------------------------
       TARGET (WHAT THEY ARE APPLYING FOR)
    --------------------------------------------- */
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      admin: {
        description: 'Optional: course enrollment request.',
      },
    },

    {
      name: 'pathwaysProgram',
      type: 'relationship',
      relationTo: 'pathways-programs',
      admin: {
        description: 'Optional: Pathways program application.',
      },
    },

    {
      name: 'pathwaysPhase',
      type: 'relationship',
      relationTo: 'pathways-phases',
      admin: {
        description: 'Optional: phase placement (if applicable).',
      },
    },

    {
      name: 'preferredCohort',
      type: 'relationship',
      relationTo: 'cohorts',
      admin: {
        description: 'Optional: cohort preference (not guaranteed).',
      },
    },

    /* ---------------------------------------------
       APPLICATION CONTENT
    --------------------------------------------- */
    {
      name: 'motivation',
      type: 'textarea',
      admin: {
        description: 'Why is the applicant requesting enrollment?',
      },
    },

    {
      name: 'priorExperience',
      type: 'textarea',
      admin: {
        description: 'Relevant spiritual, ministry, or learning background.',
      },
    },

    {
      name: 'availabilityNotes',
      type: 'textarea',
      admin: {
        description: 'Schedule, capacity, or availability considerations.',
      },
    },

    /* ---------------------------------------------
       REVIEW & DISCERNMENT
    --------------------------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'submitted',
      index: true,
      options: [
        { label: 'Submitted', value: 'submitted' },
        { label: 'Under Review', value: 'reviewing' },
        { label: 'Approved', value: 'approved' },
        { label: 'Waitlisted', value: 'waitlisted' },
        { label: 'Denied', value: 'denied' },
        { label: 'Withdrawn', value: 'withdrawn' },
      ],
    },

    {
      name: 'reviewedBy',
      type: 'relationship',
      relationTo: 'users',
    },

    {
      name: 'reviewNotes',
      type: 'textarea',
      admin: {
        description: 'Internal discernment notes (leaders/pastors only).',
      },
    },

    /* ---------------------------------------------
       PLACEMENT DECISIONS
    --------------------------------------------- */
    {
      name: 'assignedCohort',
      type: 'relationship',
      relationTo: 'cohorts',
      admin: {
        description: 'Cohort assigned upon approval.',
      },
    },

    {
      name: 'assignedMentor',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        description: 'Mentor assigned upon approval.',
      },
    },

    /* ---------------------------------------------
       SYSTEM FIELDS
    --------------------------------------------- */
    {
      name: 'submittedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'resolvedAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'linkedEnrollment',
      type: 'relationship',
      relationTo: 'enrollments',
      admin: {
        readOnly: true,
        description: 'Enrollment created when request is approved.',
      },
    },
  ],

  /* =====================================================
     HOOKS
  ===================================================== */

  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Timestamp resolution
        if (
          operation === 'update' &&
          ['approved', 'denied', 'waitlisted'].includes(data.status) &&
          !data.resolvedAt
        ) {
          data.resolvedAt = new Date().toISOString()
        }

        return data
      },
    ],
  },
}
