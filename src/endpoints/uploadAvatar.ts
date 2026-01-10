import type { Endpoint, PayloadRequest } from 'payload'

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  })
}

export const uploadAvatarEndpoint: Endpoint = {
  path: '/upload/avatar',
  method: 'post',

  handler: async (req: PayloadRequest) => {
    const payload = req.payload
    if (!payload) return json({ error: 'Payload not initialized' }, 500)

    const user = req.user
    if (!user) return json({ error: 'Unauthorized' }, 401)

    /* ---------------------------------------------
       Parse multipart form data
    --------------------------------------------- */
    let formData: FormData
    try {
      formData = await (req as unknown as Request).formData()
    } catch {
      return json({ error: 'Invalid form data' }, 400)
    }

    const file = formData.get('file')
    if (!(file instanceof File)) {
      return json({ error: 'No file uploaded' }, 400)
    }

    /* ---------------------------------------------
       Convert File → Buffer
    --------------------------------------------- */
    const buffer = Buffer.from(await file.arrayBuffer())

    /* ---------------------------------------------
       Upload to Media
    --------------------------------------------- */
    const media = await payload.create({
      collection: 'media',
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: buffer.length,
      },
      data: {
        alt: `${user.email ?? 'User'} avatar`,
        visibility: 'public',
      },
    })

    /* ---------------------------------------------
       Find profile linked to user
    --------------------------------------------- */
    const profileRes = await payload.find({
      collection: 'profiles',
      where: {
        user: { equals: user.id },
      },
      limit: 1,
    })

    if (!profileRes.docs.length) {
      return json({ error: 'Profile not found for user' }, 404)
    }

    const profile = profileRes.docs[0]

    await payload.update({
      collection: 'profiles',
      id: profile.id,
      data: {
        avatar: media.id,
      },
    })

    return json({
      id: media.id,
      url: media.url,
    })
  },
}
