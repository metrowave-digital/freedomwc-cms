import type { PayloadRequest, Endpoint } from 'payload'
import type { FWCRole } from '../access/roles'

/* ======================================================
   Types
====================================================== */

type ResolveUserBody = {
  sub?: string
  email?: string
}

/* ======================================================
   Helpers
====================================================== */

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  })
}

/* ======================================================
   Endpoint
====================================================== */

export const resolveUserEndpoint: Endpoint = {
  path: '/auth/resolve-user',
  method: 'post',

  handler: async (req: PayloadRequest) => {
    const payload = req.payload

    if (!payload) {
      return jsonResponse({ error: 'Payload not initialized' }, 500)
    }

    /* ---------------------------------------------
       API key protection (server-to-server only)
    --------------------------------------------- */

    const authHeader = req.headers?.get('authorization')

    if (authHeader !== `users API-Key ${process.env.PAYLOAD_API_KEY}`) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    /* ---------------------------------------------
       Parse JSON body (Payload v3)
    --------------------------------------------- */

    let body: ResolveUserBody

    try {
      const request = req as unknown as Request
      body = (await request.json()) as ResolveUserBody
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400)
    }

    const auth0Id = body?.sub
    const email = body?.email

    if (!auth0Id || !email) {
      return jsonResponse(
        {
          error: 'Missing auth0 subject or email',
        },
        400,
      )
    }

    /* =================================================
       1. Find existing user by auth0Id
    ================================================= */

    const byAuth0 = await payload.find({
      collection: 'users',
      where: {
        auth0Id: {
          equals: auth0Id,
        },
      },
      limit: 1,
    })

    if (byAuth0.docs.length > 0) {
      return jsonResponse(byAuth0.docs[0])
    }

    /* =================================================
       2. Find existing user by email (LINK ACCOUNT)
    ================================================= */

    const byEmail = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: email,
        },
      },
      limit: 1,
    })

    if (byEmail.docs.length > 0) {
      const existingUser = byEmail.docs[0]

      const updated = await payload.update({
        collection: 'users',
        id: existingUser.id,
        data: {
          auth0Id,
        },
      })

      return jsonResponse(updated)
    }

    /* =================================================
       3. Create new user
    ================================================= */

    const user = await payload.create({
      collection: 'users',
      data: {
        auth0Id,
        email,
        roles: ['viewer'] satisfies FWCRole[],
      },
    })

    return jsonResponse(user)
  },
}
