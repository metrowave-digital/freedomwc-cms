import type { CollectionConfig, FieldHook } from 'payload'

import { userHasRole, hasRoleAtLeast } from '../access/roles'

/* ======================================================
   Helpers
====================================================== */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120)
}

/**
 * Auto slug
 * - Generate on create
 * - Allow manual override
 * - Never change once published
 */
const autoSlug: FieldHook = ({ value, data, originalDoc, operation }) => {
  // Never change slug after publish
  if (operation === 'update' && originalDoc?.status === 'published') {
    return originalDoc.slug
  }

  if (typeof value === 'string' && value.trim()) {
    return value
  }

  const title = typeof data?.title === 'string' ? data.title : ''

  return title ? slugify(title) : value
}

/* ======================================================
   Courses Collection
====================================================== */

export const Courses: CollectionConfig = {
  slug: 'courses',

  labels: {
    singular: 'Course',
    plural: 'Courses',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Commons (Education)',
    defaultColumns: ['title', 'courseType', 'level', 'format', 'status', 'updatedAt'],
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
     * - Course catalog + Pathways browsing
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
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [autoSlug],
      },
    },

    {
      name: 'shortDescription',
      type: 'textarea',
      maxLength: 200,
      required: true,
    },

    {
      name: 'description',
      type: 'richText',
    },

    /* ----------------------------------------------- */
    /* Classification                                  */
    /* ----------------------------------------------- */

    {
      name: 'courseType',
      type: 'select',
      required: true,
      options: [
        { label: 'Biblical Studies', value: 'biblical' },
        { label: 'Theology', value: 'theology' },
        { label: 'Leadership Development', value: 'leadership' },
        { label: 'Spiritual Formation', value: 'formation' },
        { label: 'Life Skills', value: 'life-skills' },
        { label: 'Ministry Training', value: 'ministry' },
        { label: 'Vocational / Professional', value: 'vocational' },
      ],
    },

    {
      name: 'level',
      type: 'select',
      defaultValue: 'intro',
      options: [
        { label: 'Introductory', value: 'intro' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
      ],
    },

    {
      name: 'format',
      type: 'select',
      defaultValue: 'self-paced',
      options: [
        { label: 'Self-Paced', value: 'self-paced' },
        { label: 'Cohort-Based', value: 'cohort' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
    },

    /* ----------------------------------------------- */
    /* Duration & Objectives                           */
    /* ----------------------------------------------- */

    {
      name: 'estimatedDuration',
      type: 'group',
      fields: [
        {
          name: 'weeks',
          type: 'number',
          min: 1,
        },
        {
          name: 'hours',
          type: 'number',
          min: 1,
        },
      ],
    },

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
    /* Relationships                                   */
    /* ----------------------------------------------- */

    {
      name: 'modules',
      type: 'relationship',
      relationTo: 'modules',
      hasMany: true,
    },

    {
      name: 'prerequisites',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
    },

    {
      name: 'instructors',
      type: 'relationship',
      relationTo: 'instructors',
      hasMany: true,
    },

    {
      name: 'credentials',
      type: 'relationship',
      relationTo: 'credentials',
      hasMany: true,
    },

    /* ----------------------------------------------- */
    /* Pathways Integration                            */
    /* ----------------------------------------------- */

    {
      name: 'usedInPathways',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Mark if this course is required or optional in a Pathways program.',
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
    /* Media & Resources                               */
    /* ----------------------------------------------- */

    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },

    {
      name: 'resources',
      type: 'relationship',
      relationTo: 'resources',
      hasMany: true,
    },

    /* ----------------------------------------------- */
    /* Publishing & Status                             */
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

    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.status === 'published',
      },
    },
  ],
}
