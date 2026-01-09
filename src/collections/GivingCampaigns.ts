import type { CollectionConfig } from 'payload'

export const GivingCampaigns: CollectionConfig = {
  slug: 'giving-campaigns',

  labels: {
    singular: 'Giving Campaign',
    plural: 'Giving Campaigns',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Finance',
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Campaign Name',
    },

    {
      name: 'description',
      type: 'textarea',
    },

    {
      name: 'startDate',
      type: 'date',
    },

    {
      name: 'endDate',
      type: 'date',
    },

    {
      name: 'donations',
      type: 'relationship',
      relationTo: 'donations',
      hasMany: true,
    },
  ],
}
