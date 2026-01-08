import type { PayloadRequest } from 'payload'

export async function linkNeonUser(req: PayloadRequest) {
  const authHeader = req.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CMS_INTERNAL_SECRET}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const body = await req.json?.().catch(() => null)
  const { neonUserId, email } = body || {}

  if (!neonUserId || !email) {
    return new Response(JSON.stringify({ error: 'Missing data' }), { status: 400 })
  }

  const user = await req.payload.create({
    collection: 'users',
    data: {
      email,
      neonUserId,
      roles: ['viewer'],
    },
  })

  return Response.json({ success: true, user })
}
