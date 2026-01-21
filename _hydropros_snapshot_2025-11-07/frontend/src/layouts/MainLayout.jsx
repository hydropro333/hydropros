import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import Footer from '../components/Footer.jsx'
import styles from './MainLayout.module.css'

const navigation = [
  { label: 'Home', path: '/' },
  { label: 'Sales', path: '/sales' },
  { label: 'Service', path: '/service' },
]

function MainLayout() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const headerRef = useRef(null)
  const { pathname } = useLocation()

  // Scroll to top when the page changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Lock body scroll when menu is open
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [open])

  return (
    <div className={styles.appShell}>
      <a href="#main" className={styles.skipLink}>
        Skip to content
      </a>
      <header ref={headerRef} className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        {/* Primary navigation */}
        <div className={`container ${styles.primaryBar}`}>
          <Logo size="md" />

          <button
            className={styles.menuButton}
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.menuIcon} aria-hidden="true" />
          </button>

          <nav className={`${styles.nav} ${open ? styles.open : ''}`}>
            <ul className={styles.navList}>
              {navigation.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`
                    }
                    end={item.path === '/'}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className={styles.ctaGroup}>
            <a className="btn btn-secondary" href="#download">Download Guide</a>
            <a className="btn btn-primary" href="#contact">Book Consultation</a>
          </div>
        </div>
      </header>

      <main id="main" className="container">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MainLayout