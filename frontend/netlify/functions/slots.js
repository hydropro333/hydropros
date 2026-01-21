import { z } from 'zod'
import { query } from './utils/db.js'
import {
  BUSINESS_TZ,
  localToUtc,
  dateRangeLocal,
  weekdayFromYmd,
  parseHHMM,
  overlaps
} from './utils/timezone.js'

const slotsQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  tz: z.string().optional()
})

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS'
}

async function getAvailabilityRules() {
  const [rows] = await query(
    'SELECT weekday, start_local, end_local, slot_minutes, active FROM availability_rules WHERE active = true'
  )
  const map = new Map()
  for (const r of rows) {
    map.set(Number(r.weekday), {
      start: String(r.start_local),
      end: String(r.end_local),
      slot: Number(r.slot_minutes)
    })
  }
  return map
}

async function getBlackoutSet(fromDateStr, toDateStr) {
  const [rows] = await query(
    'SELECT date_local FROM blackout_dates WHERE date_local BETWEEN $1 AND $2',
    [fromDateStr, toDateStr]
  )
  return new Set(rows.map(r => String(r.date_local)))
}

async function getBookedUtcIntervals(fromUtc, toUtc) {
  const [rows] = await query(
    `SELECT start_utc, end_utc, status
     FROM appointments
     WHERE status <> 'canceled'
       AND end_utc > $1
       AND start_utc < $2`,
    [fromUtc.toISOString(), toUtc.toISOString()]
  )
  return rows.map(r => ({
    start: new Date(r.start_utc),
    end: new Date(r.end_utc)
  }))
}

export async function handler(event, context) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ ok: false, error: 'Method not allowed' })
    }
  }

  try {
    const params = event.queryStringParameters || {}
    const q = slotsQuerySchema.parse({
      from: params.from,
      to: params.to,
      tz: params.tz
    })

    const tz = q.tz || BUSINESS_TZ

    const fmtYmd = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' })
    const fromStr = q.from || fmtYmd.format(new Date())
    const plus14 = new Date(); plus14.setUTCDate(plus14.getUTCDate() + 14)
    const toStr = q.to || fmtYmd.format(plus14)

    const rules = await getAvailabilityRules()
    const blackout = await getBlackoutSet(fromStr, toStr)

    const [fy, fm, fd] = fromStr.split('-').map(Number)
    const [ty, tm, td] = toStr.split('-').map(Number)
    const windowFromUtc = localToUtc({ timeZone: tz, year: fy, month: fm, day: fd, hour: 0, minute: 0 })
    const windowToUtc = localToUtc({ timeZone: tz, year: ty, month: tm, day: td, hour: 23, minute: 59 })

    const booked = await getBookedUtcIntervals(windowFromUtc, windowToUtc)

    const out = []
    for (const dayStr of dateRangeLocal(fromStr, toStr, tz)) {
      if (blackout.has(dayStr)) {
        out.push({ date: dayStr, slots: [] })
        continue
      }

      const wd = weekdayFromYmd(dayStr, tz)
      const rule = rules.get(wd)
      if (!rule) {
        out.push({ date: dayStr, slots: [] })
        continue
      }

      const { start: startLocal, end: endLocal, slot: slotMinutes } = rule
      const [Y, M, D] = dayStr.split('-').map(Number)
      const { hh: startHH, mm: startMM } = parseHHMM(startLocal)
      const { hh: endHH, mm: endMM } = parseHHMM(endLocal)

      const slotsForDay = []
      let curHour = startHH
      let curMin = startMM

      while (true) {
        if (curHour > endHH || (curHour === endHH && curMin >= endMM)) break

        const startUtc = localToUtc({
          timeZone: tz, year: Y, month: M, day: D, hour: curHour, minute: curMin
        })
        const endUtc = new Date(startUtc.getTime() + slotMinutes * 60 * 1000)

        const conflict = booked.some(b => overlaps(startUtc, endUtc, b.start, b.end))
        if (!conflict) {
          const hh = String(curHour).padStart(2, '0')
          const mm = String(curMin).padStart(2, '0')
          slotsForDay.push({ time: `${hh}:${mm}`, startUtc: startUtc.toISOString(), endUtc: endUtc.toISOString() })
        }

        const next = new Date(Date.UTC(2000, 0, 1, curHour, curMin) + slotMinutes * 60 * 1000)
        curHour = next.getUTCHours()
        curMin = next.getUTCMinutes()
        if (curHour > endHH || (curHour === endHH && curMin > endMM)) break
      }

      out.push({ date: dayStr, slots: slotsForDay })
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, timeZone: tz, days: out })
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ ok: false, errors: err.flatten() })
      }
    }
    console.error('[slots] error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: 'Server error' })
    }
  }
}
