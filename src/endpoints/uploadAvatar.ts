import type { Endpoint } from 'payload'

export const uploadAvatarEndpoint: Endpoint = {
  path: '/internal/upload-avatar',
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
       Parse multipart form data
    ----------------------------------------- */

    const formData = await (req as unknown as Request).formData()

    const file = formData.get('file')
    const profileId = formData.get('profileId')?.toString()
    const actingUserId = formData.get('actingUserId')?.toString()
    const alt = formData.get('alt')?.toString() ?? 'Profile avatar'

    if (!file || !(file instanceof File)) {
      return new Response('Invalid or missing file', { status: 400 })
    }

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
       Load existing profile (for old avatar)
    ----------------------------------------- */

    const profile = await payload.findByID({
      collection: 'profiles',
      id: profileId,
      user,
    })

    if (!profile) {
      return new Response('Profile not found', { status: 404 })
    }

    const previousAvatarId =
      typeof profile.avatar === 'number'
        ? profile.avatar
        : typeof profile.avatar === 'object'
          ? profile.avatar?.id
          : undefined

    /* -----------------------------------------
       Convert Web File → Payload upload format
    ----------------------------------------- */

    const buffer = Buffer.from(await file.arrayBuffer())

    /* -----------------------------------------
       Upload new avatar to Media
    ----------------------------------------- */

    const media = await payload.create({
      collection: 'media',
      data: {
        alt,
        visibility: 'public',
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
      user,
    })

    // Payload upload return can be number OR full doc
    const mediaId = typeof media === 'number' ? media : media.id

    /* -----------------------------------------
       Update profile with new avatar
    ----------------------------------------- */

    const updatedProfile = await payload.update({
      collection: 'profiles',
      id: profileId,
      data: {
        avatar: mediaId,
      },
      user,
    })

    /* -----------------------------------------
       🗑️ Delete previous avatar (safe cleanup)
    ----------------------------------------- */

    if (previousAvatarId && previousAvatarId !== mediaId) {
      try {
        await payload.delete({
          collection: 'media',
          id: previousAvatarId,
          user,
        })
      } catch (err) {
        payload.logger.warn(`Failed to delete old avatar ${previousAvatarId}`)
      }
    }

    /* -----------------------------------------
       Response
    ----------------------------------------- */

    return new Response(
      JSON.stringify({
        avatarId: mediaId,
        replaced: Boolean(previousAvatarId),
        profile: updatedProfile,
      }),
      {
        status: 200,
        headers: { 'content-type': 'application/json' },
      },
    )
  },
}
