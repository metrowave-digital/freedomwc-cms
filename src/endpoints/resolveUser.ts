import type { PayloadRequest } from 'payload'
import payload from 'payload'

export async function resolveUserEndpoint(req: PayloadRequest): Promise<Response> {
  /* ---------------------------------------------
     AUTH (shared secret)
  --------------------------------------------- */
  const secret = req.headers.get('x-internal-secret')

  if (!secret || secret !== process.env.CMS_INTERNAL_SECRET) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  /* ---------------------------------------------
     SAFE BODY ACCESS (Payload v3)
  --------------------------------------------- */
  const body = typeof req.body === 'object' && req.body !== null ? req.body : {}

  const { auth0Id, email } = body as {
    auth0Id?: string
    email?: string
  }

  if (!auth0Id) {
    return new Response(JSON.stringify({ error: 'Missing auth0Id' }), { status: 400 })
  }

  /* ---------------------------------------------
     FIND USER
  --------------------------------------------- */
  const existing = await payload.find({
    collection: 'users',
    where: {
      auth0Id: { equals: auth0Id },
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const user = existing.docs[0]

    return new Response(
      JSON.stringify({
        id: user.id,
        email: user.email,
        roles: user.roles,
        profile: user.profile ?? null,
      }),
      { status: 200 },
    )
  }

  /* ---------------------------------------------
     CREATE USER (JIT)
  --------------------------------------------- */
  if (!email) {
    return new Response(JSON.stringify({ error: 'Email required' }), { status: 400 })
  }

  const created = await payload.create({
    collection: 'users',
    data: {
      auth0Id,
      email,
      roles: ['viewer'],
    },
  })

  return new Response(
    JSON.stringify({
      id: created.id,
      email: created.email,
      roles: created.roles,
      profile: created.profile ?? null,
    }),
    { status: 200 },
  )
}
