import { randomUUID } from 'crypto'
import { z } from 'zod'
import { query, execute } from './utils/db.js'
import { getTransporter } from './utils/email.js'

const leadSchema = z.object({
  fullName: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(7, 'Phone is required'),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  consent: z.coerce.boolean().optional().default(false),
  sourcePath: z.string().optional().nullable(),
  utm_source: z.string().optional().nullable(),
  utm_medium: z.string().optional().nullable(),
  utm_campaign: z.string().optional().nullable(),
  notifyCustomer: z.coerce.boolean().optional().default(true)
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
    const data = leadSchema.parse(body)
    const id = randomUUID()

    const sql = `
      INSERT INTO leads
      (id, full_name, email, phone, address, city, state, postal_code, notes, source_path,
       utm_source, utm_medium, utm_campaign, consent)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `
    const params = [
      id,
      data.fullName,
      data.email,
      data.phone,
      data.address || null,
      data.city || null,
      data.state || null,
      data.postalCode || null,
      data.notes || null,
      data.sourcePath || null,
      data.utm_source || null,
      data.utm_medium || null,
      data.utm_campaign || null,
      data.consent
    ]
    await execute(sql, params)

    const transporter = await getTransporter()
    const { EMAIL_USER, EMAIL_TO } = process.env

    // Internal notification
    const internalText =
      `New lead:\n\n` +
      `Name: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\n` +
      `Address: ${data.address || ''}\n` +
      `City/State/Zip: ${data.city || ''} ${data.state || ''} ${data.postalCode || ''}\n` +
      `Consent to contact: ${data.consent ? 'Yes' : 'No'}\n` +
      `Source path: ${data.sourcePath || ''}\n` +
      `UTM: ${data.utm_source || ''} / ${data.utm_medium || ''} / ${data.utm_campaign || ''}\n` +
      `Notes: ${data.notes || ''}\n`

    await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_TO,
      subject: 'New Lead Received',
      text: internalText
    })

    // Customer email
    if (data.notifyCustomer) {
      const customerHtml = `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0b1d2a;">
          <p>Hello ${data.fullName.split(' ')[0] || 'there'},</p>
          <p>Thanks for reaching out to <strong>Florida Hydro Pros</strong>. We've received your details and a team member will call you soon to confirm next steps.</p>
          <p>If you prefer, you can schedule on our website by using the appointment form.</p>
          <p>— <strong>Florida Hydro Pros</strong></p>
        </div>
      `
      await transporter.sendMail({
        from: EMAIL_USER,
        to: data.email,
        subject: 'Thanks — we received your request',
        html: customerHtml
      })
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, id })
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, errors: err.flatten() })
      }
    }
    console.error('[leads] error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: 'Server error' })
    }
  }
}
