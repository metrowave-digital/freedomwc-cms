// src/access/control.ts
import type { Access, PayloadRequest } from 'payload'
import {
  ROLE_LIST,
  ROLE_RANKING,
  type FWCRole,
  userHasRole,
  hasRoleAtLeast as baseHasRoleAtLeast,
} from './roles'

/* ============================================================
   BASIC HELPERS
   ============================================================ */

export function isLoggedIn(req: PayloadRequest): boolean {
  return !!req.user
}

/**
 * Get ALL roles from the authenticated user.
 * Ensures a clean FWCRole[] array.
 */
export function getUserRoles(req: PayloadRequest): FWCRole[] {
  const roles = Array.isArray(req.user?.roles) ? req.user.roles : []
  return roles.filter((r): r is FWCRole => ROLE_LIST.includes(r as FWCRole))
}

/**
 * Check if user has at least the required role within the role hierarchy.
 * Supports multi-role users.
 */
export function hasRoleAtLeast(req: PayloadRequest, minimum: FWCRole): boolean {
  const roles = getUserRoles(req)
  if (roles.length === 0) return false
  return roles.some((role) => ROLE_RANKING[role] <= ROLE_RANKING[minimum])
}

/**
 * Is this the admin panel?
 */
export function isAdminRoute(req: PayloadRequest): boolean {
  const url = req.url || ''
  return url.includes('/admin')
}

/* ============================================================
   GENERIC ACCESS HELPERS
   ============================================================ */

export const publicRead: Access = () => true

export const loggedIn: Access = ({ req }) => isLoggedIn(req)

export const isAdmin: Access = ({ req }) => hasRoleAtLeast(req, 'admin') || isAdminRoute(req)

/** Only admin, pastor, leader, staff */
export const staffOnly: Access = ({ req }) => hasRoleAtLeast(req, 'staff') || isAdminRoute(req)

/** Instructors + leaders + pastors + admin */
export const instructorsOnly: Access = ({ req }) =>
  hasRoleAtLeast(req, 'instructor') || isAdminRoute(req)

/** Mentors + leaders + pastors + admin */
export const mentorsOnly: Access = ({ req }) => hasRoleAtLeast(req, 'mentor') || isAdminRoute(req)

/**
 * Utility: allow only specific roles (multi-role safe)
 */
export function allowRoles(roles: FWCRole[]): Access {
  return ({ req }) => {
    if (isAdminRoute(req)) return true
    const userRoles = getUserRoles(req)
    return userRoles.some((r) => roles.includes(r))
  }
}

/**
 * User can manage own document OR admin/staff
 */
export const allowIfSelfOrAdmin: Access = ({ req, id }) => {
  if (!req.user) return false
  if (hasRoleAtLeast(req, 'admin') || isAdminRoute(req)) return true
  return req.user.id === id
}

/* ============================================================
   DYNAMIC RULE ENGINE HELPERS
   ============================================================ */

/**
 * Get the current user's profile ID (if any).
 */
export async function getCurrentProfileId(
  req: PayloadRequest,
): Promise<string | number | undefined> {
  const user = req.user
  if (!user) return

  // If populated as ID
  if (typeof user.profile === 'string' || typeof user.profile === 'number') {
    return user.profile
  }

  // Otherwise lookup
  const result = await req.payload.find({
    collection: 'profiles',
    depth: 0,
    where: { user: { equals: user.id } },
    limit: 1,
  })

  const id = result.docs[0]?.id
  if (typeof id === 'string' || typeof id === 'number') return id
}

/**
 * Access for Submissions:
 * - Admin/instructors/staff see all
 * - Students see only their own
 */
export const submissionAccess: Access = async ({ req }) => {
  if (!req.user) return false

  if (hasRoleAtLeast(req, 'instructor') || isAdminRoute(req)) {
    return true
  }

  const profileId = await getCurrentProfileId(req)
  if (!profileId) return false

  return {
    profile: { equals: profileId },
  }
}

/**
 * Profiles access:
 * - Staff/admin: full access
 * - Everyone else: public read
 */
export const profileReadAccess: Access = async ({ req }) => {
  if (hasRoleAtLeast(req, 'staff') || isAdminRoute(req)) return true
  return true // public directory
}

export const profileUpdateAccess: Access = async ({ req, id }) => {
  if (!req.user) return false
  if (hasRoleAtLeast(req, 'staff') || isAdminRoute(req)) return true

  const profileId = await getCurrentProfileId(req)
  return profileId === id
}

/* ============================================================
   LMS STRICT ACCESS
   ============================================================ */

export const lmsReadAccess: Access = ({ req }) => {
  if (!req.user) return false
  if (hasRoleAtLeast(req, 'student') || isAdminRoute(req)) return true
  return false
}

export const lmsWriteAccess: Access = ({ req }) =>
  hasRoleAtLeast(req, 'instructor') || isAdminRoute(req)
