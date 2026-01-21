import { randomUUID } from 'crypto'
import { z } from 'zod'
import { query, execute } from './utils/db.js'
import { getTransporter, renderCustomerEmailHTML, renderInternalEmailHTML } from './utils/email.js'
import { BUSINESS_TZ, localToUtc, formatLocal, buildIcs } from './utils/timezone.js'

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
  utm_campaign: z.string().optional().nullable()
})

const createApptSchema = z.object({
  lead_id: z.string().uuid().optional(),
  lead: leadSchema.optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM 24h'),
  durationMinutes: z.number().int().min(15).max(480).default(60),
  timezone: z.string().default(BUSINESS_TZ)
})

const rescheduleSchema = z.object({
  token: z.string().length(64),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  timezone: z.string().optional(),
  durationMinutes: z.number().int().min(15).max(480).optional()
})

const cancelSchema = z.object({
  token: z.string().length(64)
})

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, PATCH, DELETE, OPTIONS'
}

async function handleCreate(body) {
  const data = createApptSchema.parse(body)

  let leadId = data.lead_id
  if (!leadId) {
    if (!data.lead) throw new Error('Missing lead details')
    const leadData = leadSchema.parse(data.lead)
    leadId = randomUUID()
    await execute(
      `INSERT INTO leads
       (id, full_name, email, phone, address, city, state, postal_code, notes, source_path,
        utm_source, utm_medium, utm_campaign, consent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        leadId,
        leadData.fullName,
        leadData.email,
        leadData.phone,
        leadData.address || null,
        leadData.city || null,
        leadData.state || null,
        leadData.postalCode || null,
        leadData.notes || null,
        leadData.sourcePath || null,
        leadData.utm_source || null,
        leadData.utm_medium || null,
        leadData.utm_campaign || null,
        leadData.consent
      ]
    )
  }

  const [Y, M, D] = data.date.split('-').map(n => Number(n))
  const [h, m] = data.time.split(':').map(n => Number(n))
  const tz = data.timezone || BUSINESS_TZ
  const startUtc = localToUtc({ timeZone: tz, year: Y, month: M, day: D, hour: h, minute: m })
  const endUtc = new Date(startUtc.getTime() + data.durationMinutes * 60 * 1000)

  const [conflictRows] = await query(
    `SELECT id FROM appointments
     WHERE status <> 'canceled'
       AND end_utc > $1 AND start_utc < $2`,
    [startUtc.toISOString(), endUtc.toISOString()]
  )
  if (conflictRows.length > 0) {
    return {
      statusCode: 409,
      headers,
      body: JSON.stringify({ ok: false, error: 'Slot no longer available. Please pick another time.' })
    }
  }

  const apptId = randomUUID()
  const token = randomUUID().replace(/-/g, '') + randomUUID().replace(/-/g, '')
  await execute(
    `INSERT INTO appointments
     (id, lead_id, start_utc, end_utc, timezone, status, reschedule_token, notes)
     VALUES ($1, $2, $3, $4, $5, 'scheduled', $6, $7)`,
    [
      apptId,
      leadId,
      startUtc.toISOString(),
      endUtc.toISOString(),
      tz,
      token,
      data.lead?.notes || null
    ]
  )

  const [leadRows] = await query(
    'SELECT full_name, email, phone, address, city, state, postal_code, notes, source_path, utm_source, utm_medium, utm_campaign FROM leads WHERE id = $1',
    [leadId]
  )
  const lead = leadRows[0]

  const transporter = await getTransporter()
  const { EMAIL_USER, EMAIL_TO } = process.env
  const startLocalText = formatLocal({ utcDate: startUtc, timeZone: tz })
  const icsContent = buildIcs({
    uid: apptId,
    title: 'Florida Hydro Pros Appointment',
    description: 'Confirmed appointment.',
    startUtc,
    endUtc,
    timeZone: tz
  })

  await transporter.sendMail({
    from: EMAIL_USER,
    to: lead.email,
    subject: 'Your appointment is confirmed',
    html: renderCustomerEmailHTML({ fullName: lead.full_name, startLocalText }),
    attachments: [{ filename: 'appointment.ics', content: icsContent, contentType: 'text/calendar; charset=utf-8' }]
  })

  await transporter.sendMail({
    from: EMAIL_USER,
    to: EMAIL_TO,
    subject: 'New Appointment Scheduled',
    html: renderInternalEmailHTML({ lead, startLocalText, timezone: tz }),
    attachments: [{ filename: 'appointment.ics', content: icsContent, contentType: 'text/calendar; charset=utf-8' }]
  })

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      ok: true,
      id: apptId,
      lead_id: leadId,
      startUtc: startUtc.toISOString(),
      endUtc: endUtc.toISOString(),
      timezone: tz
    })
  }
}

async function handleReschedule(id, body) {
  const data = rescheduleSchema.parse(body)
  const tz = data.timezone || BUSINESS_TZ
  const dur = data.durationMinutes || 60

  const [apptRows] = await query('SELECT reschedule_token, status FROM appointments WHERE id = $1', [id])
  if (!apptRows.length) {
    return { statusCode: 404, headers, body: JSON.stringify({ ok: false, error: 'Not found' }) }
  }
  const oldAppt = apptRows[0]
  if (oldAppt.reschedule_token !== data.token) {
    return { statusCode: 403, headers, body: JSON.stringify({ ok: false, error: 'Bad token' }) }
  }
  if (oldAppt.status === 'canceled') {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: 'Canceled appointment' }) }
  }

  const [Y, M, D] = data.date.split('-').map(Number)
  const [h, m] = data.time.split(':').map(Number)
  const startUtc = localToUtc({ timeZone: tz, year: Y, month: M, day: D, hour: h, minute: m })
  const endUtc = new Date(startUtc.getTime() + dur * 60 * 1000)

  const [conflicts] = await query(
    `SELECT id FROM appointments
     WHERE id <> $1
       AND status <> 'canceled'
       AND end_utc > $2 AND start_utc < $3`,
    [id, startUtc.toISOString(), endUtc.toISOString()]
  )
  if (conflicts.length) {
    return { statusCode: 409, headers, body: JSON.stringify({ ok: false, error: 'Slot no longer available' }) }
  }

  await execute(
    `UPDATE appointments
     SET start_utc = $1, end_utc = $2, timezone = $3, status = 'rescheduled'
     WHERE id = $4`,
    [startUtc.toISOString(), endUtc.toISOString(), tz, id]
  )

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true, id, startUtc: startUtc.toISOString(), endUtc: endUtc.toISOString(), timezone: tz })
  }
}

async function handleCancel(id, body) {
  const data = cancelSchema.parse(body)

  const [rows] = await query('SELECT reschedule_token, status FROM appointments WHERE id = $1', [id])
  if (!rows.length) {
    return { statusCode: 404, headers, body: JSON.stringify({ ok: false, error: 'Not found' }) }
  }
  const appt = rows[0]
  if (appt.reschedule_token !== data.token) {
    return { statusCode: 403, headers, body: JSON.stringify({ ok: false, error: 'Bad token' }) }
  }
  if (appt.status === 'canceled') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }
  }

  await execute('UPDATE appointments SET status = $1 WHERE id = $2', ['canceled', id])
  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) }
}

export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  try {
    const body = JSON.parse(event.body || '{}')
    const pathParts = event.path.split('/').filter(Boolean)
    const id = pathParts[pathParts.length - 1]
    const isIdRoute = id && id !== 'appointments'

    if (event.httpMethod === 'POST' && !isIdRoute) {
      return await handleCreate(body)
    }

    if (event.httpMethod === 'PATCH' && isIdRoute) {
      return await handleReschedule(id, body)
    }

    if (event.httpMethod === 'DELETE' && isIdRoute) {
      return await handleCancel(id, body)
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: 'Method not allowed' })
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, errors: err.flatten() })
      }
    }
    console.error('[appointments] error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: 'Server error' })
    }
  }
}
