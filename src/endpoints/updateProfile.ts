import type { Endpoint } from 'payload'

export const updateProfileEndpoint: Endpoint = {
  path: '/internal/update-profile',
  method: 'post',

  handler: async (req) => {
    const payload = req.payload
    if (!payload) {
      return new Response('Payload not initialized', { status: 500 })
    }

    /* -----------------------------------------
       API key protection
    ----------------------------------------- */

    const authHeader = req.headers?.get('authorization')
    if (authHeader !== `users API-Key ${process.env.PAYLOAD_API_KEY}`) {
      return new Response('Unauthorized', { status: 401 })
    }

    /* -----------------------------------------
       Parse body
    ----------------------------------------- */

    const body = (await (req as unknown as Request).json()) as {
      profileId: string
      data: Record<string, unknown>
      actingUserId: string
    }

    const { profileId, data, actingUserId } = body

    if (!profileId || !actingUserId) {
      return new Response('Missing required fields', { status: 400 })
    }

    /* -----------------------------------------
       Load acting user
    ----------------------------------------- */

    const user = await payload.findByID({
      collection: 'users',
      id: actingUserId,
    })

    if (!user) {
      return new Response('User not found', { status: 401 })
    }

    /* -----------------------------------------
       🔑 INTERNAL UPDATE WITH USER INJECTION
    ----------------------------------------- */

    const updated = await payload.update({
      collection: 'profiles',
      id: profileId,
      data,
      user, // ✅ req.user populated here
    })

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  },
}
