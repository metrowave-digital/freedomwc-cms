// src/collections/Applications.ts
import type { CollectionConfig } from 'payload'
import { staffOnly } from '../access/control'

export const Applications: CollectionConfig = {
  slug: 'applications',

  admin: {
    useAsTitle: 'fullName',
    group: 'Applications',
    defaultColumns: ['fullName', 'email', 'phase', 'status', 'createdAt'],
  },

  access: {
    read: staffOnly,
    create: () => true, // public can apply
    update: staffOnly,
    delete: staffOnly,
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Personal Information',
          fields: [
            { name: 'fullName', type: 'text', required: true },
            { name: 'preferredName', type: 'text' },
            { name: 'dateOfBirth', type: 'date' },
            {
              name: 'gender',
              type: 'select',
              options: [
                { label: 'Male', value: 'male' },
                { label: 'Female', value: 'female' },
                { label: 'Non-binary', value: 'nonbinary' },
                { label: 'Prefer not to say', value: 'prefer-not' },
              ],
            },
            { name: 'phone', type: 'text', required: true },
            { name: 'email', type: 'email', required: true },
            { name: 'address', type: 'textarea', label: 'Home Address' },
          ],
        },

        {
          label: 'Church & Community',
          fields: [
            {
              name: 'fwcMember',
              type: 'select',
              label: 'Are you currently a member of Freedom Worship Center?',
              options: [
                { label: 'Yes', value: 'yes' },
                { label: 'No, but I attend regularly', value: 'attend' },
                { label: 'No, but interested in joining', value: 'interested' },
                { label: 'No, I attend another church', value: 'other-church' },
              ],
            },
            { name: 'churchName', type: 'text' },
            {
              name: 'previousPrograms',
              type: 'select',
              options: [
                { label: 'Yes', value: 'yes' },
                { label: 'No', value: 'no' },
              ],
            },
            {
              name: 'previousProgramsDescription',
              type: 'textarea',
            },
          ],
        },

        {
          label: 'Program Interest',
          fields: [
            {
              name: 'phase',
              type: 'select',
              required: true,
              options: [
                { label: 'Phase 1: Restore', value: 'restore' },
                { label: 'Phase 2: Root', value: 'root' },
                { label: 'Phase 3: Rise', value: 'rise' },
                { label: 'Phase 4: Release', value: 'release' },
                { label: 'Not sure — help me decide', value: 'unsure' },
              ],
            },
            { name: 'whyJoin', type: 'textarea' },
            { name: 'spiritualGoals', type: 'textarea' },
          ],
        },

        {
          label: 'Availability',
          fields: [
            {
              name: 'preferredMeetingTime',
              type: 'select',
              required: true,
              options: [
                { label: 'Weeknights', value: 'weeknights' },
                { label: 'Saturday mornings', value: 'saturday' },
                { label: 'Sunday afternoons', value: 'sunday' },
                { label: 'Flexible / Any time', value: 'any' },
              ],
            },
            {
              name: 'meetingFrequency',
              type: 'select',
              required: true,
              options: [
                { label: 'Weekly', value: 'weekly' },
                { label: 'Bi-weekly', value: 'biweekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Not sure yet', value: 'unsure' },
              ],
            },
          ],
        },

        {
          label: 'Support Needs',
          fields: [
            {
              name: 'supportNeeds',
              type: 'select',
              hasMany: true,
              label: 'Do you need accommodations or support?',
              options: [
                { label: 'Virtual option', value: 'virtual' },
                { label: 'Accessibility accommodations', value: 'accessibility' },
                { label: 'Other', value: 'other' },
              ],
            },
            {
              name: 'otherSupport',
              type: 'text',
              admin: {
                condition: (_, siblingData) =>
                  Array.isArray(siblingData.supportNeeds) &&
                  siblingData.supportNeeds.includes('other'),
              },
            },
          ],
        },

        {
          label: 'Commitment',
          fields: [
            {
              name: 'agreement',
              type: 'checkbox',
              required: true,
            },
            { name: 'signature', type: 'text', required: true },
            { name: 'signatureDate', type: 'date', required: true },
          ],
        },

        {
          label: 'Admin',
          fields: [
            {
              name: 'status',
              type: 'select',
              required: true,
              defaultValue: 'pending',
              options: [
                { label: 'Pending Review', value: 'pending' },
                { label: 'Interview Scheduled', value: 'interview' },
                { label: 'Accepted', value: 'accepted' },
                { label: 'Waitlisted', value: 'waitlisted' },
                { label: 'Not Accepted', value: 'rejected' },
              ],
            },
            { name: 'adminNotes', type: 'textarea' },
          ],
        },
      ],
    },
  ],

  hooks: {
    afterChange: [
      async ({ req, doc, operation }) => {
        if (operation !== 'create') return

        // email to applicant
        try {
          await req.payload.sendEmail({
            to: doc.email,
            subject: 'We Received Your Pathways Application',
            html: `<p>Hi ${doc.fullName},</p>
           <p>Thank you for applying to the Pathways Program at Freedom Worship Center.</p>
           <p>Our team will review your application and follow up with next steps.</p>`,
          })
        } catch (e) {
          req.payload.logger.warn(`Failed to send applicant email: ${String(e)}`)
        }

        // email to admin
        try {
          await req.payload.sendEmail({
            to: process.env.PATHWAYS_ADMIN_EMAIL || 'pathways@freedomwc.org',
            subject: 'New Pathways Application Submitted',
            html: `<p><strong>Name:</strong> ${doc.fullName}</p>
           <p><strong>Email:</strong> ${doc.email}</p>`,
          })
        } catch (e) {
          req.payload.logger.warn(`Failed to send admin notification email: ${String(e)}`)
        }
      },
    ],
  },
}
