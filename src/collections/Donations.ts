import type { CollectionConfig } from 'payload'

export const Donations: CollectionConfig = {
  slug: 'donations',

  labels: {
    singular: 'Donation',
    plural: 'Donations',
  },

  admin: {
    useAsTitle: 'reference',
    group: 'Finance',
    defaultColumns: ['reference', 'donor', 'fund', 'date'],
  },

  access: {
    read: ({ req }) => {
      // Allow admins
      if (req.user && req.user.roles?.includes('admin')) return true

      // Allow pastors (optional)
      if (req.user && req.user.roles?.includes('pastor')) return true

      // Otherwise deny
      return false
    },
  },

  fields: [
    {
      name: 'donor',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      label: 'Donor',
    },

    {
      name: 'amount',
      type: 'number',
      label: 'Amount',
      min: 0,
    },

    {
      name: 'fund',
      type: 'text',
      label: 'Fund',
      admin: {
        description: 'e.g. Tithe, Missions, Building Fund',
      },
    },

    {
      name: 'method',
      type: 'select',
      label: 'Giving Method',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'Text-to-Give', value: 'text' },
        { label: 'In Person', value: 'in_person' },
        { label: 'Check', value: 'check' },
      ],
    },

    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Date Given',
    },

    {
      name: 'reference',
      type: 'text',
      label: 'Transaction Reference',
    },

    {
      name: 'notes',
      type: 'textarea',
      label: 'Finance Notes',
    },
  ],
}
