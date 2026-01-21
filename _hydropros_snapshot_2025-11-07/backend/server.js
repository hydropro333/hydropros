import 'dotenv/config'                            // loads .env (environment variables = private settings)
import express from 'express'                     // web server (API)
import helmet from 'helmet'                       // security headers (adds safe HTTP headers)
import cors from 'cors'                           // cross-origin sharing (lets your frontend call this API)
import morgan from 'morgan'                       // request logs (prints requests in the console)
import rateLimit from 'express-rate-limit'        // throttling (limits rapid/bot requests)
import { z } from 'zod'                           // schema validation (ensures inputs are valid)
import { v4 as uuidv4 } from 'uuid'               // unique IDs (random identifiers)
import mysql from 'mysql2/promise'                // MySQL client (database connector)
import nodemailer from 'nodemailer'               // email sender (SMTP client)

// === Basic config ===
const PORT = Number(process.env.PORT || 5000)
const NODE_ENV = process.env.NODE_ENV || 'development'

// Allowed websites that may call this API from a browser (CORS = cross-origin resource sharing)
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://aquafound.com',
  'http://aquafound.com'
]

// === MySQL connection (from .env) ===
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_NAME = process.env.DB_NAME

// === Email (optional until you fill in .env) ===
const EMAIL_HOST = process.env.EMAIL_HOST
const EMAIL_PORT = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : undefined
const EMAIL_SECURE = process.env.EMAIL_SECURE === 'true'
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const EMAIL_TO   = process.env.EMAIL_TO || EMAIL_USER

// === Start Express app ===
const app = express()
app.disable('x-powered-by')
app.use(helmet())
app.use(express.json({ limit: '1mb' }))
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)           // allow curl/postman
    if (ALLOWED_ORIGINS.includes(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  }
}))
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use('/api/', rateLimit({ windowMs: 60_000, max: 60 })) // 60 req/min/IP

// === MySQL pool (single place to get DB connections) ===
let db = null
async function initDb() {
  db = await mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    connectionLimit: 5,
    supportBigNumbers: true,
    dateStrings: true
  })

  // Create table if needed
  await db.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id VARCHAR(36) PRIMARY KEY,
      full_name VARCHAR(200) NOT NULL,
      email VARCHAR(200) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      address VARCHAR(300),
      city VARCHAR(120),
      state VARCHAR(80),
      postal_code VARCHAR(30),
      notes TEXT,
      source_path VARCHAR(200),
      utm_source VARCHAR(100),
      utm_medium VARCHAR(100),
      utm_campaign VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `)
  console.log('[mysql] connected and table ready')
}

// === Email transporter (only if all required fields present) ===
let mailer = null
async function initMailer() {
  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    console.log('[email] disabled (missing EMAIL_* in .env)')
    return
  }
  mailer = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT ?? 465,
    secure: EMAIL_SECURE ?? true,
    auth: { user: EMAIL_USER, pass: EMAIL_PASS }
  })
  try {
    await mailer.verify()
    console.log('[email] SMTP ready')
  } catch (err) {
    console.warn('[email] SMTP verify failed:', err?.message)
    mailer = null
  }
}

// === Input validation schema (what a lead must contain) ===
const LeadSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(200),
  email: z.string().email('Valid email is required').max(200),
  phone: z.string().min(7, 'Phone is required').max(50),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  sourcePath: z.string().optional().nullable(),
  utm_source: z.string().optional().nullable(),
  utm_medium: z.string().optional().nullable(),
  utm_campaign: z.string().optional().nullable()
})

// === Routes ===
app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

app.post('/api/leads', async (req, res) => {
  // 1) Validate
  const parsed = LeadSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ ok: false, errors: parsed.error.flatten() })
  }

  // 2) Build record
  const id = uuidv4()
  const d = parsed.data
  const record = {
    id,
    full_name: d.fullName,
    email: d.email,
    phone: d.phone,
    address: d.address || null,
    city: d.city || null,
    state: d.state || null,
    postal_code: d.postalCode || null,
    notes: d.notes || null,
    source_path: d.sourcePath || null,
    utm_source: d.utm_source || null,
    utm_medium: d.utm_medium || null,
    utm_campaign: d.utm_campaign || null
  }

  // 3) Insert into MySQL
  try {
    await db.query(
      `INSERT INTO leads
       (id, full_name, email, phone, address, city, state, postal_code, notes, source_path, utm_source, utm_medium, utm_campaign)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        record.id, record.full_name, record.email, record.phone,
        record.address, record.city, record.state, record.postal_code,
        record.notes, record.source_path, record.utm_source, record.utm_medium, record.utm_campaign
      ]
    )
  } catch (err) {
    console.error('[mysql] insert failed:', err?.message)
    return res.status(500).json({ ok: false, error: 'Database error' })
  }

  // 4) Optional email notification
  if (mailer && EMAIL_TO) {
    try {
      await mailer.sendMail({
        from: EMAIL_USER,
        to: EMAIL_TO,
        subject: `New Aquafound lead: ${record.full_name}`,
        text:
`New lead

Name: ${record.full_name}
Email: ${record.email}
Phone: ${record.phone}
Address: ${record.address || ''}
City: ${record.city || ''}
State: ${record.state || ''}
Postal: ${record.postal_code || ''}
Notes: ${record.notes || ''}

Source path: ${record.source_path || ''}
UTM: ${record.utm_source || ''} / ${record.utm_medium || ''} / ${record.utm_campaign || ''}`,
      })
    } catch (err) {
      console.warn('[email] send failed:', err?.message)
      // do not fail the request only because email failed
    }
  }

  return res.status(201).json({ ok: true, id })
})

// === Boot ===
const start = async () => {
  try {
    // Ensure required DB settings exist
    if (!DB_HOST || !DB_USER || !DB_NAME) {
      throw new Error('Missing DB_* settings in .env')
    }
    await initDb()
    await initMailer()
    app.listen(PORT, () => {
      console.log(`[server] listening on http://localhost:${PORT} (${NODE_ENV})`)
    })
  } catch (err) {
    console.error('[boot] failed:', err.message)
    process.exit(1)
  }
}
start()
