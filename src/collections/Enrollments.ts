// src/collections/Enrollments.ts
import type { CollectionConfig } from 'payload'
import { lmsReadAccess, lmsWriteAccess } from '../access/control'

export const Enrollments: CollectionConfig = {
  slug: 'enrollments',

  labels: {
    singular: 'Enrollment',
    plural: 'Enrollments',
  },

  admin: {
    useAsTitle: 'courseTitle',
    group: 'Pathways & Courses',
    defaultColumns: ['courseTitle', 'profile', 'status', 'startDate'],
  },

  access: {
    read: lmsReadAccess,
    create: lmsWriteAccess,
    update: lmsWriteAccess,
    delete: lmsWriteAccess,
  },

  fields: [
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
    },
    {
      name: 'courseTitle',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },
    {
      name: 'instructor',
      type: 'relationship',
      relationTo: 'profiles',
    },
    {
      name: 'mentor',
      type: 'relationship',
      relationTo: 'profiles',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'enrolled',
      options: [
        { label: 'Enrolled', value: 'enrolled' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Withdrawn', value: 'withdrawn' },
        { label: 'Failed / Incomplete', value: 'incomplete' },
      ],
    },
    {
      name: 'progress',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 0,
    },
    {
      name: 'certificateIssued',
      type: 'checkbox',
      defaultValue: false,
    },
    { name: 'startDate', type: 'date', required: true },
    { name: 'endDate', type: 'date' },
    { name: 'notes', type: 'textarea' },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data.course) {
          const course = await req.payload.findByID({
            collection: 'courses',
            id: data.course,
          })
          if (course?.title) data.courseTitle = course.title
        }
        return data
      },
    ],
  },
}
