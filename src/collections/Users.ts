// src/collections/Users.ts
import type { CollectionConfig } from 'payload'
import { ROLE_LIST, type FWCRole } from '../access/roles'
import { allowIfSelfOrAdmin, isAdmin } from '../access/control'

// --------------------------------------
// AUTH0 STRATEGY PLACEHOLDER
// (Uncomment when you add authentication)
// --------------------------------------
// import { Auth0CustomStrategy } from '../auth/Auth0CustomStrategy'

export const Users: CollectionConfig = {
  slug: 'users',

  // Required for Payload auth + req.user
  auth: {
    verify: false, // Auth0 handles email verification

    // --------------------------------------
    // AUTH0 STRATEGY: commented out for now
    // (uncomment when ready to integrate)
    // --------------------------------------
    // strategies: [Auth0CustomStrategy],
  },

  admin: {
    useAsTitle: 'email',
    group: 'Access',
    defaultColumns: ['email', 'roles', 'emailVerified', 'createdAt'],
  },

  access: {
    read: isAdmin,
    create: isAdmin,
    update: allowIfSelfOrAdmin,
    delete: isAdmin,
  },

  hooks: {
    beforeChange: [
      async ({ data }) => {
        // Normalize multi-roles safely
        if (data.roles) {
          const normalized = (data.roles as unknown[])
            .map((r) => String(r).toLowerCase())
            .filter((r): r is FWCRole => ROLE_LIST.includes(r as FWCRole))

          data.roles = Array.from(new Set(normalized))
        }

        return data
      },
    ],
  },

  fields: [
    // ----------------------------------------------------------------------
    // AUTH0 INTERNAL ID
    // ----------------------------------------------------------------------
    {
      name: 'auth0Id',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auth0 user ID (e.g., auth0|123...)',
      },
    },

    // ----------------------------------------------------------------------
    // EMAIL + VERIFICATION
    // ----------------------------------------------------------------------
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },

    {
      name: 'emailVerified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Synced from Auth0 → email_verified',
      },
    },

    // ----------------------------------------------------------------------
    // ROLE-BASED ACCESS CONTROL (RBAC)
    // ----------------------------------------------------------------------
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['viewer'],
      options: ROLE_LIST.map((r: FWCRole) => ({
        label: r.toUpperCase(),
        value: r,
      })),
    },

    // ----------------------------------------------------------------------
    // PROFILE RELATION
    // ----------------------------------------------------------------------
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        description: 'Connect to user profile',
      },
    },
  ],
}
