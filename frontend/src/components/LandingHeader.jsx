import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './LandingHeader.module.css'
import mainLogo from '../assets/main logo.png'

function LandingHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const scrollToForm = () => {
    setMenuOpen(false)
    document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.logo}>
          <img
            src={mainLogo}
            alt="HydroPros"
            className={styles.logoImage}
            loading="eager"
            decoding="async"
          />
        </div>

        <button
          className={`${styles.menuButton} ${menuOpen ? styles.menuButtonOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`}>
          <Link to="/" className={styles.navLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" className={styles.navLink} onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/gallery" className={styles.navLink} onClick={() => setMenuOpen(false)}>Gallery</Link>
          <button
            type="button"
            className={styles.navLink}
            onClick={scrollToForm}
          >
            Contact
          </button>
          <span className={styles.navLinkActive}>Service</span>
        </nav>
        <div className={styles.phoneGroup}>
          <span className={styles.phoneLabel}>Call Us Today!</span>
          <a href="tel:954-404-2312" className={styles.phonePill}>
            954-404-2312
          </a>
        </div>
      </div>
    </header>
  )
}

export default LandingHeader
