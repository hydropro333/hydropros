// server.js
import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import mysql from 'mysql2/promise'
import nodemailer from 'nodemailer'

/**
 * ======================================
 * Basic config
 * ======================================
 */
const {
  NODE_ENV = 'development',
  PORT = 5000,

  // Database
  DB_HOST,
  DB_PORT = 3306,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,

  // Mail (Zoho SMTP)
  EMAIL_HOST = 'smtp.zoho.com',
  EMAIL_PORT = 465,
  EMAIL_SECURE = 'true',
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_TO, // internal notification address

  // CORS
  CORS_ALLOW = 'http://localhost:5173,http://127.0.0.1:5173,https://aquafound.com,http://aquafound.com',

  // Business timezone for scheduling
  BUSINESS_TZ = 'America/New_York'
} = process.env

const ALLOWED_ORIGINS = (CORS_ALLOW || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

const MISSING_DB = !DB_HOST || !DB_USER || !DB_NAME
const MISSING_EMAIL = !EMAIL_USER || !EMAIL_PASS || !EMAIL_TO
const MOCK_DB_FLAG = String(process.env.USE_MOCK_DB || '').toLowerCase()
const MOCK_EMAIL_FLAG = String(process.env.USE_MOCK_EMAIL || '').toLowerCase()
const USE_MOCK_DB = NODE_ENV !== 'production' && (
  MOCK_DB_FLAG === 'true' || (MISSING_DB && MOCK_DB_FLAG !== 'false')
)
const USE_MOCK_EMAIL = NODE_ENV !== 'production' && (
  MOCK_EMAIL_FLAG === 'true' || (MISSING_EMAIL && MOCK_EMAIL_FLAG !== 'false')
)

if (NODE_ENV === 'production') {
  if (MISSING_DB) {
    console.error('[boot] Missing DB_* settings in .env')
    process.exit(1)
  }
  if (MISSING_EMAIL) {
    console.error('[boot] Missing EMAIL_* settings in .env')
    process.exit(1)
  }
} else {
  if (MISSING_DB && !USE_MOCK_DB) {
    console.error('[boot] Missing DB_* settings in .env (set USE_MOCK_DB=true to use in-memory data)')
    process.exit(1)
  }
  if (MISSING_EMAIL && !USE_MOCK_EMAIL) {
    console.error('[boot] Missing EMAIL_* settings in .env (set USE_MOCK_EMAIL=true to log emails locally)')
    process.exit(1)
  }
  if (USE_MOCK_DB) {
    console.warn('[boot] DB_* missing or mocked; using in-memory data (dev only)')
  }
  if (USE_MOCK_EMAIL) {
    console.warn('[boot] EMAIL_* missing or mocked; emails will be logged (dev only)')
  }
}

/**
 * ======================================
 * App + middleware
 * ======================================
 */
const app = express()
app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  }
}))
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'))

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120
})
app.use(limiter)

/**
 * ======================================
 * In-memory DB (dev only)
 * ======================================
 */
function parseDbDate(value) {
  if (value instanceof Date) return new Date(value.getTime())
  if (typeof value === 'number') return new Date(value)
  if (typeof value === 'string') {
    if (value.includes('T') || value.endsWith('Z')) return new Date(value)
    return new Date(value.replace(' ', 'T') + 'Z')
  }
  return new Date(value)
}

function formatDbDate(value) {
  const d = parseDbDate(value)
  const pad = (num) => String(num).padStart(2, '0')
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`
}

function createMemoryPool() {
  const data = {
    leads: new Map(),
    appointments: new Map(),
    availabilityRules: new Map(),
    blackoutDates: new Set()
  }

  const defaultRules = [
    { weekday: 1, start_local: '09:00', end_local: '17:00', slot_minutes: 60, active: 1 },
    { weekday: 2, start_local: '09:00', end_local: '17:00', slot_minutes: 60, active: 1 },
    { weekday: 3, start_local: '09:00', end_local: '17:00', slot_minutes: 60, active: 1 },
    { weekday: 4, start_local: '09:00', end_local: '17:00', slot_minutes: 60, active: 1 },
    { weekday: 5, start_local: '09:00', end_local: '17:00', slot_minutes: 60, active: 1 }
  ]
  for (const rule of defaultRules) {
    data.availabilityRules.set(rule.weekday, rule)
  }

  const normalize = (sql) => sql.replace(/\s+/g, ' ').trim().toLowerCase()

  const run = async (sql, params = []) => {
    const norm = normalize(sql)

    if (norm.startsWith('insert into leads')) {
      const [
        id, full_name, email, phone, address, city, state, postal_code, notes, source_path,
        utm_source, utm_medium, utm_campaign, consent
      ] = params
      data.leads.set(id, {
        id,
        full_name,
        email,
        phone,
        address,
        city,
        state,
        postal_code,
        notes,
        source_path,
        utm_source,
        utm_medium,
        utm_campaign,
        consent
      })
      return [{ affectedRows: 1 }]
    }

    if (norm.startsWith('select weekday, start_local, end_local, slot_minutes, active from availability_rules')) {
      return [[...data.availabilityRules.values()].filter(r => r.active)]
    }

    if (norm.startsWith('select date_local from blackout_dates')) {
      const [fromStr, toStr] = params
      const rows = [...data.blackoutDates]
        .filter(date => (!fromStr || date >= fromStr) && (!toStr || date <= toStr))
        .map(date => ({ date_local: date }))
      return [rows]
    }

    if (norm.startsWith('select start_utc, end_utc, status from appointments')) {
      const [fromUtc, toUtc] = params
      const from = parseDbDate(fromUtc)
      const to = parseDbDate(toUtc)
      const rows = [...data.appointments.values()]
        .filter(appt => appt.status !== 'canceled' && appt.endUtc > from && appt.startUtc < to)
        .map(appt => ({
          start_utc: formatDbDate(appt.startUtc),
          end_utc: formatDbDate(appt.endUtc),
          status: appt.status
        }))
      return [rows]
    }

    if (norm.startsWith('select id from appointments')) {
      const hasExclude = norm.includes('where id <> ?')
      const excludeId = hasExclude ? params[0] : null
      const fromParamIndex = hasExclude ? 1 : 0
      const from = parseDbDate(params[fromParamIndex])
      const to = parseDbDate(params[fromParamIndex + 1])
      const rows = [...data.appointments.values()]
        .filter(appt => appt.status !== 'canceled')
        .filter(appt => (excludeId ? appt.id !== excludeId : true))
        .filter(appt => appt.endUtc > from && appt.startUtc < to)
        .map(appt => ({ id: appt.id }))
      return [rows]
    }

    if (norm.startsWith('insert into appointments')) {
      const [id, lead_id, start_utc, end_utc, timezone, reschedule_token, notes] = params
      data.appointments.set(id, {
        id,
        lead_id,
        startUtc: parseDbDate(start_utc),
        endUtc: parseDbDate(end_utc),
        timezone,
        status: 'scheduled',
        reschedule_token,
        notes
      })
      return [{ affectedRows: 1 }]
    }

    if (norm.startsWith('select full_name, email, phone, address, city, state, postal_code, notes, source_path, utm_source, utm_medium, utm_campaign from leads where id = ?')) {
      const [id] = params
      const lead = data.leads.get(id)
      return [[lead].filter(Boolean)]
    }

    if (norm.startsWith('select reschedule_token, status from appointments where id = ?')) {
      const [id] = params
      const appt = data.appointments.get(id)
      return [[appt ? { reschedule_token: appt.reschedule_token, status: appt.status } : null].filter(Boolean)]
    }

    if (norm.startsWith('update appointments set start_utc = ?, end_utc = ?, timezone = ?, status = \'rescheduled\' where id = ?')) {
      const [start_utc, end_utc, timezone, id] = params
      const appt = data.appointments.get(id)
      if (appt) {
        appt.startUtc = parseDbDate(start_utc)
        appt.endUtc = parseDbDate(end_utc)
        appt.timezone = timezone
        appt.status = 'rescheduled'
      }
      return [{ affectedRows: appt ? 1 : 0 }]
    }

    if (norm.startsWith('update appointments set status = \"canceled\" where id = ?')) {
      const [id] = params
      const appt = data.appointments.get(id)
      if (appt) appt.status = 'canceled'
      return [{ affectedRows: appt ? 1 : 0 }]
    }

    throw new Error(`[mock-db] Unsupported query: ${sql}`)
  }

  const pool = {
    execute: (sql, params) => run(sql, params),
    query: (sql, params) => run(sql, params),
    getConnection: async () => ({
      execute: (sql, params) => run(sql, params),
      query: (sql, params) => run(sql, params),
      release: () => {}
    })
  }

  return pool
}

/**
 * ======================================
 * MySQL pool
 * ======================================
 */
let pool
async function initDb() {
  if (USE_MOCK_DB) {
    pool = createMemoryPool()
    console.log('[mysql] mock pool ready')
    return
  }
  pool = await mysql.createPool({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z' // store/compare in UTC at the connection layer
  })
  await pool.query('SELECT 1')
  console.log('[mysql] connected')
}

/**
 * ======================================
 * Mailer (Zoho SMTP)
 * ======================================
 */
let transporter
async function initMailer() {
  if (USE_MOCK_EMAIL) {
    transporter = {
      async sendMail({ to, subject }) {
        console.log(`[email:mock] to=${to} subject="${subject}"`)
      }
    }
    console.log('[email] mock transporter ready')
    return
  }
  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: String(EMAIL_SECURE).toLowerCase() === 'true',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS }
  })
  await transporter.verify()
  console.log('[email] SMTP ready')
}

/**
 * ======================================
 * Email HTML helpers
 * ======================================
 */
function renderCustomerEmailHTML({ fullName, startLocalText }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0b1d2a;">
      <h2 style="margin:0 0 12px 0;">Your appointment is confirmed</h2>
      <p>Hi ${fullName || 'there'},</p>
      <p>Your appointment with <strong>HydroPros | Aquafound</strong> is confirmed for <strong>${startLocalText}</strong>.</p>
      <p>A team member will call you soon to confirm details and answer questions.</p>
      <p>If you need to reschedule or cancel, please call <a href="tel:954-404-2312">954-404-2312</a>.</p>
      <p>We look forward to meeting you.</p>
      <p>— <strong>HydroPros | Aquafound</strong></p>
    </div>
  `
}

function renderInternalEmailHTML({ lead, startLocalText, timezone }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0b1d2a;">
      <h2 style="margin:0 0 10px 0;">New appointment booked</h2>
      <p><strong>When:</strong> ${startLocalText} (${timezone || 'local'})</p>
      <p><strong>Name:</strong> ${lead.full_name || ''}</p>
      <p><strong>Email:</strong> ${lead.email || ''}</p>
      <p><strong>Phone:</strong> ${lead.phone || ''}</p>
      <p><strong>Address:</strong> ${[
        lead.address || '',
        [lead.city, lead.state].filter(Boolean).join(', '),
        lead.postal_code || ''
      ].filter(Boolean).join(' • ')}</p>
      <p><strong>Notes:</strong> ${lead.notes || '(none)'} </p>
      <hr/>
      <p><strong>Source path:</strong> ${lead.source_path || '/'}</p>
      <p><strong>UTM Source:</strong> ${lead.utm_source || '(none)'} • <strong>UTM Medium:</strong> ${lead.utm_medium || '(none)'} • <strong>UTM Campaign:</strong> ${lead.utm_campaign || '(none)'}</p>
    </div>
  `
}

/**
 * ======================================
 * Timezone utilities (no extra deps)
 * ======================================
 */
// Local wall time → UTC Date
function localToUtc({ timeZone, year, month, day, hour, minute }) {
  const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute, 0, 0))
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  const parts = Object.fromEntries(fmt.formatToParts(utcGuess).map(p => [p.type, p.value]))
  const zonedAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  )
  const offsetMs = zonedAsUtc - utcGuess.getTime()
  const trueUtcTime = Date.UTC(year, month - 1, day, hour, minute) - offsetMs
  return new Date(trueUtcTime)
}

// UTC Date → local display
function formatLocal({ utcDate, timeZone }) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit'
  })
  return fmt.format(utcDate)
}

// Build ICS text
function buildIcs({ uid, title, description, startUtc, endUtc, timeZone }) {
  const dt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Aquafound//Scheduling//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dt(new Date())}`,
    `DTSTART:${dt(startUtc)}`,
    `DTEND:${dt(endUtc)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `X-MICROSOFT-CDO-TZID:${timeZone}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ]
  return lines.join('\r\n')
}

/**
 * ======================================
 * Zod schemas
 * ======================================
 */
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
  // NEW: allow caller to suppress the customer “thanks” email
  notifyCustomer: z.coerce.boolean().optional().default(true)
})

const subscribeSchema = z.object({
  email: z.string().email('Valid email is required'),
  sourcePath: z.string().optional().nullable(),
  utm_source: z.string().optional().nullable(),
  utm_medium: z.string().optional().nullable(),
  utm_campaign: z.string().optional().nullable()
})

const createApptSchema = z.object({
  lead_id: z.string().uuid().optional(),
  lead: leadSchema.omit({ notifyCustomer: true }).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Use HH:MM 24h'),
  durationMinutes: z.number().int().min(15).max(480).default(60),
  timezone: z.string().default(BUSINESS_TZ)
})

const slotsQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  tz: z.string().optional()
})

/**
 * ======================================
 * Health
 * ======================================
 */
app.get('/api/health', (_req, res) => res.json({ ok: true }))

/**
 * ======================================
 * Leads endpoint
 * Inserts into leads table and sends internal email.
 * Optional notifyCustomer flag controls the customer “thanks” email.
 * ======================================
 */
app.post('/api/leads', async (req, res) => {
  try {
    const data = leadSchema.parse(req.body)
    const id = uuidv4()

    const sql = `
      INSERT INTO leads
      (id, full_name, email, phone, address, city, state, postal_code, notes, source_path,
       utm_source, utm_medium, utm_campaign, consent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      data.consent ? 1 : 0
    ]
    await pool.execute(sql, params)

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

    // Customer “thanks” email only if requested
    if (data.notifyCustomer) {
      const customerHtml = `
        <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0b1d2a;">
          <p>Hello ${data.fullName.split(' ')[0] || 'there'},</p>
          <p>Thanks for reaching out to <strong>HydroPros | Aquafound</strong>. We’ve received your details and a team member will call you soon to confirm next steps.</p>
          <p>If you prefer, you can schedule on our website by using the appointment form.</p>
          <p>— <strong>HydroPros | Aquafound</strong></p>
        </div>
      `
      await transporter.sendMail({
        from: EMAIL_USER,
        to: data.email,
        subject: 'Thanks — we received your request',
        html: customerHtml
      })
    }

    res.json({ ok: true, id })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ ok: false, errors: err.flatten() })
    }
    console.error('[leads] error:', err)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
})

/**
 * ======================================
 * Newsletter / updates signup
 * Sends a notification email to the internal address.
 * ======================================
 */
app.post('/api/subscribe', async (req, res) => {
  try {
    const data = subscribeSchema.parse(req.body)

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

    res.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ ok: false, errors: err.flatten() })
    }
    console.error('[subscribe] error:', err)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
})

/**
 * ======================================
 * Availability + slots (timezone-correct)
 * ======================================
 */
async function getAvailabilityRules() {
  const [rows] = await pool.query(
    'SELECT weekday, start_local, end_local, slot_minutes, active FROM availability_rules WHERE active = 1'
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
  const [rows] = await pool.query(
    'SELECT date_local FROM blackout_dates WHERE date_local BETWEEN ? AND ?',
    [fromDateStr, toDateStr]
  )
  return new Set(rows.map(r => String(r.date_local)))
}

async function getBookedUtcIntervals(fromUtc, toUtc) {
  const [rows] = await pool.query(
    `SELECT start_utc, end_utc, status
     FROM appointments
     WHERE status <> 'canceled'
       AND end_utc > ?
       AND start_utc < ?`,
    [fromUtc, toUtc]
  )
  return rows.map(r => ({
    start: new Date(r.start_utc + 'Z'),
    end: new Date(r.end_utc + 'Z')
  }))
}

// Local-date iteration in BUSINESS_TZ to avoid weekday drift
function dateRangeLocal(fromStr, toStr, timeZone) {
  const out = []
  const [fy, fm, fd] = fromStr.split('-').map(Number)
  const [ty, tm, td] = toStr.split('-').map(Number)

  // use noon to avoid DST edge cases
  let cur = new Date(Date.UTC(fy, fm - 1, fd, 12, 0, 0))
  const end = new Date(Date.UTC(ty, tm - 1, td, 12, 0, 0))

  for (; cur.getTime() <= end.getTime(); cur.setUTCDate(cur.getUTCDate() + 1)) {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit'
    })
    out.push(fmt.format(cur)) // YYYY-MM-DD
  }
  // de-dup just in case
  return [...new Set(out)]
}

function weekdayFromYmd(dayStr, timeZone) {
  const [y, m, d] = dayStr.split('-').map(Number)
  const atNoonUTC = new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' })
  const short = fmt.format(atNoonUTC) // "Sun".."Sat"
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return map[short]
}

function parseHHMM(str) {
  const [hh, mm] = str.split(':').map(n => Number(n))
  return { hh, mm }
}

function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart
}

// GET /api/slots?from=YYYY-MM-DD&to=YYYY-MM-DD&tz=America/New_York
app.get('/api/slots', async (req, res) => {
  try {
    const q = slotsQuerySchema.parse({
      from: req.query.from,
      to: req.query.to,
      tz: req.query.tz
    })

    const tz = q.tz || BUSINESS_TZ

    // Defaults: next 14 days (in local/business TZ)
    const todayLocal = formatLocal({ utcDate: new Date(), timeZone: tz }) // string, not useful directly
    // Build from today UTC but format to YYYY-MM-DD in local TZ
    const fmtYmd = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' })
    const fromStr = q.from || fmtYmd.format(new Date())
    const plus14 = new Date(); plus14.setUTCDate(plus14.getUTCDate() + 14)
    const toStr = q.to || fmtYmd.format(plus14)

    const rules = await getAvailabilityRules()
    const blackout = await getBlackoutSet(fromStr, toStr)

    // Window covering local 00:00..23:59:59 across the range
    const [fy, fm, fd] = fromStr.split('-').map(Number)
    const [ty, tm, td] = toStr.split('-').map(Number)
    const windowFromUtc = localToUtc({ timeZone: tz, year: fy, month: fm, day: fd, hour: 0, minute: 0 })
    const windowToUtc   = localToUtc({ timeZone: tz, year: ty, month: tm, day: td, hour: 23, minute: 59 })

    const booked = await getBookedUtcIntervals(windowFromUtc, windowToUtc)

    const out = []
    for (const dayStr of dateRangeLocal(fromStr, toStr, tz)) {
      if (blackout.has(dayStr)) {
        out.push({ date: dayStr, slots: [] })
        continue
      }

      const wd = weekdayFromYmd(dayStr, tz) // 0..6 in local TZ
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

    res.json({ ok: true, timeZone: tz, days: out })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ ok: false, errors: err.flatten() })
    }
    console.error('[slots] error:', err)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
})

/**
 * ======================================
 * Create appointment
 * ======================================
 */
app.post('/api/appointments', async (req, res) => {
  const conn = await pool.getConnection()
  try {
    const body = createApptSchema.parse(req.body)

    // Insert or use existing lead
    let leadId = body.lead_id
    if (!leadId) {
      if (!body.lead) throw new Error('Missing lead details')
      const leadData = leadSchema.parse({ ...body.lead, notifyCustomer: true }) // notifyCustomer unused here
      leadId = uuidv4()
      await conn.execute(
        `INSERT INTO leads
         (id, full_name, email, phone, address, city, state, postal_code, notes, source_path,
          utm_source, utm_medium, utm_campaign, consent)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
          leadData.consent ? 1 : 0
        ]
      )
    }

    // Times
    const [Y, M, D] = body.date.split('-').map(n => Number(n))
    const [h, m] = body.time.split(':').map(n => Number(n))
    const tz = body.timezone || BUSINESS_TZ
    const startUtc = localToUtc({ timeZone: tz, year: Y, month: M, day: D, hour: h, minute: m })
    const endUtc = new Date(startUtc.getTime() + body.durationMinutes * 60 * 1000)

    // Conflict check
    const [conflictRows] = await conn.execute(
      `SELECT id FROM appointments
       WHERE status <> 'canceled'
         AND end_utc > ? AND start_utc < ?`,
      [startUtc.toISOString().slice(0, 19).replace('T', ' '), endUtc.toISOString().slice(0, 19).replace('T', ' ')]
    )
    if (conflictRows.length > 0) {
      return res.status(409).json({ ok: false, error: 'Slot no longer available. Please pick another time.' })
    }

    // Insert appointment
    const apptId = uuidv4()
    const token = uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '')
    await conn.execute(
      `INSERT INTO appointments
       (id, lead_id, start_utc, end_utc, timezone, status, reschedule_token, notes)
       VALUES (?, ?, ?, ?, ?, 'scheduled', ?, ?)`,
      [
        apptId,
        leadId,
        startUtc.toISOString().slice(0, 19).replace('T', ' '),
        endUtc.toISOString().slice(0, 19).replace('T', ' '),
        tz,
        token,
        body.lead?.notes || null
      ]
    )

    // Fetch lead for emails
    const [[lead]] = await conn.query(
      'SELECT full_name, email, phone, address, city, state, postal_code, notes, source_path, utm_source, utm_medium, utm_campaign FROM leads WHERE id = ?',
      [leadId]
    )

    // Email content
    const startLocalText = formatLocal({ utcDate: startUtc, timeZone: tz })
    const icsContent = buildIcs({
      uid: apptId,
      title: 'HydroPros | Aquafound Appointment',
      description: 'Confirmed appointment.',
      startUtc,
      endUtc,
      timeZone: tz
    })

    // Customer email (HTML) + ICS
    await transporter.sendMail({
      from: EMAIL_USER,
      to: lead.email,
      subject: 'Your appointment is confirmed',
      html: renderCustomerEmailHTML({ fullName: lead.full_name, startLocalText }),
      attachments: [{ filename: 'appointment.ics', content: icsContent, contentType: 'text/calendar; charset=utf-8' }]
    })

    // Internal email (HTML) + ICS
    await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_TO,
      subject: 'New Appointment Scheduled',
      html: renderInternalEmailHTML({ lead, startLocalText, timezone: tz }),
      attachments: [{ filename: 'appointment.ics', content: icsContent, contentType: 'text/calendar; charset=utf-8' }]
    })

    res.json({
      ok: true,
      id: apptId,
      lead_id: leadId,
      startUtc: startUtc.toISOString(),
      endUtc: endUtc.toISOString(),
      timezone: tz
    })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ ok: false, errors: err.flatten() })
    }
    console.error('[appointments:create] error:', err)
    res.status(500).json({ ok: false, error: 'Server error' })
  } finally {
    conn.release()
  }
})

/**
 * ======================================
 * Reschedule / Cancel
 * ======================================
 */
app.patch('/api/appointments/:id', async (req, res) => {
  const schema = z.object({
    token: z.string().length(64),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    time: z.string().regex(/^\d{2}:\d{2}$/),
    timezone: z.string().optional(),
    durationMinutes: z.number().int().min(15).max(480).optional()
  })
  const conn = await pool.getConnection()
  try {
    const id = req.params.id
    const body = schema.parse(req.body)
    const tz = body.timezone || BUSINESS_TZ
    const dur = body.durationMinutes || 60

    const [[oldAppt]] = await conn.query('SELECT reschedule_token, status FROM appointments WHERE id = ?', [id])
    if (!oldAppt) return res.status(404).json({ ok: false, error: 'Not found' })
    if (oldAppt.reschedule_token !== body.token) return res.status(403).json({ ok: false, error: 'Bad token' })
    if (oldAppt.status === 'canceled') return res.status(400).json({ ok: false, error: 'Canceled appointment' })

    const [Y, M, D] = body.date.split('-').map(Number)
    const [h, m] = body.time.split(':').map(Number)
    const startUtc = localToUtc({ timeZone: tz, year: Y, month: M, day: D, hour: h, minute: m })
    const endUtc = new Date(startUtc.getTime() + dur * 60 * 1000)

    const [conflicts] = await conn.execute(
      `SELECT id FROM appointments
       WHERE id <> ?
         AND status <> 'canceled'
         AND end_utc > ? AND start_utc < ?`,
      [id, startUtc.toISOString().slice(0, 19).replace('T', ' '), endUtc.toISOString().slice(0, 19).replace('T', ' ')]
    )
    if (conflicts.length) return res.status(409).json({ ok: false, error: 'Slot no longer available' })

    await conn.execute(
      `UPDATE appointments
       SET start_utc = ?, end_utc = ?, timezone = ?, status = 'rescheduled'
       WHERE id = ?`,
      [
        startUtc.toISOString().slice(0, 19).replace('T', ' '),
        endUtc.toISOString().slice(0, 19).replace('T', ' '),
        tz,
        id
      ]
    )
    res.json({ ok: true, id, startUtc: startUtc.toISOString(), endUtc: endUtc.toISOString(), timezone: tz })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ ok: false, errors: err.flatten() })
    }
    console.error('[appointments:reschedule] error:', err)
    res.status(500).json({ ok: false, error: 'Server error' })
  } finally {
    conn.release()
  }
})

app.delete('/api/appointments/:id', async (req, res) => {
  const schema = z.object({ token: z.string().length(64) })
  try {
    const id = req.params.id
    const body = schema.parse(req.body)
    const [rows] = await pool.query('SELECT reschedule_token, status FROM appointments WHERE id = ?', [id])
    if (!rows.length) return res.status(404).json({ ok: false, error: 'Not found' })
    const appt = rows[0]
    if (appt.reschedule_token !== body.token) return res.status(403).json({ ok: false, error: 'Bad token' })
    if (appt.status === 'canceled') return res.json({ ok: true })

    await pool.query('UPDATE appointments SET status = "canceled" WHERE id = ?', [id])
    res.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ ok: false, errors: err.flatten() })
    }
    console.error('[appointments:cancel] error:', err)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
})

/**
 * ======================================
 * Boot
 * ======================================
 */
async function start() {
  try {
    await initDb()
    await initMailer()
    app.listen(PORT, () => {
      console.log(`[server] listening on http://localhost:${PORT} (${NODE_ENV})`)
    })
  } catch (err) {
    console.error('[boot] failed:', err)
    process.exit(1)
  }
}
start()
