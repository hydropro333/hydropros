// frontend/src/lib/api.js

// ---------- ENV / base URL ----------
const DEV = location.hostname === 'localhost' || location.hostname === '127.0.0.1'

const API_BASE =
  import.meta && import.meta.env && import.meta.env.VITE_API_BASE
    ? import.meta.env.VITE_API_BASE
    : DEV
      ? 'http://localhost:5000'
      : ''

// Join helper to avoid double slashes
function api(path) {
  return `${API_BASE}${path}`
}

// ---------- Small helpers ----------
function qp(name) {
  const url = new URL(window.location.href)
  return url.searchParams.get(name) || null
}

function collectTracking() {
  const url = new URL(window.location.href)
  return {
    sourcePath: url.pathname || '/',
    utm_source: qp('utm_source'),
    utm_medium: qp('utm_medium'),
    utm_campaign: qp('utm_campaign'),
  }
}

async function httpJson(url, options) {
  const res = await fetch(url, options)
  let json = null
  try {
    json = await res.json()
  } catch {
    // Ignore body parsing issues; non-JSON responses fall through to the error handling below.
  }
  if (!res.ok || !json || json.ok === false) {
    const err = (json && (json.error || json.errors)) || 'Request failed'
    throw err
  }
  return json
}

// ---------- Leads ----------
export async function submitLead(data) {
  const t = collectTracking()
  const payload = {
    fullName: data.fullName?.trim() || '',
    email: data.email?.trim() || '',
    phone: data.phone?.trim() || '',
    address: data.address?.trim() || null,
    city: data.city?.trim() || null,
    state: data.state?.trim() || null,
    postalCode: data.postalCode?.trim() || null,
    notes: data.notes?.trim() || null,
    consent: !!data.consent,
    sourcePath: t.sourcePath,
    utm_source: t.utm_source,
    utm_medium: t.utm_medium,
    utm_campaign: t.utm_campaign,
  }

  return httpJson(api('/api/leads'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

// ---------- Newsletter ----------
export async function submitSubscription({ email }) {
  const t = collectTracking()
  const payload = {
    email: email?.trim() || '',
    sourcePath: t.sourcePath,
    utm_source: t.utm_source,
    utm_medium: t.utm_medium,
    utm_campaign: t.utm_campaign,
  }

  return httpJson(api('/api/subscribe'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

// ---------- Availability ----------
export async function fetchSlots({ from, to, tz }) {
  const qs = new URLSearchParams()
  if (from) qs.set('from', from)
  if (to) qs.set('to', to)
  if (tz) qs.set('tz', tz)

  return httpJson(api('/api/slots?' + qs.toString()), { method: 'GET' })
}

// ---------- Appointments ----------
export async function createAppointment({ lead, date, time, durationMinutes = 60, timezone }) {
  const t = collectTracking()
  const fullLead = {
    fullName: lead.fullName?.trim() || '',
    email: lead.email?.trim() || '',
    phone: lead.phone?.trim() || '',
    address: lead.address?.trim() || null,
    city: lead.city?.trim() || null,
    state: lead.state?.trim() || null,
    postalCode: lead.postalCode?.trim() || null,
    notes: lead.notes?.trim() || null,
    consent: !!lead.consent,
    sourcePath: lead.sourcePath ?? t.sourcePath,
    utm_source: lead.utm_source ?? t.utm_source,
    utm_medium: lead.utm_medium ?? t.utm_medium,
    utm_campaign: lead.utm_campaign ?? t.utm_campaign,
  }

  const payload = {
    lead: fullLead,
    date,
    time,
    durationMinutes,
    timezone,
  }

  return httpJson(api('/api/appointments'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}
