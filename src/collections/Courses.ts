// src/collections/Courses.ts
import type { CollectionConfig } from 'payload'
import { lmsReadAccess, lmsWriteAccess } from '../access/control'

export const Courses: CollectionConfig = {
  slug: 'courses',

  labels: {
    singular: 'Course',
    plural: 'Courses',
  },

  admin: {
    useAsTitle: 'title',
    group: 'Pathways & Courses',
    defaultColumns: ['title', 'courseType', 'pathwaysPhase', 'isActive'],
  },

  access: {
    read: lmsReadAccess,
    create: lmsWriteAccess,
    update: lmsWriteAccess,
    delete: lmsWriteAccess,
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Info',
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'slug', type: 'text', unique: true },
            { name: 'summary', type: 'text' },
            { name: 'description', type: 'textarea' },
            {
              name: 'courseType',
              type: 'select',
              required: true,
              options: [
                { label: 'Pathways Phase', value: 'pathways-phase' },
                { label: 'Weekly Class', value: 'weekly-class' },
                { label: 'Workshop', value: 'workshop' },
                { label: 'Leadership Lab', value: 'leadership-lab' },
                { label: 'Mentorship Track', value: 'mentorship' },
                { label: 'Certification Course', value: 'certification' },
                { label: 'On-Demand Module', value: 'module' },
              ],
            },
            {
              name: 'pathwaysPhase',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'Phase 1: Restore', value: 'restore' },
                { label: 'Phase 2: Root', value: 'root' },
                { label: 'Phase 3: Rise', value: 'rise' },
                { label: 'Phase 4: Release', value: 'release' },
                { label: 'General / All', value: 'all' },
                { label: 'Not tied to Pathways', value: 'none' },
              ],
            },
          ],
        },
        {
          label: 'Modules',
          fields: [
            {
              name: 'modules',
              type: 'relationship',
              relationTo: 'modules',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Instructors',
          fields: [
            {
              name: 'instructors',
              type: 'relationship',
              relationTo: 'profiles',
              hasMany: true,
            },
          ],
        },
        {
          label: 'Schedule',
          fields: [
            { name: 'startDate', type: 'date' },
            { name: 'endDate', type: 'date' },
            { name: 'meetingDay', type: 'text' },
            { name: 'meetingTime', type: 'text' },
          ],
        },
        {
          label: 'Media',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
          ],
        },
        {
          label: 'Publishing',
          fields: [
            { name: 'isActive', type: 'checkbox', defaultValue: true },
            { name: 'featured', type: 'checkbox' },
            { name: 'publishedAt', type: 'date' },
          ],
        },
      ],
    },
  ],
}
