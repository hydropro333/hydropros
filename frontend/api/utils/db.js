import pg from 'pg'

const { Pool } = pg

let pool = null

export async function getPool() {
  if (pool) return pool

  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error('Missing DATABASE_URL environment variable')
  }

  pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 5
  })

  return pool
}

export function formatDbDate(value) {
  const d = new Date(value)
  return d.toISOString()
}

// Helper to run queries with consistent interface
export async function query(sql, params = []) {
  const pool = await getPool()
  const result = await pool.query(sql, params)
  return [result.rows]
}

export async function execute(sql, params = []) {
  const pool = await getPool()
  const result = await pool.query(sql, params)
  return [{ affectedRows: result.rowCount }]
}
