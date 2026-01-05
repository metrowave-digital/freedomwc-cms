import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const UserNotifications: CollectionConfig = {
  slug: 'user-notifications',

  labels: {
    singular: 'User Notification',
    plural: 'User Notifications',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Communications',
    defaultColumns: ['title', 'user', 'notificationType', 'read', 'createdAt'],
  },

  /* =====================================================
     ACCESS CONTROL
  ===================================================== */

  access: {
    /**
     * READ
     * - Users can read their own notifications
     * - Leaders/Admins can read all
     */
    read: ({ req }) => {
      if (!req.user) return false
      if (hasRoleAtLeast(req, 'leader')) return true
      return {
        user: {
          equals: req.user.id,
        },
      }
    },

    /**
     * CREATE
     * - System (hooks)
     * - Staff / Leaders
     */
    create: ({ req }) => Boolean(req.user),

    /**
     * UPDATE
     * - User can mark their own as read
     * - Leaders/Admins can update all
     */
    update: ({ req }) => Boolean(req.user),

    /**
     * DELETE
     * - Admin only (audit integrity)
     */
    delete: ({ req }) => hasRoleAtLeast(req, 'admin'),
  },

  /* =====================================================
     FIELDS
  ===================================================== */

  fields: [
    /* -----------------------------------------------
       RECIPIENT
    ----------------------------------------------- */
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      index: true,
    },

    /* -----------------------------------------------
       CORE CONTENT
    ----------------------------------------------- */
    {
      name: 'title',
      type: 'text',
      required: true,
    },

    {
      name: 'message',
      type: 'textarea',
      required: true,
    },

    /* -----------------------------------------------
       NOTIFICATION TYPE
    ----------------------------------------------- */
    {
      name: 'notificationType',
      type: 'select',
      required: true,
      options: [
        { label: 'Announcement', value: 'announcement' },
        { label: 'Pathways Update', value: 'pathways' },
        { label: 'Course / LMS', value: 'lms' },
        { label: 'Credential Awarded', value: 'credential' },
        { label: 'Mentor Message', value: 'mentor' },
        { label: 'System', value: 'system' },
      ],
    },

    /* -----------------------------------------------
       SOURCE LINKS (OPTIONAL)
    ----------------------------------------------- */
    {
      name: 'announcement',
      type: 'relationship',
      relationTo: 'announcements',
    },

    {
      name: 'resource',
      type: 'relationship',
      relationTo: 'resources',
    },

    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
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

    {
      name: 'enrollment',
      type: 'relationship',
      relationTo: 'enrollments',
    },

    {
      name: 'credential',
      type: 'relationship',
      relationTo: 'credentials',
    },

    /* -----------------------------------------------
       DELIVERY STATE
    ----------------------------------------------- */
    {
      name: 'read',
      type: 'checkbox',
      defaultValue: false,
      index: true,
    },

    {
      name: 'readAt',
      type: 'date',
      admin: {
        description: 'Timestamp when the user opened the notification.',
      },
    },

    /* -----------------------------------------------
       DELIVERY CHANNELS (FUTURE)
    ----------------------------------------------- */
    {
      name: 'deliveryChannels',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'In-App', value: 'in-app' },
        { label: 'Email', value: 'email' },
        { label: 'Push', value: 'push' },
        { label: 'SMS', value: 'sms' },
      ],
      defaultValue: ['in-app'],
    },

    /* -----------------------------------------------
       EXPIRATION / CLEANUP
    ----------------------------------------------- */
    {
      name: 'expiresAt',
      type: 'date',
      admin: {
        description: 'Optional expiration (notification auto-hidden after this date).',
      },
    },
  ],

  /* =====================================================
     HOOKS
  ===================================================== */

  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Auto-set readAt timestamp
        if (operation === 'update' && data.read === true && !data.readAt) {
          data.readAt = new Date().toISOString()
        }
        return data
      },
    ],
  },
}
