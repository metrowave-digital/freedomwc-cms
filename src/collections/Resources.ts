import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const Resources: CollectionConfig = {
  slug: 'resources',

  labels: {
    singular: 'Resource',
    plural: 'Resources',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'resourceType', 'visibility', 'updatedAt'],
  },

  access: {
    /**
     * READ
     * - Public resources visible to all
     * - Restricted resources require login (handled in app)
     */
    read: () => true,

    /**
     * CREATE / UPDATE
     * - Staff, leaders, pastors
     */
    create: ({ req }) => hasRoleAtLeast(req, 'staff'),
    update: ({ req }) => hasRoleAtLeast(req, 'staff'),

    /**
     * DELETE
     * - Admin only
     */
    delete: ({ req }) => hasRoleAtLeast(req, 'admin'),
  },

  fields: [
    /* =====================================================
       CORE IDENTITY
    ===================================================== */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'resourceType',
      type: 'select',
      required: true,
      options: [
        { label: 'PDF / Document', value: 'document' },
        { label: 'Audio', value: 'audio' },
        { label: 'Video', value: 'video' },
        { label: 'Image', value: 'image' },
        { label: 'External Link', value: 'link' },
        { label: 'Prayer / Devotional', value: 'devotional' },
      ],
    },

    /* =====================================================
       CONTENT
    ===================================================== */
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.resourceType !== 'link',
      },
    },

    {
      name: 'externalUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.resourceType === 'link',
      },
    },

    /* =====================================================
       CATEGORIZATION
    ===================================================== */
    {
      name: 'categories',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Sermons', value: 'sermons' },
        { label: 'Bible Study', value: 'bible-study' },
        { label: 'Prayer', value: 'prayer' },
        { label: 'Devotionals', value: 'devotional' },
        { label: 'Leadership', value: 'leadership' },
        { label: 'Youth', value: 'youth' },
        { label: 'Outreach', value: 'outreach' },
        { label: 'General Church', value: 'general' },
      ],
    },

    /* =====================================================
       OPTIONAL TARGETING (NOT REQUIRED)
    ===================================================== */
    {
      name: 'relatedCourses',
      type: 'relationship',
      relationTo: 'courses',
      hasMany: true,
    },

    {
      name: 'relatedPathwaysPhases',
      type: 'relationship',
      relationTo: 'pathways-phases',
      hasMany: true,
    },

    {
      name: 'relatedMinistries',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Worship', value: 'worship' },
        { label: 'Youth', value: 'youth' },
        { label: 'Outreach', value: 'outreach' },
        { label: 'Media', value: 'media' },
        { label: 'Prayer Team', value: 'prayer' },
      ],
    },

    /* =====================================================
       VISIBILITY
    ===================================================== */
    {
      name: 'visibility',
      type: 'select',
      defaultValue: 'public',
      options: [
        { label: 'Public', value: 'public' },
        { label: 'Members Only', value: 'members' },
        { label: 'Leaders Only', value: 'leaders' },
        { label: 'Private', value: 'private' },
      ],
    },

    /* =====================================================
       STATUS
    ===================================================== */
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      admin: { position: 'sidebar' },
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
}
