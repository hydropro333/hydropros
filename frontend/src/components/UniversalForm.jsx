// frontend/src/components/UniversalForm.jsx
import PropTypes from 'prop-types'
import React, { useRef, useState } from 'react'
import styles from './UniversalForm.module.css'
import { submitLead } from '../lib/api.js'

export default function UniversalForm({ formId }) {
  const formRef = useRef(null)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()

    // Read directly from the form to cooperate with browser autofill
    const fd = new FormData(formRef.current)

    const fullName = (fd.get('fullName') || '').toString().trim()
    const email = (fd.get('email') || '').toString().trim()
    const phone = (fd.get('phone') || '').toString().trim()
    const address = (fd.get('address') || '').toString().trim() || null
    const city = (fd.get('city') || '').toString().trim() || null
    const state = (fd.get('state') || '').toString().trim() || null
    const postalCode = (fd.get('postalCode') || '').toString().trim() || null
    const reason = (fd.get('reason') || '').toString().trim()
    const consent = fd.get('consent') === 'on'

    if (!fullName || !email || !phone) {
      alert('Please fill your name, email, and phone.')
      return
    }

    setSubmitting(true)
    try {
      await submitLead({
        fullName,
        email,
        phone,
        address,
        city,
        state,
        postalCode,
        notes: reason ? `Reason: ${reason}` : null,
        consent,
      })

      setSuccess(true)
      formRef.current?.reset()
    } catch (err) {
      console.error(err)
      alert(typeof err === 'string' ? err : 'Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const anchorProps = formId ? { id: formId, tabIndex: -1 } : {}

  if (success) {
    return (
      <div
        className={styles.wrapper + ' ' + styles.success}
        {...anchorProps}
        role="status"
        aria-live="polite"
      >
        <h3>Appointment Confirmed</h3>
        <p>Thank you. We sent a confirmation email with your selected time.</p>
        <p>If you don’t see it, check spam or promotions.</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper} {...anchorProps}>
      <h2 className={styles.title}>Request a Consultation</h2>
      <p className={styles.subtitle}>
        Fill out the form to schedule your appointment, or call us directly.
      </p>

      <form ref={formRef} className={styles.form} onSubmit={onSubmit} autoComplete="on" noValidate>
        {/* Name / Phone */}
        <div className={styles.row}>
          <label>
            Full Name
            <input
              type="text"
              name="fullName"
              autoComplete="name"
              placeholder="John Doe"
              required
            />
          </label>
          <label>
            Phone Number
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="(555) 123-4567"
              inputMode="tel"
              pattern="^\\+?[0-9\\s().-]{7,}$"
              required
            />
          </label>
        </div>

        {/* Email / Address line 1 */}
        <div className={styles.row}>
          <label>
            Email Address
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@company.com"
              required
            />
          </label>
          <label>
            Service Address
            <input
              type="text"
              name="address"
              autoComplete="address-line1"
              placeholder="123 Main St"
            />
          </label>
        </div>

        {/* City / State / ZIP */}
        <div className={styles.row}>
          <label>
            City
            <input type="text" name="city" autoComplete="address-level2" placeholder="City" />
          </label>
          <label>
            State
            <input
              type="text"
              name="state"
              autoComplete="address-level1"
              placeholder="FL"
              inputMode="text"
              pattern="[A-Za-z]{2}"
              maxLength={2}
            />
          </label>
          <label>
            ZIP
            <input
              type="text"
              name="postalCode"
              autoComplete="postal-code"
              placeholder="33601"
              inputMode="numeric"
              pattern="^\\d{5}(-\\d{4})?$"
              maxLength={10}
            />
          </label>
        </div>

        {/* Reason */}
        <div className={styles.row}>
          <label>
            Reason for Inquiry
            <select name="reason" defaultValue="">
              <option value="" disabled>
                Select a reason…
              </option>
              <option value="System quote">System quote</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Filter replacement">Filter replacement</option>
              <option value="Other">Other</option>
            </select>
          </label>
        </div>

        {/* Consent */}
        <div className={styles.row}>
          <label className={styles.checkbox}>
            <input type="checkbox" name="consent" />I grant HydroPros permission to contact me
            regarding this inquiry.
          </label>
        </div>

        <button className={styles.submit} type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Schedule My Appointment'}
        </button>
      </form>
    </div>
  )
}

UniversalForm.propTypes = {
  formId: PropTypes.string,
}
