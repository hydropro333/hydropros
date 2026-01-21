export const BUSINESS_TZ = process.env.BUSINESS_TZ || 'America/New_York'

export function localToUtc({ timeZone, year, month, day, hour, minute }) {
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

export function formatLocal({ utcDate, timeZone }) {
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

export function buildIcs({ uid, title, description, startUtc, endUtc, timeZone }) {
  const dt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FloridaHydroPros//Scheduling//EN',
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

export function dateRangeLocal(fromStr, toStr, timeZone) {
  const out = []
  const [fy, fm, fd] = fromStr.split('-').map(Number)
  const [ty, tm, td] = toStr.split('-').map(Number)
  let cur = new Date(Date.UTC(fy, fm - 1, fd, 12, 0, 0))
  const end = new Date(Date.UTC(ty, tm - 1, td, 12, 0, 0))
  for (; cur.getTime() <= end.getTime(); cur.setUTCDate(cur.getUTCDate() + 1)) {
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone, year: 'numeric', month: '2-digit', day: '2-digit'
    })
    out.push(fmt.format(cur))
  }
  return [...new Set(out)]
}

export function weekdayFromYmd(dayStr, timeZone) {
  const [y, m, d] = dayStr.split('-').map(Number)
  const atNoonUTC = new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'short' })
  const short = fmt.format(atNoonUTC)
  const map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return map[short]
}

export function parseHHMM(str) {
  const [hh, mm] = str.split(':').map(n => Number(n))
  return { hh, mm }
}

export function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && aEnd > bStart
}
