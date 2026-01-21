import nodemailer from 'nodemailer'

let transporter = null

export async function getTransporter() {
  if (transporter) return transporter

  const {
    EMAIL_HOST = 'smtp.zoho.com',
    EMAIL_PORT = 465,
    EMAIL_SECURE = 'true',
    EMAIL_USER,
    EMAIL_PASS
  } = process.env

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error('Missing email configuration')
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: String(EMAIL_SECURE).toLowerCase() === 'true',
    auth: { user: EMAIL_USER, pass: EMAIL_PASS }
  })

  return transporter
}

export function renderCustomerEmailHTML({ fullName, startLocalText }) {
  return `
    <div style="font-family: Arial, sans-serif; line-height:1.6; color:#0b1d2a;">
      <h2 style="margin:0 0 12px 0;">Your appointment is confirmed</h2>
      <p>Hi ${fullName || 'there'},</p>
      <p>Your appointment with <strong>Florida Hydro Pros</strong> is confirmed for <strong>${startLocalText}</strong>.</p>
      <p>A team member will call you soon to confirm details and answer questions.</p>
      <p>If you need to reschedule or cancel, please call <a href="tel:954-404-2312">954-404-2312</a>.</p>
      <p>We look forward to meeting you.</p>
      <p>— <strong>Florida Hydro Pros</strong></p>
    </div>
  `
}

export function renderInternalEmailHTML({ lead, startLocalText, timezone }) {
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
      <p><strong>Notes:</strong> ${lead.notes || '(none)'}</p>
      <hr/>
      <p><strong>Source path:</strong> ${lead.source_path || '/'}</p>
      <p><strong>UTM Source:</strong> ${lead.utm_source || '(none)'} • <strong>UTM Medium:</strong> ${lead.utm_medium || '(none)'} • <strong>UTM Campaign:</strong> ${lead.utm_campaign || '(none)'}</p>
    </div>
  `
}
