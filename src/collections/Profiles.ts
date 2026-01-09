import type { CollectionConfig } from 'payload'

import { profileReadAccess, profileUpdateAccess, loggedIn, isAdmin } from '../access/control'

import { editableBySelfOrRole, staffOnlyField, adminOnlyField } from '../access/fieldAccess'

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
              admin: { description: 'Public profile slug' },
            },

            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
            },

            {
              name: 'bio',
              type: 'textarea',
              access: { update: editableBySelfOrRole('member') },
            },

            {
              name: 'testimony',
              type: 'textarea',
              label: 'Testimony / Faith Story',
              access: { update: editableBySelfOrRole('member') },
            },
          ],
        },

        /* =====================================================
           CONTACT & ADDRESS
        ===================================================== */
        {
          label: 'Contact & Address',
          fields: [
            {
              name: 'phone',
              type: 'text',
              label: 'Phone Number',
              admin: { description: 'Primary contact number' },
              access: { update: editableBySelfOrRole('member') },
            },

            {
              name: 'address',
              type: 'group',
              label: 'Mailing Address',
              access: { update: editableBySelfOrRole('member') },
              fields: [
                { name: 'street1', type: 'text' },
                { name: 'street2', type: 'text' },
                { name: 'city', type: 'text' },
                { name: 'state', type: 'text' },
                { name: 'postalCode', type: 'text' },
                {
                  name: 'country',
                  type: 'text',
                  defaultValue: 'United States',
                },
              ],
            },

            {
              name: 'preferredContactMethod',
              type: 'select',
              options: [
                { label: 'Email', value: 'email' },
                { label: 'Phone', value: 'phone' },
                { label: 'Text Message', value: 'text' },
              ],
              access: { update: editableBySelfOrRole('member') },
            },

            {
              name: 'doNotContact',
              type: 'checkbox',
              label: 'Do Not Contact',
              admin: {
                description: 'Honors communication preferences',
              },
              access: { update: editableBySelfOrRole('member') },
            },
          ],
        },

        /* =====================================================
           EMERGENCY CONTACTS
        ===================================================== */
        {
          label: 'Emergency Contacts',
          fields: [
            {
              name: 'emergencyContacts',
              type: 'array',
              minRows: 0,
              access: { update: editableBySelfOrRole('member') },
              fields: [
                { name: 'fullName', type: 'text', required: true },
                { name: 'relationship', type: 'text' },
                { name: 'phone', type: 'text', required: true },
                { name: 'email', type: 'email' },

                {
                  name: 'address',
                  type: 'group',
                  fields: [
                    { name: 'street1', type: 'text' },
                    { name: 'street2', type: 'text' },
                    { name: 'city', type: 'text' },
                    { name: 'state', type: 'text' },
                    { name: 'postalCode', type: 'text' },
                    { name: 'country', type: 'text' },
                  ],
                },

                { name: 'isPrimary', type: 'checkbox' },

                {
                  name: 'notes',
                  type: 'textarea',
                  admin: {
                    description: 'Medical, availability, or special instructions',
                  },
                },
              ],
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
              access: { update: staffOnlyField },
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
              access: { update: staffOnlyField },
            },

            {
              name: 'ministries',
              type: 'relationship',
              relationTo: 'ministries',
              hasMany: true,
              admin: {
                description: 'Ministries this person actively serves in',
              },
              access: { update: staffOnlyField },
            },

            {
              name: 'ministryFocus',
              type: 'text',
              admin: {
                description: 'Calling or area of passion (free text)',
              },
              access: { update: editableBySelfOrRole('leader') },
            },

            {
              name: 'volunteerInterests',
              type: 'select',
              hasMany: true,
              access: { update: editableBySelfOrRole('member') },
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
   HOUSEHOLD & FAMILY
===================================================== */
        {
          label: 'Household',
          fields: [
            {
              name: 'household',
              type: 'relationship',
              relationTo: 'households',
              admin: {
                description: 'Primary household this person belongs to',
              },
            },

            {
              name: 'householdRole',
              type: 'select',
              options: [
                { label: 'Head of Household', value: 'head' },
                { label: 'Spouse', value: 'spouse' },
                { label: 'Adult', value: 'adult' },
                { label: 'Youth', value: 'youth' },
                { label: 'Child', value: 'child' },
              ],
            },

            {
              name: 'emergencyContactNotes',
              type: 'textarea',
            },
          ],
        },

        /* =====================================================
   GIVING & STEWARDSHIP
===================================================== */
        {
          label: 'Giving & Stewardship',
          fields: [
            {
              name: 'isTither',
              type: 'select',
              options: [
                { label: 'Yes – Faithful Tither', value: 'yes' },
                { label: 'Occasional / Growing', value: 'growing' },
                { label: 'Not Currently', value: 'no' },
                { label: 'Prefer Not to Say', value: 'unspecified' },
              ],
              admin: {
                description: 'Self-reported tithing status (no amounts)',
              },
            },

            {
              name: 'givingFrequency',
              type: 'select',
              options: [
                { label: 'Weekly', value: 'weekly' },
                { label: 'Biweekly', value: 'biweekly' },
                { label: 'Monthly', value: 'monthly' },
                { label: 'Seasonal', value: 'seasonal' },
                { label: 'Special Offerings Only', value: 'special' },
              ],
            },

            {
              name: 'givingMethod',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'In-Person', value: 'in_person' },
                { label: 'Online', value: 'online' },
                { label: 'Text-to-Give', value: 'text' },
                { label: 'Recurring', value: 'recurring' },
              ],
            },

            {
              name: 'participatesInCampaigns',
              type: 'checkbox',
              label: 'Participates in Special Campaigns',
            },

            {
              name: 'givingNotes',
              type: 'textarea',
              admin: {
                description: 'Pastoral or stewardship notes (private)',
              },
            },

            {
              name: 'lastGaveAt',
              type: 'date',
              admin: {
                position: 'sidebar',
                description: 'Last recorded giving activity (optional)',
              },
            },

            {
              name: 'preferredGivingFund',
              type: 'text',
              admin: {
                description: 'e.g. Tithe, Missions, Building Fund',
              },
            },

            /* -----------------------------------------------
       OPTIONAL: RELATION TO DONATIONS COLLECTION
       (future-proof, safe to add now)
    ------------------------------------------------ */
            {
              name: 'donations',
              type: 'relationship',
              relationTo: 'donations',
              hasMany: true,
              admin: {
                description: 'Linked donation records (if enabled)',
                readOnly: true,
              },
            },
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
