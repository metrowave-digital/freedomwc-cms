import crypto from 'crypto'

export function getSignedLmsUrl(key: string, expiresInSeconds = 3600) {
  const secret = process.env.LMS_SIGNING_SECRET
  if (!secret) throw new Error('Missing LMS_SIGNING_SECRET in .env')

  const expires = Math.floor(Date.now() / 1000) + expiresInSeconds
  const payload = `${key}:${expires}`
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('hex')

  return {
    url: `${process.env.LMS_PUBLIC_URL}/${key}?expires=${expires}&sig=${signature}`,
    expires,
    signature,
  }
}
