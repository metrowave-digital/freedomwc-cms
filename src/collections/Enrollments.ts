import type { CollectionConfig } from 'payload'
import { lmsReadAccess, lmsWriteAccess } from '../access/control'
import { hasRoleAtLeast } from '../access/roles'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',

  labels: {
    singular: 'Enrollment',
    plural: 'Enrollments',
  },

  admin: {
    useAsTitle: 'courseTitle',
    group: 'Pathways & Courses',
    defaultColumns: ['courseTitle', 'profile', 'status', 'startDate', 'cohort'],
  },

  /* =====================================================
     Access Control
  ===================================================== */

  access: {
    read: lmsReadAccess,
    create: lmsWriteAccess,
    update: lmsWriteAccess,
    delete: ({ req }) => hasRoleAtLeast(req, 'leader'),
  },

  /* =====================================================
     Fields
  ===================================================== */

  fields: [
    /* -----------------------------
       COURSE CONTEXT
    ----------------------------- */
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      index: true,
    },

    {
      name: 'courseTitle',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },

    /* -----------------------------
       PERSON CONTEXT
    ----------------------------- */
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      index: true,
      admin: {
        description: 'Canonical person profile being enrolled.',
      },
    },

    {
      name: 'learnerProfile',
      type: 'relationship',
      relationTo: 'learner-profiles',
      admin: {
        description: 'Linked learner profile (optional but recommended).',
      },
    },

    /* -----------------------------
       SUPPORT ROLES
    ----------------------------- */
    {
      name: 'instructor',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        description: 'Primary instructor for this enrollment.',
      },
    },

    {
      name: 'mentor',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        description: 'Assigned mentor or coach for formation support.',
      },
    },

    /* -----------------------------
       COHORT / PATHWAYS
    ----------------------------- */
    {
      name: 'cohort',
      type: 'relationship',
      relationTo: 'cohorts',
      index: true,
    },

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

    /* -----------------------------
       ENROLLMENT STATUS
    ----------------------------- */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'enrolled',
      options: [
        { label: 'Enrolled', value: 'enrolled' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Withdrawn', value: 'withdrawn' },
        { label: 'Failed / Incomplete', value: 'incomplete' },
      ],
    },

    {
      name: 'progress',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 0,
      admin: {
        description: 'High-level progress indicator (detail lives in Progress collection).',
      },
    },

    {
      name: 'certificateIssued',
      type: 'checkbox',
      defaultValue: false,
    },

    /* -----------------------------
       DATES
    ----------------------------- */
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },

    {
      name: 'endDate',
      type: 'date',
    },

    /* -----------------------------
       NOTES & OVERRIDES
    ----------------------------- */
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Administrative or pastoral notes about this enrollment.',
      },
    },
  ],

  /* =====================================================
     Hooks
  ===================================================== */

  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        /* ---------------------------------------------
           Cache course title for admin UX
        --------------------------------------------- */
        if (data.course) {
          const course = await req.payload.findByID({
            collection: 'courses',
            id: data.course,
          })

          if (course?.title) {
            data.courseTitle = course.title
          }
        }

        return data
      },
    ],
  },
}
