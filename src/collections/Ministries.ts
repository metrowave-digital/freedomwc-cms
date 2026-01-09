import type { CollectionConfig } from 'payload'

export const Ministries: CollectionConfig = {
  slug: 'ministries',

  labels: {
    singular: 'Ministry',
    plural: 'Ministries',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Community',
    defaultColumns: ['title', 'status', 'leader'],
  },

  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Ministry Name',
    },

    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },

    {
      name: 'leader',
      type: 'relationship',
      relationTo: 'profiles',
      label: 'Ministry Leader',
    },

    {
      name: 'teamMembers',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      label: 'Team Members',
    },

    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Seasonal', value: 'seasonal' },
        { label: 'Paused', value: 'paused' },
      ],
    },

    {
      name: 'meetingSchedule',
      type: 'text',
      label: 'Meeting Schedule',
    },

    {
      name: 'notes',
      type: 'textarea',
      label: 'Internal Notes',
    },
  ],
}
