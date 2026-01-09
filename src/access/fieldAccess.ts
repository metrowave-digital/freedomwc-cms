// src/access/fieldAccess.ts
import type { FieldAccess } from 'payload'
import type { FWCRole } from './roles'
import { hasRoleAtLeast, isAdminRoute, getCurrentProfileId } from './control'

/**
 * Field-level update helper:
 * - Admin route always allowed (Payload admin UI)
 * - Users with at least a minimum role allowed
 * - Otherwise: only if editing their own profile document
 *
 * IMPORTANT:
 * FieldAccess must return boolean (NOT Where).
 */
export function editableBySelfOrRole(minimum: FWCRole): FieldAccess {
  return async ({ req, id }) => {
    if (!req.user) return false
    if (isAdminRoute(req)) return true
    if (hasRoleAtLeast(req, minimum)) return true

    const profileId = await getCurrentProfileId(req)

    // id is the Profile doc id being edited
    return profileId !== undefined && String(profileId) === String(id)
  }
}

/** Staff-only field updates */
export const staffOnlyField: FieldAccess = ({ req }) => {
  if (!req.user) return false
  return hasRoleAtLeast(req, 'staff') || isAdminRoute(req)
}

/** Admin-only field updates */
export const adminOnlyField: FieldAccess = ({ req }) => {
  if (!req.user) return false
  return hasRoleAtLeast(req, 'admin') || isAdminRoute(req)
}
