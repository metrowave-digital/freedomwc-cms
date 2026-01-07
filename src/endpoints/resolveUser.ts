import type { PayloadRequest } from 'payload'

export async function resolveUserEndpoint(req: PayloadRequest): Promise<Response> {
  try {
    console.log('🔥 resolve-user endpoint HIT')

    const secret = req.headers.get('x-internal-secret') ?? req.headers.get('X-Internal-Secret')

    if (secret !== process.env.CMS_INTERNAL_SECRET) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const request = req as unknown as Request
    const body = (await request.json()) as {
      auth0Id?: string
      email?: string
    }

    const { auth0Id, email } = body

    if (!auth0Id) {
      return new Response(JSON.stringify({ error: 'Missing auth0Id' }), { status: 400 })
    }

    // ✅ USE REQUEST-SCOPED PAYLOAD
    const { payload } = req

    const existing = await payload.find({
      collection: 'users',
      where: { auth0Id: { equals: auth0Id } },
      limit: 1,
      overrideAccess: true,
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

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email required' }), { status: 400 })
    }

    const created = await payload.create({
      collection: 'users',
      data: {
        auth0Id,
        email: email.toLowerCase().trim(),
        roles: ['viewer'],
      },
      overrideAccess: true,
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
  } catch (err) {
    console.error('💥 RESOLVE USER ERROR:', err)

    return new Response(
      JSON.stringify({
        error: 'Internal resolve-user failure',
        detail: err instanceof Error ? err.message : String(err),
      }),
      { status: 500 },
    )
  }
}
