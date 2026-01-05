import type { CollectionConfig } from 'payload'

import { userHasRole, hasRoleAtLeast } from '../access/roles'

/* ======================================================
   Credentials Collection
====================================================== */

export const Credentials: CollectionConfig = {
  slug: 'credentials',

  labels: {
    singular: 'Credential',
    plural: 'Credentials',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Commons (Education)',
    defaultColumns: ['title', 'credentialType', 'issuingBody', 'status', 'updatedAt'],
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
     * - Public credentials can be viewed by anyone
     * - Internal credentials visible to logged-in users
     */
    read: ({ req }) => {
      if (!req.user) return true
      return true
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
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description:
          'Example: "Pathways Leadership Certificate" or "Ministry Foundations Credential".',
      },
    },

    {
      name: 'description',
      type: 'richText',
    },

    /* ----------------------------------------------- */
    /* Credential Classification                       */
    /* ----------------------------------------------- */

    {
      name: 'credentialType',
      type: 'select',
      required: true,
      options: [
        { label: 'Certificate', value: 'certificate' },
        { label: 'Ministry Credential', value: 'ministry' },
        { label: 'Leadership Endorsement', value: 'leadership' },
        { label: 'Completion Badge', value: 'badge' },
      ],
    },

    {
      name: 'issuingBody',
      type: 'select',
      defaultValue: 'commons',
      options: [
        { label: 'Commons (Education Dept.)', value: 'commons' },
        { label: 'Pathways Program', value: 'pathways' },
        { label: 'Freedom Community Fellowship', value: 'fcf' },
      ],
    },

    /* ----------------------------------------------- */
    /* Requirements                                    */
    /* ----------------------------------------------- */

    {
      name: 'requiredCourses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
    },

    {
      name: 'requiredPathwaysProgram',
      type: 'relationship',
      relationTo: 'pathways-programs',
    },

    {
      name: 'requiredPathwaysPhase',
      type: 'relationship',
      relationTo: 'pathways-phases',
    },

    {
      name: 'requiredAssignments',
      type: 'relationship',
      relationTo: 'assignments',
      hasMany: true,
    },

    {
      name: 'requiredAssessments',
      type: 'relationship',
      relationTo: 'assessments',
      hasMany: true,
    },

    {
      name: 'minimumScore',
      type: 'number',
      min: 0,
      max: 100,
      admin: {
        description: 'Optional minimum assessment score required.',
      },
    },

    {
      name: 'mentorApprovalRequired',
      type: 'checkbox',
      defaultValue: false,
    },

    /* ----------------------------------------------- */
    /* Awarding Rules                                  */
    /* ----------------------------------------------- */

    {
      name: 'autoAward',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'If enabled, credential is automatically awarded when requirements are met.',
      },
    },

    {
      name: 'requiresPastorApproval',
      type: 'checkbox',
      defaultValue: false,
    },

    /* ----------------------------------------------- */
    /* Certificate Assets                              */
    /* ----------------------------------------------- */

    {
      name: 'certificateTemplate',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional certificate PDF or image template.',
      },
    },

    /* ----------------------------------------------- */
    /* Expiration / Renewal                            */
    /* ----------------------------------------------- */

    {
      name: 'expires',
      type: 'checkbox',
      defaultValue: false,
    },

    {
      name: 'expirationMonths',
      type: 'number',
      min: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.expires === true,
      },
    },

    /* ----------------------------------------------- */
    /* Visibility                                      */
    /* ----------------------------------------------- */

    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'internal',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Internal', value: 'internal' },
        { label: 'Private (Recipient Only)', value: 'private' },
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
