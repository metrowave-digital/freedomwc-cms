// src/access/roles.ts

import type { PayloadRequest } from 'payload'

export type FWCRole =
  | 'admin'
  | 'pastor'
  | 'leader'
  | 'instructor'
  | 'mentor'
  | 'staff'
  | 'volunteer'
  | 'member'
  | 'student'
  | 'viewer'

export const ROLE_LIST: FWCRole[] = [
  'admin',
  'pastor',
  'leader',
  'instructor',
  'mentor',
  'staff',
  'volunteer',
  'member',
  'student',
  'viewer',
]

/**
 * Role hierarchy — LOWER number = HIGHER authority
 * admin (0) is top
 * viewer (9) is bottom
 */
export const ROLE_RANKING: Record<FWCRole, number> = {
  admin: 0,
  pastor: 1,
  leader: 2,
  instructor: 3,
  mentor: 4,
  staff: 5,
  volunteer: 6,
  member: 7,
  student: 8,
  viewer: 9,
}

/**
 * Check if the user has ANY of the listed roles
 */
export function userHasRole(req: PayloadRequest, roles: FWCRole[]): boolean {
  const userRoles: FWCRole[] = Array.isArray(req.user?.roles) ? req.user.roles : []
  return userRoles.some((r: FWCRole) => roles.includes(r))
}

/**
 * Check if the user has at least the minimum required role
 * (e.g. leader can access member/student/viewer permissions)
 */
export function hasRoleAtLeast(req: PayloadRequest, minimum: FWCRole): boolean {
  const userRoles: FWCRole[] = Array.isArray(req.user?.roles) ? req.user.roles : []

  return userRoles.some((r: FWCRole) => {
    return ROLE_RANKING[r] <= ROLE_RANKING[minimum]
  })
}
