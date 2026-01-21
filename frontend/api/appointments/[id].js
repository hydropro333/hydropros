import { z } from 'zod'
import { query, execute } from '../utils/db.js'
import { BUSINESS_TZ, localToUtc } from '../utils/timezone.js'

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

async function handleReschedule(id, body, res) {
  const data = rescheduleSchema.parse(body)
  const tz = data.timezone || BUSINESS_TZ
  const dur = data.durationMinutes || 60

  const [apptRows] = await query('SELECT reschedule_token, status FROM appointments WHERE id = $1', [id])
  if (!apptRows.length) {
    return res.status(404).json({ ok: false, error: 'Not found' })
  }
  const oldAppt = apptRows[0]
  if (oldAppt.reschedule_token !== data.token) {
    return res.status(403).json({ ok: false, error: 'Bad token' })
  }
  if (oldAppt.status === 'canceled') {
    return res.status(400).json({ ok: false, error: 'Canceled appointment' })
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
    return res.status(409).json({ ok: false, error: 'Slot no longer available' })
  }

  await execute(
    `UPDATE appointments
     SET start_utc = $1, end_utc = $2, timezone = $3, status = 'rescheduled'
     WHERE id = $4`,
    [startUtc.toISOString(), endUtc.toISOString(), tz, id]
  )

  return res.status(200).json({ ok: true, id, startUtc: startUtc.toISOString(), endUtc: endUtc.toISOString(), timezone: tz })
}

async function handleCancel(id, body, res) {
  const data = cancelSchema.parse(body)

  const [rows] = await query('SELECT reschedule_token, status FROM appointments WHERE id = $1', [id])
  if (!rows.length) {
    return res.status(404).json({ ok: false, error: 'Not found' })
  }
  const appt = rows[0]
  if (appt.reschedule_token !== data.token) {
    return res.status(403).json({ ok: false, error: 'Bad token' })
  }
  if (appt.status === 'canceled') {
    return res.status(200).json({ ok: true })
  }

  await execute('UPDATE appointments SET status = $1 WHERE id = $2', ['canceled', id])
  return res.status(200).json({ ok: true })
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, DELETE, OPTIONS')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { id } = req.query
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body

    if (req.method === 'PATCH') {
      return await handleReschedule(id, body, res)
    }

    if (req.method === 'DELETE') {
      return await handleCancel(id, body, res)
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ ok: false, errors: err.flatten() })
    }
    console.error('[appointments/:id] error:', err)
    return res.status(500).json({ ok: false, error: 'Server error' })
  }
}
