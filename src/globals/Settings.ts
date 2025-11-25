// src/globals/Settings.ts
import type { GlobalConfig } from 'payload'
import { hasRoleAtLeast } from '../access/control'

export const Settings: GlobalConfig = {
  slug: 'settings',

  access: {
    read: () => true,

    // ✔ FIXED: use roles[] array OR RBAC helper
    update: ({ req }) => {
      if (!req.user) return false
      return hasRoleAtLeast(req, 'admin') // admin or higher
    },
  },

  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Freedom Worship Center',
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'pathwaysDescription',
      type: 'textarea',
      label: 'Pathways Program Description',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
