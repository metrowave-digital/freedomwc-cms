import type { CollectionConfig } from 'payload'
import { userHasRole } from '../access/roles'

/* ======================================================
   Visibility Enforcement Hook
   (Payload-safe structural typing)
====================================================== */

const restrictCohortVisibility = ({
  req,
  doc,
}: {
  req: {
    user?: {
      id: number
      roles?: string[]
    } | null
  }
  doc: any
}) => {
  // Public cohorts are always readable
  if (doc.visibility === 'public') {
    return doc
  }

  // Everything else requires auth
  if (!req.user) {
    return false
  }

  const userId = req.user.id

  // Leaders / pastors / admins
  if (userHasRole({ user: req.user } as any, ['admin', 'pastor', 'leader'])) {
    return doc
  }

  // Assigned mentors
  if (
    doc.mentors?.some((mentor: number | { id: number }) =>
      typeof mentor === 'number' ? mentor === userId : mentor.id === userId,
    )
  ) {
    return doc
  }

  // Enrolled members
  if (
    doc.members?.some((member: number | { id: number }) =>
      typeof member === 'number' ? member === userId : member.id === userId,
    )
  ) {
    return doc
  }

  return false
}

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
    defaultColumns: [
      'name',
      'pathwaysProgram',
      'pathwaysPhase',
      'cohortStatus',
      'startDate',
      'endDate',
    ],
  },

  versions: {
    drafts: true,
    maxPerDoc: 50,
  },

  /* ======================================================
     Access Control
  ====================================================== */

  access: {
    read: () => true,

    create: ({ req }) => userHasRole(req, ['admin', 'pastor', 'leader']),

    update: ({ req }) => userHasRole(req, ['admin', 'pastor', 'leader']),

    delete: ({ req }) => userHasRole(req, ['admin']),
  },

  hooks: {
    beforeRead: [restrictCohortVisibility],
  },

  /* ======================================================
     Fields (UNCHANGED)
  ====================================================== */

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
    },

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
    },

    {
      name: 'mentors',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },

    {
      name: 'facilitators',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },

    {
      name: 'members',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
    },

    {
      name: 'courses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
    },

    {
      name: 'modules',
      type: 'relationship',
      relationTo: 'modules',
      hasMany: true,
    },

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
      options: [
        { label: 'Planned', value: 'planned' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
}
