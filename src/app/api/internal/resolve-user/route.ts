import payload from 'payload'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  /* ---------------------------------------------
     1. Verify internal secret
  --------------------------------------------- */
  const secret = req.headers.get('x-internal-secret')

  if (!secret || secret !== process.env.CMS_INTERNAL_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  /* ---------------------------------------------
     2. Parse input
  --------------------------------------------- */
  const { auth0Id, email } = await req.json()

  if (!auth0Id) {
    return NextResponse.json({ error: 'Missing auth0Id' }, { status: 400 })
  }

  /* ---------------------------------------------
     3. Find existing user
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

    return NextResponse.json({
      id: user.id,
      email: user.email,
      roles: user.roles,
      profile: user.profile ?? null,
    })
  }

  /* ---------------------------------------------
     4. JIT user creation
  --------------------------------------------- */
  if (!email) {
    return NextResponse.json({ error: 'Email required for new user' }, { status: 400 })
  }

  const created = await payload.create({
    collection: 'users',
    data: {
      auth0Id,
      email,
      roles: ['viewer'],
    },
  })

  return NextResponse.json({
    id: created.id,
    email: created.email,
    roles: created.roles,
    profile: created.profile ?? null,
  })
}
