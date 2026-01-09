import type { CollectionConfig } from 'payload'
import { ROLE_LIST, type FWCRole } from '../access/roles'
import { allowIfSelfOrAdmin, isAdmin } from '../access/control'

export const Users: CollectionConfig = {
  slug: 'users',

  auth: {
    verify: false,
  },

  admin: {
    useAsTitle: 'email',
    group: 'Access',
    defaultColumns: ['email', 'roles', 'createdAt'],
  },

  access: {
    read: ({ req }) => {
      // Allow admins
      if (isAdmin({ req })) return true

      // Allow trusted server-side resolution via API key
      const authHeader = req.headers.get('authorization')
      if (authHeader?.startsWith('users API-Key')) {
        return true
      }

      return false
    },

    create: ({ req }) => {
      // ✅ Allow trusted server-side creation via API key
      const authHeader = req.headers.get('authorization')
      if (authHeader?.startsWith('users API-Key')) {
        return true
      }

      // Fallback to admin-only
      return isAdmin({ req })
    },

    update: allowIfSelfOrAdmin,
    delete: isAdmin,
  },

  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (Array.isArray(data.roles)) {
          data.roles = Array.from(
            new Set(
              data.roles
                .map((r: unknown) => String(r).toLowerCase())
                .filter((r): r is FWCRole => ROLE_LIST.includes(r as FWCRole)),
            ),
          )
        }
        return data
      },
    ],
  },

  fields: [
    /* -----------------------------
       AUTH PROVIDER
    ----------------------------- */
    {
      name: 'auth0Id',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auth0 subject (auth0|xxxx)',
      },
    },

    {
      name: 'neonUserId',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Neon Auth user ID (canonical identity)',
      },
    },

    /* -----------------------------
       LOGIN IDENTITY
    ----------------------------- */
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },

    /* -----------------------------
   LEGAL NAME (IDENTITY)
----------------------------- */
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
    },

    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
    },

    /* -----------------------------
       RBAC
    ----------------------------- */
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['viewer'],
      options: ROLE_LIST.map((r) => ({
        label: r.toUpperCase(),
        value: r,
      })),
    },

    /* -----------------------------
       PROFILE LINK (CANONICAL)
    ----------------------------- */
    {
      name: 'profile',
      type: 'relationship',
      relationTo: 'profiles',
      admin: {
        description: 'Canonical human profile (bio, testimony, formation).',
      },
    },
  ],
}
