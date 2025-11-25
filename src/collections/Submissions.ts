// src/collections/Submissions.ts
import type { CollectionConfig } from 'payload'
import { submissionAccess, instructorsOnly } from '../access/control'
import { getSignedLmsUrl } from '../utils/signedUrls'

export const Submissions: CollectionConfig = {
  slug: 'submissions',

  labels: {
    singular: 'Submission',
    plural: 'Submissions',
  },

  admin: {
    useAsTitle: 'assignmentTitle',
    group: 'Learning System',
    defaultColumns: ['assignmentTitle', 'profile', 'status', 'submittedAt'],
  },

  // ⚠️ NOTE: You're running Payload with NO AUTH.
  // So req.user is ALWAYS undefined.
  // I updated your access rules accordingly:
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },

  fields: [
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
    },
    {
      name: 'assignment',
      type: 'relationship',
      relationTo: 'assignments',
      required: true,
    },
    {
      name: 'lesson',
      type: 'relationship',
      relationTo: 'lessons',
      required: true,
    },
    {
      name: 'assignmentTitle',
      type: 'text',
      admin: { readOnly: true },
    },
    {
      name: 'textEntry',
      type: 'textarea',
      label: 'Reflection / Written Response',
    },
    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Uploaded Files',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'submitted',
      options: [
        { label: 'Submitted', value: 'submitted' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Needs Revision', value: 'revise' },
        { label: 'Accepted / Passed', value: 'passed' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'grade',
      type: 'text',
    },
    {
      name: 'feedback',
      type: 'textarea',
      label: 'Instructor Feedback',
    },
    {
      name: 'submittedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data.assignment) {
          const assignment = await req.payload.findByID({
            collection: 'assignments',
            id: data.assignment,
          })
          if (assignment?.title) {
            data.assignmentTitle = assignment.title
          }
        }
        return data
      },
    ],

    afterRead: [
      async ({ doc }) => {
        // No auth → no need to hide attachments
        return doc
      },
    ],
  },
}
