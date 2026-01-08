import type { PayloadRequest } from 'payload'
import { updateNeonUserRoles } from '../lib/neonAuth'
import type { FWCRole } from '../access/roles'

type UserDoc = {
  id: string
  neonUserId?: string
  roles?: FWCRole[]
}

type HookArgs = {
  doc: UserDoc
  previousDoc?: UserDoc
  operation: 'create' | 'update' | 'delete'
  req: PayloadRequest
}

export const syncNeonRoles = async ({ doc, previousDoc, operation }: HookArgs) => {
  const rolesChanged =
    operation === 'create' || JSON.stringify(doc.roles) !== JSON.stringify(previousDoc?.roles)

  if (!rolesChanged) return doc

  if (!doc.neonUserId) {
    console.warn(`User ${doc.id} has no neonUserId – skipping Neon sync`)
    return doc
  }

  await updateNeonUserRoles(doc.neonUserId, doc.roles ?? [])

  return doc
}
