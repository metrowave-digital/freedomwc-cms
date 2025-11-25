// src/collections/Assignments.ts
import type { CollectionConfig } from 'payload'
import { lmsReadAccess, lmsWriteAccess } from '../access/control'

export const Assignments: CollectionConfig = {
  slug: 'assignments',

  labels: {
    singular: 'Assignment',
    plural: 'Assignments',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Learning System',
    defaultColumns: ['title', 'lesson', 'type'],
  },

  access: {
    read: lmsReadAccess,
    create: lmsWriteAccess,
    update: lmsWriteAccess,
    delete: lmsWriteAccess,
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'type',
      type: 'relationship',
      relationTo: 'assignment-types',
      required: false,
    },
    {
      name: 'lesson',
      type: 'relationship',
      relationTo: 'lessons',
      required: true,
    },
    {
      name: 'instructions',
      type: 'richText',
    },
    {
      name: 'scripture',
      type: 'text',
      label: 'Scripture Reference',
    },
    {
      name: 'reading',
      type: 'textarea',
      label: 'Reading Assignment',
    },
    {
      name: 'order',
      type: 'number',
      min: 1,
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
}
