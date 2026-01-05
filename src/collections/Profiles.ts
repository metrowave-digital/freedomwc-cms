import type { CollectionConfig } from 'payload'
import { profileReadAccess, profileUpdateAccess, loggedIn, isAdmin } from '../access/control'
import { ROLE_LIST } from '../access/roles'
import { SEOFields } from '../fields/seo'

export const Profiles: CollectionConfig = {
  slug: 'profiles',

  labels: {
    singular: 'Profile',
    plural: 'Profiles',
  },

  admin: {
    useAsTitle: 'displayName',
    group: 'People',
    defaultColumns: ['displayName', 'slug', 'pathwaysPhase', 'ministryFocus', 'user'],
  },

  access: {
    read: profileReadAccess,
    create: loggedIn,
    update: profileUpdateAccess,
    delete: isAdmin,
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        /* =====================================================
           BASIC INFO
        ===================================================== */
        {
          label: 'Basic Info',
          fields: [
            { name: 'displayName', type: 'text', required: true },

            {
              name: 'slug',
              type: 'text',
              unique: true,
              admin: {
                description: 'Public profile slug',
              },
            },

            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
            },

            { name: 'bio', type: 'textarea' },

            {
              name: 'testimony',
              type: 'textarea',
              label: 'Testimony / Faith Story',
            },
          ],
        },

        /* =====================================================
           PATHWAYS & FORMATION
        ===================================================== */
        {
          label: 'Pathways & Ministry',
          fields: [
            {
              name: 'pathwaysPhase',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'Phase 1 – Restore', value: 'restore' },
                { label: 'Phase 2 – Root', value: 'root' },
                { label: 'Phase 3 – Rise', value: 'rise' },
                { label: 'Phase 4 – Release', value: 'release' },
                { label: 'Alumni', value: 'alumni' },
                { label: 'Not Enrolled', value: 'none' },
              ],
            },

            {
              name: 'pathwaysProgress',
              type: 'number',
              min: 0,
              max: 100,
              defaultValue: 0,
            },

            {
              name: 'ministryFocus',
              type: 'text',
            },

            {
              name: 'volunteerInterests',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Hospitality', value: 'hospitality' },
                { label: 'Worship / Music', value: 'worship' },
                { label: 'Creative / Media', value: 'creative' },
                { label: 'Outreach', value: 'outreach' },
                { label: 'Youth / Teens', value: 'youth' },
                { label: 'Teaching', value: 'teaching' },
                { label: 'Prayer Team', value: 'prayer' },
                { label: 'Events', value: 'events' },
              ],
            },
          ],
        },

        /* =====================================================
           SKILLS & GIFTS
        ===================================================== */
        {
          label: 'Skills & Gifts',
          fields: [
            {
              name: 'spiritualGifts',
              type: 'select',
              hasMany: true,
              options: [
                'teaching',
                'leadership',
                'wisdom',
                'prophecy',
                'healing',
                'encouragement',
                'service',
                'administration',
                'evangelism',
                'faith',
              ].map((v) => ({
                label: v.charAt(0).toUpperCase() + v.slice(1),
                value: v,
              })),
            },

            { name: 'skills', type: 'text' },
          ],
        },

        /* =====================================================
           PERSONAL ASSESSMENTS
        ===================================================== */
        {
          label: 'Assessments',
          fields: [
            {
              name: 'discProfile',
              type: 'select',
              options: ['d', 'i', 's', 'c'].map((v) => ({
                label: v.toUpperCase(),
                value: v,
              })),
            },

            {
              name: 'enneagram',
              type: 'select',
              options: Array.from({ length: 9 }).map((_, i) => ({
                label: String(i + 1),
                value: String(i + 1),
              })),
            },

            {
              name: 'spiritualGiftAssessment',
              type: 'textarea',
            },
          ],
        },

        /* =====================================================
           BADGES & ACHIEVEMENTS
        ===================================================== */
        {
          label: 'Badges & Achievements',
          fields: [
            {
              name: 'badges',
              type: 'array',
              fields: [
                { name: 'title', type: 'text' },
                {
                  name: 'icon',
                  type: 'upload',
                  relationTo: 'media',
                },
                { name: 'earnedDate', type: 'date' },
              ],
            },
          ],
        },

        /* =====================================================
           LEADERSHIP SIGNALS (NOT LMS ROLES)
        ===================================================== */
        {
          label: 'Leadership Track',
          fields: [
            {
              name: 'isMentorCandidate',
              type: 'checkbox',
              label: 'Mentor Candidate',
            },

            {
              name: 'leadershipTrackStatus',
              type: 'select',
              options: [
                { label: 'Not Enrolled', value: 'none' },
                { label: 'In Training', value: 'training' },
                { label: 'Serving', value: 'serving' },
                { label: 'Leading', value: 'leading' },
              ],
            },

            { name: 'leadershipNotes', type: 'textarea' },
          ],
        },

        /* =====================================================
           RELATIONSHIPS
        ===================================================== */
        {
          label: 'Leadership & Relationships',
          fields: [
            {
              name: 'accountabilityPartner',
              type: 'relationship',
              relationTo: 'profiles',
            },

            { name: 'accountabilityNotes', type: 'textarea' },

            {
              name: 'pastorOrMinistryLead',
              type: 'relationship',
              relationTo: 'profiles',
            },

            { name: 'leaderNotes', type: 'textarea' },
          ],
        },

        /* =====================================================
           USER LINK (AUTH)
        ===================================================== */
        {
          label: 'User',
          fields: [
            {
              name: 'user',
              type: 'relationship',
              relationTo: 'users',
            },
          ],
        },

        /* =====================================================
           ROLE SIGNALS (NOT AUTH)
        ===================================================== */
        {
          label: 'Ministry Roles (Signal Only)',
          fields: [
            {
              name: 'roles',
              type: 'select',
              hasMany: true,
              options: ROLE_LIST.map((r) => ({
                label: r.toUpperCase(),
                value: r,
              })),
              admin: {
                description: 'Indicative roles only. Actual permissions come from Users.',
              },
            },
          ],
        },

        /* =====================================================
           SEO / PUBLIC PROFILE
        ===================================================== */
        {
          label: 'SEO',
          fields: Array.isArray(SEOFields) ? [...SEOFields] : [SEOFields],
        },
      ],
    },
  ],
}
