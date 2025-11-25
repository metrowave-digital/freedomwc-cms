// src/collections/Modules.ts
import type { CollectionConfig } from 'payload'
import { lmsReadAccess, lmsWriteAccess } from '../access/control'

export const Modules: CollectionConfig = {
  slug: 'modules',

  labels: {
    singular: 'Module',
    plural: 'Modules',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Learning System',
    defaultColumns: ['title', 'course', 'order'],
  },

  access: {
    read: lmsReadAccess,
    create: lmsWriteAccess,
    update: lmsWriteAccess,
    delete: lmsWriteAccess,
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', unique: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      min: 1,
    },
    {
      name: 'lessons',
      type: 'relationship',
      relationTo: 'lessons',
      hasMany: true,
    },
  ],
}
