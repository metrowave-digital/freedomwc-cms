const NEON_AUTH_BASE_URL = process.env.NEON_AUTH_BASE_URL
const NEON_AUTH_SECRET = process.env.NEON_AUTH_SECRET

if (!NEON_AUTH_BASE_URL || !NEON_AUTH_SECRET) {
  throw new Error('Missing Neon Auth credentials')
}

export async function updateNeonUserRoles(neonUserId: string, roles: string[]) {
  const res = await fetch(`${NEON_AUTH_BASE_URL}/users/${neonUserId}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${NEON_AUTH_SECRET}`,
    },
    body: JSON.stringify({
      metadata: {
        roles,
      },
    }),
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Neon role sync failed: ${error}`)
  }
}
