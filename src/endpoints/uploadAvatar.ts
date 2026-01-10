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
       Upload to Media collection (Payload v3)
    --------------------------------------------- */
    const media = await payload.create({
      collection: 'media',
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: buffer.length, // ✅ THIS FIXES THE ERROR
      },
      data: {
        alt: `${user.email ?? 'User'} avatar`,
        visibility: 'public',
      },
    })

    /* ---------------------------------------------
       Attach avatar to profile
    --------------------------------------------- */
    const profileId =
      typeof user.profile === 'string' || typeof user.profile === 'number'
        ? user.profile
        : user.profile?.id

    if (profileId) {
      await payload.update({
        collection: 'profiles',
        id: profileId,
        data: {
          avatar: media.id,
        },
      })
    }

    return json({
      id: media.id,
      url: media.url,
    })
  },
}
