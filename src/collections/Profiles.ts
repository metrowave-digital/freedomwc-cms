// src/collections/Profiles.ts

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
    //
    // 🔥 Payload v3 Tabs Wrapper — REQUIRED
    //
    {
      type: 'tabs',
      tabs: [
        //
        // ────────────────────────────────────────────────
        // BASIC INFO
        // ────────────────────────────────────────────────
        //
        {
          label: 'Basic Info',
          fields: [
            { name: 'displayName', type: 'text', required: true },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              admin: {
                description: 'Auto or manually set profile slug.',
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

        //
        // ────────────────────────────────────────────────
        // PATHWAYS & MINISTRY
        // ────────────────────────────────────────────────
        //
        {
          label: 'Pathways & Ministry',
          fields: [
            {
              name: 'pathwaysPhase',
              type: 'select',
              defaultValue: 'none',
              options: [
                {
                  label: 'Phase 1: Foundations of Christ-Centered Self & Spiritual Awareness',
                  value: 'restore',
                },
                {
                  label: 'Phase 2: Inner Transformation & Purpose Discovery',
                  value: 'root',
                },
                {
                  label: 'Phase 3: Community, Relationships & Leadership',
                  value: 'rise',
                },
                {
                  label: 'Phase 4: Spiritual Mastery, Service & Manifestation',
                  value: 'release',
                },
                { label: 'Alumni', value: 'alumni' },
                { label: 'Not Enrolled', value: 'none' },
              ],
            },
            {
              name: 'pathwaysProgress',
              type: 'number',
              label: 'Pathways Progress (%)',
              min: 0,
              max: 100,
              defaultValue: 0,
            },
            {
              name: 'ministryFocus',
              type: 'text',
              label: 'Ministry / Service Focus',
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

        //
        // ────────────────────────────────────────────────
        // SKILLS & GIFTS
        // ────────────────────────────────────────────────
        //
        {
          label: 'Skills & Gifts',
          fields: [
            {
              name: 'spiritualGifts',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Teaching', value: 'teaching' },
                { label: 'Leadership', value: 'leadership' },
                { label: 'Wisdom', value: 'wisdom' },
                { label: 'Prophecy', value: 'prophecy' },
                { label: 'Healing', value: 'healing' },
                { label: 'Encouragement', value: 'encouragement' },
                { label: 'Service', value: 'service' },
                { label: 'Administration', value: 'administration' },
                { label: 'Evangelism', value: 'evangelism' },
                { label: 'Faith', value: 'faith' },
              ],
            },
            { name: 'skills', type: 'text', label: 'Skills' },
          ],
        },

        //
        // ────────────────────────────────────────────────
        // ASSESSMENTS
        // ────────────────────────────────────────────────
        //
        {
          label: 'Assessments',
          fields: [
            {
              name: 'discProfile',
              type: 'select',
              options: [
                { label: 'D', value: 'd' },
                { label: 'I', value: 'i' },
                { label: 'S', value: 's' },
                { label: 'C', value: 'c' },
              ],
            },
            {
              name: 'enneagram',
              type: 'select',
              options: ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((n) => ({
                label: n,
                value: n,
              })),
            },
            {
              name: 'spiritualGiftAssessment',
              type: 'textarea',
            },
          ],
        },

        //
        // ────────────────────────────────────────────────
        // BADGES & ACHIEVEMENTS
        // ────────────────────────────────────────────────
        //
        {
          label: 'Badges & Achievements',
          fields: [
            {
              name: 'badges',
              type: 'array',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'icon', type: 'upload', relationTo: 'media' },
                { name: 'earnedDate', type: 'date' },
              ],
            },
          ],
        },

        //
        // ────────────────────────────────────────────────
        // LEADERSHIP TRACK
        // ────────────────────────────────────────────────
        //
        {
          label: 'Leadership Track',
          fields: [
            { name: 'isMentor', type: 'checkbox', label: 'Mentor / Coach' },
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

        //
        // ────────────────────────────────────────────────
        // SOCIAL LINKS
        // ────────────────────────────────────────────────
        //
        {
          label: 'Social Links',
          fields: [
            {
              name: 'social',
              type: 'group',
              fields: [
                { name: 'facebook', type: 'text' },
                { name: 'instagram', type: 'text' },
                { name: 'twitter', type: 'text' },
                { name: 'tiktok', type: 'text' },
                { name: 'website', type: 'text' },
              ],
            },
          ],
        },

        //
        // ────────────────────────────────────────────────
        // CONTACT PREFERENCES
        // ────────────────────────────────────────────────
        //
        {
          label: 'Contact Preferences',
          fields: [
            {
              name: 'contactPreference',
              type: 'select',
              options: [
                { label: 'Email', value: 'email' },
                { label: 'Phone Call', value: 'call' },
                { label: 'Text Message', value: 'text' },
              ],
            },
            { name: 'doNotContact', type: 'checkbox' },
          ],
        },

        //
        // ────────────────────────────────────────────────
        // USER LINK
        // ────────────────────────────────────────────────
        //
        {
          label: 'User Link',
          fields: [{ name: 'user', type: 'relationship', relationTo: 'users' }],
        },

        //
        // ────────────────────────────────────────────────
        // LEADERSHIP & RELATIONSHIPS
        // ────────────────────────────────────────────────
        //
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

        //
        // ────────────────────────────────────────────────
        // COURSE ENROLLMENTS
        // ────────────────────────────────────────────────
        //
        {
          label: 'Course Enrollments',
          fields: [
            {
              name: 'enrollments',
              type: 'relationship',
              relationTo: 'enrollments',
              hasMany: true,
            },
          ],
        },

        //
        // ────────────────────────────────────────────────
        // MULTI-ROLE SYSTEM
        // ────────────────────────────────────────────────
        //
        {
          label: 'Roles',
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
                description: 'Ministry / leadership roles for this person.',
              },
            },
          ],
        },

        //
        // ────────────────────────────────────────────────
        // SEO
        // ────────────────────────────────────────────────
        //
        {
          label: 'SEO',
          fields: Array.isArray(SEOFields) ? [...SEOFields] : [SEOFields],
        },
      ],
    },
  ],
}
