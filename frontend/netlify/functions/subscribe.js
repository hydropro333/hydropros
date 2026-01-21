import { z } from 'zod'
import { getTransporter } from './utils/email.js'

const subscribeSchema = z.object({
  email: z.string().email('Valid email is required'),
  sourcePath: z.string().optional().nullable(),
  utm_source: z.string().optional().nullable(),
  utm_medium: z.string().optional().nullable(),
  utm_campaign: z.string().optional().nullable()
})

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
}

export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: 'Method not allowed' })
    }
  }

  try {
    const body = JSON.parse(event.body || '{}')
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true })
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, errors: err.flatten() })
      }
    }
    console.error('[subscribe] error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: 'Server error' })
    }
  }
}
