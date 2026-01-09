import type { CollectionConfig } from 'payload'

export const Households: CollectionConfig = {
  slug: 'households',

  labels: {
    singular: 'Household',
    plural: 'Households',
  },

  admin: {
    useAsTitle: 'name',
    group: 'People',
    defaultColumns: ['name', 'campus', 'isActive'],
  },

  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Household Name',
      admin: {
        description: 'e.g. The Johnson Family',
      },
    },

    {
      name: 'members',
      type: 'relationship',
      relationTo: 'profiles',
      hasMany: true,
      label: 'Household Members',
    },

    {
      name: 'primaryContact',
      type: 'relationship',
      relationTo: 'profiles',
      label: 'Primary Contact',
    },

    {
      name: 'campus',
      type: 'text',
      label: 'Campus / Location',
    },

    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Active Household',
    },

    {
      name: 'notes',
      type: 'textarea',
      label: 'Pastoral Notes',
    },
  ],
}
