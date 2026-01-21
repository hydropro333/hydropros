import { useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './About.module.css'

import aboutImage1 from '../assets/waterboy1.png'
import aboutImage2 from '../assets/waterboy9.png'

function About() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(null)

  const openLightbox = (src, alt) => {
    setActiveImage({ src, alt })
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setActiveImage(null)
    document.body.style.overflow = ''
  }

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <span className="tagline">
            <span className="badge-dot" /> Our Story
          </span>
          <h1>About HydroPros</h1>
          <p className={styles.heroSubtitle}>
            Born from experience. Driven by purpose.
          </p>
        </div>
      </section>

      {/* Sam's Story */}
      <section className={styles.section}>
        <div className={`container ${styles.storyGrid}`}>
          <div className={styles.storyContent}>
            <h2>A Mission That Started With a Question</h2>
            <p>
              For fifteen years, Sam Carter worked in the water treatment industry across Florida.
              He installed systems, serviced equipment, and tested water in hundreds of homes
              from Tampa to the Gulf Coast. But one question kept surfacing: why were so many
              families still drinking water they didn't trust?
            </p>
            <p>
              The answer wasn't simple. Sam saw firsthand how outdated equipment, one-size-fits-all
              solutions, and lack of follow-through left homeowners with systems that underperformed
              or failed entirely. He watched families spend thousands on equipment that didn't address
              their specific water challenges—and he knew there had to be a better way.
            </p>
            <p>
              In founding HydroPros, Sam set out to be the change he wanted to see. Not just
              another company selling water softeners, but a team committed to understanding each
              home's unique water profile and delivering solutions that actually work—tested,
              verified, and supported long after installation day.
            </p>
          </div>
          <div className={styles.storyImage}>
            <button
              className={styles.imageButton}
              onClick={() => openLightbox(aboutImage1, 'HydroPros installation')}
              aria-label="View larger image"
            >
              <img
                src={aboutImage1}
                alt="HydroPros water system installation"
                loading="lazy"
              />
              <span className={styles.expandHint}>Click to expand</span>
            </button>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className={`${styles.section} ${styles.problemSection}`}>
        <div className="container">
          <h2>The Reality of Florida Water</h2>
          <p className={styles.sectionIntro}>
            Florida's water faces challenges that most homeowners don't see—until they're
            dealing with stained fixtures, dry skin, or water that simply doesn't taste right.
          </p>

          <div className={styles.problemGrid}>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v6m0 12v2M4.93 4.93l4.24 4.24m5.66 5.66l4.24 4.24M2 12h6m12 0h2M4.93 19.07l4.24-4.24m5.66-5.66l4.24-4.24"/>
                </svg>
              </div>
              <h3>PFAS Contamination</h3>
              <p>
                Recent testing in Pasco County and the Tampa Bay region has revealed PFAS
                levels—often called "forever chemicals"—exceeding federal guidelines. These
                synthetic compounds don't break down naturally and have been linked to
                serious health concerns.
              </p>
            </div>

            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <h3>Hard Water & Mineral Buildup</h3>
              <p>
                Florida's limestone aquifer produces some of the hardest water in the country.
                Left untreated, calcium and magnesium deposits damage appliances, clog pipes,
                and leave residue on everything water touches.
              </p>
            </div>

            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
                  <line x1="16" y1="8" x2="2" y2="22"/>
                  <line x1="17.5" y1="15" x2="9" y2="15"/>
                </svg>
              </div>
              <h3>Chlorine & Disinfection Byproducts</h3>
              <p>
                Municipal treatment keeps water safe for transport, but the chlorine used
                creates byproducts that affect taste, smell, and can irritate sensitive
                skin. What's safe at the plant isn't always ideal at your tap.
              </p>
            </div>

            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3>Well Water Challenges</h3>
              <p>
                Private wells face their own issues: iron that stains everything orange,
                sulfur that creates that unmistakable rotten-egg smell, and sediment that
                wears down fixtures and appliances over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className={styles.section}>
        <div className={`container ${styles.approachGrid}`}>
          <div className={styles.approachImage}>
            <button
              className={styles.imageButton}
              onClick={() => openLightbox(aboutImage2, 'HydroPros system')}
              aria-label="View larger image"
            >
              <img
                src={aboutImage2}
                alt="Complete water treatment system"
                loading="lazy"
              />
              <span className={styles.expandHint}>Click to expand</span>
            </button>
          </div>
          <div className={styles.approachContent}>
            <h2>The HydroPros Difference</h2>
            <p>
              We don't sell equipment—we solve water problems. Every installation begins
              with comprehensive testing to understand exactly what's in your water and
              what it takes to fix it.
            </p>
            <ul className={styles.approachList}>
              <li>
                <strong>Florida-specific solutions</strong> — Systems designed around
                local water profiles, not generic configurations
              </li>
              <li>
                <strong>Whole-home thinking</strong> — We treat water at the source so
                every tap, shower, and appliance benefits
              </li>
              <li>
                <strong>Verified results</strong> — Post-installation testing confirms
                the system is performing as promised
              </li>
              <li>
                <strong>Ongoing partnership</strong> — Service plans and follow-up testing
                keep your water consistent for years
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Service Area */}
      <section className={`${styles.section} ${styles.areaSection}`}>
        <div className="container">
          <h2>Proudly Serving the Tampa Bay Region</h2>
          <p className={styles.sectionIntro}>
            From the Gulf beaches to inland communities, HydroPros serves homeowners
            throughout Pasco, Pinellas, and Hillsborough counties.
          </p>
          <div className={styles.areaList}>
            <span>Newport Richey</span>
            <span>Port Richey</span>
            <span>Hudson</span>
            <span>Palm Harbor</span>
            <span>Tarpon Springs</span>
            <span>Clearwater</span>
            <span>Dunedin</span>
            <span>Oldsmar</span>
            <span>Tampa</span>
            <span>Largo</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2>Your Water Deserves Better</h2>
            <p>
              Schedule a free consultation and water test. We'll show you exactly what's
              in your water and what it takes to transform it—no obligation, no pressure.
            </p>
            <Link to="/service#consultation-form" className={styles.ctaButton}>
              <span>Request Your Free Consultation</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && activeImage && (
        <div
          className={styles.lightbox}
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <button
            className={styles.closeBtn}
            onClick={closeLightbox}
            aria-label="Close"
          >
            &times;
          </button>
          <img
            src={activeImage.src}
            alt={activeImage.alt}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}

export default About
