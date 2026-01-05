import type { CollectionConfig } from 'payload'
import { ROLE_LIST, type FWCRole } from '../access/roles'
import { allowIfSelfOrAdmin, isAdmin } from '../access/control'

export const Users: CollectionConfig = {
  slug: 'users',

  auth: {
    verify: false, // Auth0 handles verification
  },

  admin: {
    useAsTitle: 'email',
    group: 'Access',
    defaultColumns: ['email', 'roles', 'createdAt'],
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
