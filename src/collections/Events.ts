// src/collections/Events.ts
import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const Events: CollectionConfig = {
  slug: 'events',

  labels: {
    singular: 'Event',
    plural: 'Events',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Church Life',
    defaultColumns: ['title', 'eventType', 'startDate', 'location'],
  },

  access: {
    read: () => true,
    create: ({ req }) => hasRoleAtLeast(req, 'staff'),
    update: ({ req }) => hasRoleAtLeast(req, 'staff'),
    delete: ({ req }) => hasRoleAtLeast(req, 'admin'),
  },

  fields: [
    /* ----------------------------------
       CORE EVENT INFO
    ---------------------------------- */
    { name: 'title', type: 'text', required: true },

    { name: 'description', type: 'textarea' },

    {
      name: 'eventType',
      type: 'select',
      required: true,
      options: [
        { label: 'Church Event', value: 'church' },
        { label: 'Prayer Call', value: 'prayer-call' },
        { label: 'Workshop', value: 'workshop' },
        { label: 'Retreat', value: 'retreat' },
        { label: 'Special Service', value: 'service' },
      ],
    },

    /* ----------------------------------
       DATE / TIME
    ---------------------------------- */
    { name: 'startDate', type: 'date', required: true },

    { name: 'endDate', type: 'date' },

    {
      name: 'location',
      type: 'text',
    },

    {
      name: 'virtualLink',
      type: 'text',
    },

    /* ----------------------------------
       LEADERSHIP
    ---------------------------------- */
    {
      name: 'facilitators',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
    },

    /* ----------------------------------
       PRAYER CALL EXTENSIONS (OPTIONAL)
    ---------------------------------- */
    {
      name: 'spiritualFocus',
      type: 'textarea',
      admin: {
        description: 'Theme, scripture, or intention for prayer calls.',
      },
    },

    {
      name: 'relatedPrayerRequests',
      type: 'relationship',
      relationTo: 'prayer-requests',
      hasMany: true,
      admin: {
        description: 'Optional prayer requests to highlight.',
      },
    },

    {
      name: 'requiresSession',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'If checked, a Session should be created for attendance.',
      },
    },

    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
