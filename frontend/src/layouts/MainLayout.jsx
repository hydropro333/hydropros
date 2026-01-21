import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import Footer from '../components/Footer.jsx'
import styles from './MainLayout.module.css'

const navigation = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/#site-footer' },
  { label: 'Service', path: '/service' },
]

function MainLayout() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
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
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
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
                  {item.label === 'Contact' ? (
                    <button
                      type="button"
                      className={styles.navLink}
                      onClick={() => {
                        setOpen(false)
                        document.getElementById('site-footer')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                    >
                      {item.label}
                    </button>
                  ) : (
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
                  )}
                </li>
              ))}
            </ul>
          </nav>
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
