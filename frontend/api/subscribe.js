import { z } from 'zod'
import { getTransporter } from './utils/email.js'

const subscribeSchema = z.object({
  email: z.string().email('Valid email is required'),
  sourcePath: z.string().optional().nullable(),
  utm_source: z.string().optional().nullable(),
  utm_medium: z.string().optional().nullable(),
  utm_campaign: z.string().optional().nullable()
})

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    const data = subscribeSchema.parse(body)

    const transporter = await getTransporter()
    const { EMAIL_USER, EMAIL_TO } = process.env

    const internalText =
      `New newsletter signup:\n\n` +
      `Email: ${data.email}\n` +
      `Source path: ${data.sourcePath || ''}\n` +
      `UTM: ${data.utm_source || ''} / ${data.utm_medium || ''} / ${data.utm_campaign || ''}\n`

    await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_TO,
      subject: 'Newsletter signup',
      text: internalText
    })

    return res.status(200).json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ ok: false, errors: err.flatten() })
    }
    console.error('[subscribe] error:', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
