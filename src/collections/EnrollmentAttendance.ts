import type { CollectionConfig } from 'payload'
import { hasRoleAtLeast } from '../access/roles'

export const EnrollmentAttendance: CollectionConfig = {
  slug: 'enrollment-attendance',

  labels: {
    singular: 'Enrollment Attendance',
    plural: 'Enrollment Attendance',
  },

  admin: {
    useAsTitle: 'id',
    group: 'Pathways & Courses',
    defaultColumns: ['profile', 'session', 'attendanceStatus', 'recordedAt'],
  },

  access: {
    /**
     * READ
     * - Learner can see their own
     * - Mentors / Instructors / Leaders can see all
     */
    read: ({ req }) => {
      if (!req.user) return false
      if (hasRoleAtLeast(req, 'mentor')) return true
      return {
        profile: {
          equals: req.user.profile,
        },
      }
    },

    /**
     * CREATE / UPDATE
     * - Instructor, mentor, leader
     */
    create: ({ req }) => hasRoleAtLeast(req, 'mentor'),
    update: ({ req }) => hasRoleAtLeast(req, 'mentor'),

    /**
     * DELETE
     * - Admin only
     */
    delete: ({ req }) => hasRoleAtLeast(req, 'admin'),
  },

  fields: [
    /* =====================================================
       CONTEXT
    ===================================================== */
    {
      name: 'enrollment',
      type: 'relationship',
      relationTo: 'enrollments',
      required: true,
      index: true,
    },

    {
      name: 'session',
      type: 'relationship',
      relationTo: 'sessions',
      required: true,
      index: true,
    },

    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      required: true,
      index: true,
    },

    /* =====================================================
       ATTENDANCE DATA
    ===================================================== */
    {
      name: 'attendanceStatus',
      type: 'select',
      required: true,
      options: [
        { label: 'Present', value: 'present' },
        { label: 'Late', value: 'late' },
        { label: 'Excused', value: 'excused' },
        { label: 'Absent', value: 'absent' },
      ],
    },

    {
      name: 'attendanceMode',
      type: 'select',
      options: [
        { label: 'In Person', value: 'in-person' },
        { label: 'Virtual', value: 'virtual' },
      ],
    },

    /* =====================================================
       METADATA
    ===================================================== */
    {
      name: 'recordedBy',
      type: 'relationship',
      relationTo: 'users',
    },

    {
      name: 'recordedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Pastoral or instructional context for this record.',
      },
    },
  ],
}
