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
       API key protection
    --------------------------------------------- */

    const authHeader = req.headers?.get('authorization')

    if (authHeader !== `users API-Key ${process.env.PAYLOAD_API_KEY}`) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    /* ---------------------------------------------
       Body (already parsed by Payload)
    --------------------------------------------- */

    const body = req.body as ResolveUserBody

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

    /* ---------------------------------------------
       Find existing user
    --------------------------------------------- */

    const existing = await payload.find({
      collection: 'users',
      where: {
        auth0Id: {
          equals: auth0Id,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return jsonResponse(existing.docs[0])
    }

    /* ---------------------------------------------
       Create new user
    --------------------------------------------- */

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
