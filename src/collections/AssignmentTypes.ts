// src/collections/AssignmentTypes.ts
import type { CollectionConfig } from 'payload'
import { lmsReadAccess, lmsWriteAccess } from '../access/control'

export const AssignmentTypes: CollectionConfig = {
  slug: 'assignment-types',

  labels: {
    singular: 'Assignment Type',
    plural: 'Assignment Types',
  },

  admin: {
    useAsTitle: 'label',
    group: 'Learning System',
    defaultColumns: ['label', 'requiresSubmission'],
  },

  access: {
    read: lmsReadAccess,
    create: lmsWriteAccess,
    update: lmsWriteAccess,
    delete: lmsWriteAccess,
  },

  fields: [
    { name: 'label', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'requiresSubmission',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'allowAttachments',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'allowTextEntry',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'metadata',
      type: 'json',
      label: 'Extra Config',
    },
  ],
}
