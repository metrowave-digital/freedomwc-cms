import type { Endpoint, PayloadRequest } from 'payload'

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

export const uploadAvatarEndpoint: Endpoint = {
  path: '/upload/avatar',
  method: 'post',

  handler: async (req: PayloadRequest) => {
    const payload = req.payload

    if (!payload) {
      return jsonResponse({ error: 'Payload not initialized' }, 500)
    }

    /* ---------------------------------------------
       Auth check (same layer as resolveUser)
    --------------------------------------------- */

    if (!req.user) {
      return jsonResponse({ error: 'Unauthorized' }, 401)
    }

    /* ---------------------------------------------
       Parse multipart form data
    --------------------------------------------- */

    let uploadedFile: File | null = null

    try {
      const request = req as unknown as Request
      const formData = await request.formData()
      const file = formData.get('file')

      if (file instanceof File) {
        uploadedFile = file
      }
    } catch {
      return jsonResponse({ error: 'Invalid form data' }, 400)
    }

    if (!uploadedFile) {
      return jsonResponse({ error: 'Missing file' }, 400)
    }

    /* ---------------------------------------------
       Validate file
    --------------------------------------------- */

    if (!uploadedFile.type.startsWith('image/')) {
      return jsonResponse({ error: 'Only image uploads allowed' }, 400)
    }

    if (uploadedFile.size > 2_000_000) {
      return jsonResponse({ error: 'Image must be under 2MB' }, 400)
    }

    /* ---------------------------------------------
       Convert Web File → Payload File
    --------------------------------------------- */

    const arrayBuffer = await uploadedFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    /* =================================================
       Create Media (Payload-native)
    ================================================= */

    const media = await payload.create({
      collection: 'media',
      data: {
        alt: 'User avatar',
        visibility: 'public',
      },
      file: {
        data: buffer,
        mimetype: uploadedFile.type,
        name: uploadedFile.name,
        size: uploadedFile.size,
      },
    })

    /* ---------------------------------------------
       Response
    --------------------------------------------- */

    return jsonResponse({
      id: media.id,
      url: media.url,
      filename: media.filename,
    })
  },
}
