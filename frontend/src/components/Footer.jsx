import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './Footer.module.css'
import Logo from './Logo.jsx'
import { submitSubscription } from '../lib/api.js'

// Simple SVG icons for social media to avoid needing a new library yet
function FacebookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069 4.85c.149-3.225 1.664 4.771 4.919 4.919 1.266.058 1.644.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z" />
    </svg>
  )
}

function Footer() {
  const year = new Date().getFullYear()
  const [updatesEmail, setUpdatesEmail] = useState('')
  const [updatesStatus, setUpdatesStatus] = useState('idle')
  const [updatesError, setUpdatesError] = useState('')

  const onSubscribe = async (event) => {
    event.preventDefault()
    const email = updatesEmail.trim()
    if (!email) {
      setUpdatesStatus('error')
      setUpdatesError('Email is required.')
      return
    }

    setUpdatesStatus('submitting')
    setUpdatesError('')
    try {
      await submitSubscription({ email })
      setUpdatesEmail('')
      setUpdatesStatus('success')
    } catch (err) {
      setUpdatesStatus('error')
      setUpdatesError(typeof err === 'string' ? err : 'Subscription failed. Please try again.')
    }
  }

  return (
    <footer id="site-footer" className={styles.footer}>
      {/* CTA Ribbon */}
      <div className={`container ${styles.ribbon}`}>
        <div className={styles.ribbonCopy}>
          <span className="tagline">
            <span className="badge-dot" aria-hidden="true" /> Consultation
          </span>
          <h3>Craft your signature water experience</h3>
          <p>Speak with a hydro specialist to plan the perfect system.</p>
        </div>
        <div className={styles.ribbonActions}>
          <Link className="btn btn-primary" to="/service#consultation-form">
            Book Consultation
          </Link>
          {/* CHANGED: The "View Systems" button has been removed 
            to avoid confusion when you're already on the Sales page.
          */}
        </div>
      </div>

      {/* Main Footer */}
      <div className={`container ${styles.main}`}>
        <div className={styles.logoRow}>
          <Logo size="lg" />
        </div>

        <div id="footer-contact" className={styles.contentRow}>
          <div className={styles.contactCard}>
            <div>Sam Carter</div>
            <a href="tel:9544042312">954-404-2312</a>
            <div>
              4539 Bartelt Rd.
              <br />
              Holiday, FL 34690
            </div>
            <a href="mailto:sales@floridahydropros.com">sales@floridahydropros.com</a>
          </div>

          <div className={styles.links}>
            <nav className={styles.linkGroup} aria-label="Explore">
              <h4>Explore</h4>
              <ul>
                <li>
                  <Link to="/" onClick={() => window.scrollTo(0, 0)}>Home</Link>
                </li>
                <li>
                  <Link to="/about" onClick={() => window.scrollTo(0, 0)}>About</Link>
                </li>
                <li>
                  <Link to="/gallery" onClick={() => window.scrollTo(0, 0)}>Gallery</Link>
                </li>
                <li>
                  <Link to="/service" onClick={() => window.scrollTo(0, 0)}>Service</Link>
                </li>
              </ul>
            </nav>
            <nav className={styles.linkGroup} aria-label="Follow Us">
              <h4>Follow Us</h4>
              <div className={styles.socialLinks}>
                <a
                  href="https://www.facebook.com/floridahydropros"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <FacebookIcon />
                </a>
                <a
                  href="https://www.instagram.com/floridahydropros"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <InstagramIcon />
                </a>
              </div>
            </nav>
          </div>

          <div className={styles.updates}>
            <h4>Stay Updated</h4>
            <p>Monthly water intelligence from our engineers.</p>
            <form className={styles.updatesForm} onSubmit={onSubscribe} noValidate>
              <label className="sr-only" htmlFor="updates-email">
                Email address
              </label>
              <input
                id="updates-email"
                type="email"
                name="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={updatesEmail}
                onChange={(event) => setUpdatesEmail(event.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={updatesStatus === 'submitting'}>
                {updatesStatus === 'submitting' ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
            {updatesStatus === 'success' && (
              <p className={styles.updatesStatus}>Thanks for subscribing.</p>
            )}
            {updatesStatus === 'error' && updatesError && (
              <p className={styles.updatesStatus}>{updatesError}</p>
            )}
          </div>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {year} HydroPros</p>
      </div>
    </footer>
  )
}

export default Footer
