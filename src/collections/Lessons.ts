// src/collections/Lessons.ts
import type { CollectionConfig } from 'payload'
import { lmsReadAccess, lmsWriteAccess } from '../access/control'

export const Lessons: CollectionConfig = {
  slug: 'lessons',

  labels: {
    singular: 'Lesson',
    plural: 'Lessons',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Learning System',
    defaultColumns: ['title', 'module', 'order'],
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
    {
      name: 'content',
      type: 'richText',
      label: 'Teaching Content',
    },
    {
      name: 'module',
      type: 'relationship',
      relationTo: 'modules',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      min: 1,
    },
    {
      name: 'assignments',
      type: 'relationship',
      relationTo: 'assignments',
      hasMany: true,
    },
  ],
}
