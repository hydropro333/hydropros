import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styles from './LandingPage.module.css'
import UniversalForm from '../components/UniversalForm.jsx'
import LandingHeader from '../components/LandingHeader.jsx'
import Footer from '../components/Footer.jsx'

import hydroSystemOne from '../assets/hydrosystem1.png'
import hydroSystemTwo from '../assets/hydrosystem2.png'
import systemCore from '../assets/system1.png'
import waterCascade from '../assets/water4.png'
import waterTexture from '../assets/water7.png'
import filterCore from '../assets/filter1.png'
import testImageOne from '../assets/test1.png'
import testImageTwo from '../assets/test2.png'
import waterBanner from '../assets/water.png'

function LandingPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const location = useLocation()

  // Handle hash scroll (e.g., /service#consultation-form)
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1))
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }, [location])

  const galleryImages = useMemo(
    () => [
      {
        id: 'hero-left',
        src: hydroSystemOne,
        alt: 'Whole-home water system, model 1',
        label: 'HydroSystem One',
        blurb:
          'Whole-home purification tuned for Florida homes. Finish A blends seamlessly with coastal interiors.',
        group: 'hero',
      },
      {
        id: 'hero-right',
        src: hydroSystemTwo,
        alt: 'Whole-home water system, model 2',
        label: 'HydroSystem Two',
        blurb:
          'Same performance with a bolder aesthetic. Finish B stands out in modern environments without compromising performance.',
        group: 'hero',
      },
      {
        id: 'support-core',
        src: systemCore,
        alt: 'HydroPros 10-stage whole-home system',
        label: 'Whole-Home Anchor',
        blurb: 'Ten-stage architecture engineered for Florida’s coastal water profile.',
        group: 'support',
      },
      {
        id: 'water-flow',
        src: waterTexture,
        alt: 'Water depth detail',
        label: 'Sculpted Flow',
        blurb:
          'Layered media eliminate heavy metals, chloramines, and microorganisms before they enter your home.',
        group: 'story',
      },
      {
        id: 'water-cascade',
        src: waterCascade,
        alt: 'Water cascade detail',
        label: 'Florida Resilience',
        blurb:
          'The ten-stage configuration softens scale, eliminates lead and arsenic, and protects fixtures from corrosion.',
        group: 'story',
      },
      {
        id: 'filter-core',
        src: filterCore,
        alt: 'Filter core detail',
        label: 'Built to Last',
        blurb: 'Lifetime-grade components keep maintenance minimal while delivering crisp water.',
        group: 'story',
      },
      {
        id: 'test-left',
        src: testImageOne,
        alt: 'HydroPros technician testing a home water sample',
        label: 'On-Site Testing',
        blurb: 'Certified experts run a free water test in just 10 minutes.',
        group: 'promo',
      },
      {
        id: 'test-right',
        src: testImageTwo,
        alt: 'HydroPros technician reviewing filter installation plans',
        label: 'Premium Filter',
        blurb: 'Receive a complementary drinking filter during the same visit.',
        group: 'promo',
      },
    ],
    [],
  )

  const getImageIndex = useCallback(
    (id) => galleryImages.findIndex((img) => img.id === id),
    [galleryImages],
  )

  const heroUnits = galleryImages.filter((img) => img.group === 'hero')
  const [heroUnitLeft, heroUnitRight] = heroUnits
  const heroSupport = galleryImages.find((img) => img.id === 'support-core')
  const heroLeftIndex = heroUnitLeft ? getImageIndex(heroUnitLeft.id) : -1
  const heroRightIndex = heroUnitRight ? getImageIndex(heroUnitRight.id) : -1
  const heroSupportIndex = heroSupport ? getImageIndex(heroSupport.id) : -1
  const heroPromoShots = ['test-left', 'test-right']
    .map((id) => {
      const index = getImageIndex(id)
      if (index === -1) return null
      return { ...galleryImages[index], index }
    })
    .filter(Boolean)

  const storyTiles = [
    {
      title: 'Whole-home coverage',
      copy:
        'Every faucet, shower, and appliance receives the same premium water-treatment architecture targeting 16+ contaminants including heavy metals, chloramines, ammonia, and microorganisms.',
      imageId: 'water-flow',
    },
    {
      title: 'Florida-ready resilience',
      copy:
        'Engineered for coastal conditions, the ten-stage configuration softens scale, mitigates microbial growth, and preserves fixture life.',
      imageId: 'water-cascade',
    },
    {
      title: 'Built to last a lifetime',
      copy:
        'Minimal service keeps the luxury-grade performance steady, delivering clean, crisp water from the moment you turn the tap.',
      imageId: 'filter-core',
    },
  ]

  const insightCards = [
    {
      title: 'Crystal finish',
      copy: 'Balanced water makes every sip taste better and look clearer while protecting appliances and fixtures.',
    },
    {
      title: 'Silky comfort',
      copy: 'Showers and laundry instantly feel different when chlorine, scale, and harsh byproducts are dialed down.',
    },
    {
      title: 'Appliance assurance',
      copy: 'Water heaters, smart fixtures, and laundry systems all benefit from corrosion-free, conditioned water.',
    },
  ]

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => setLightboxOpen(false)

  const prevImage = useCallback(() => {
    setLightboxIndex((i) => (i === 0 ? galleryImages.length - 1 : i - 1))
  }, [galleryImages.length])

  const nextImage = useCallback(() => {
    setLightboxIndex((i) => (i === galleryImages.length - 1 ? 0 : i + 1))
  }, [galleryImages.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen, nextImage, prevImage])

  return (
    <div className={styles.page}>
      <section
        className={styles.topBanner}
        style={{ backgroundImage: `url(${waterBanner})` }}
        aria-label="Water banner"
      >
        <div className={styles.headerDock}>
          <LandingHeader />
        </div>
      </section>

      <section className={styles.brandBanner} aria-label="HydroPros hero image" />

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={`${styles.container} ${styles.heroContainer}`}>
            <div className={styles.heroLayout}>
              <div className={styles.heroIntro}>
                <h2 className={styles.heroTitle}>Experience the Future of Water Purification</h2>
                <p className={styles.heroSubtitle}>
                  Request a free consultation and discover how HydroPros is revolutionizing hydration for modern
                  environments.
                </p>
                {heroSupport && (
                  <>
                    <div className={styles.heroTestPromo}>
                      <p className={styles.heroTestHeading}>
                        Schedule or Call Today for a Free 10-Minute Home Water Test – Plus Receive a Free Premium Drinking
                        Filter
                      </p>
                      {heroPromoShots.length > 0 && (
                        <div className={styles.heroTestGrid} role="presentation">
                          {heroPromoShots.map((shot) => (
                            <button
                              type="button"
                              key={shot.id}
                              className={styles.heroTestFrame}
                              onClick={() => openLightbox(shot.index)}
                              aria-label={`Open ${shot.label} image`}
                            >
                              <img src={shot.src} alt={shot.alt} loading="lazy" decoding="async" width="240" height="240" />
                            </button>
                          ))}
                        </div>
                      )}
                      <p className={styles.heroTestCopy}>
                        See the difference purity makes. Our certified HydroPros technicians provide fast, friendly water
                        tests and your free premium drinking filter, all in one simple visit.
                      </p>
                    </div>
                    <button
                      type="button"
                      className={styles.heroSupportButton}
                      onClick={() => openLightbox(heroSupportIndex)}
                      aria-label={`Open ${heroSupport.label} image`}
                    >
                      <img
                        src={heroSupport.src}
                        alt={heroSupport.alt}
                        loading="lazy"
                        decoding="async"
                        width="520"
                        height="420"
                        className={styles.heroSupportImage}
                      />
                    </button>
                  </>
                )}
                <ul className={styles.heroBullets}>
                  <li>Housewide protection beyond basic chlorine removal.</li>
                  <li>Florida-calibrated architecture that softens scale and safeguards fixtures.</li>
                  <li>Luxury-grade taste and feel flowing from every tap.</li>
                </ul>
              </div>
              <div className={styles.heroVisual}>
                <div className={styles.heroGrid}>
                  {heroUnitLeft && (
                    <div className={styles.leftCol}>
                      {/* FIX: Left column locked into the grid to remove overlap and keep image fully visible */}
                      <button
                        type="button"
                        className={styles.heroImageButton}
                        onClick={() => openLightbox(heroLeftIndex)}
                        aria-label={`Open ${heroUnitLeft.label} image`}
                      >
                        <img
                          src={heroUnitLeft.src}
                          alt="Whole-home water system (model 1)"
                          className={styles.unitImg}
                          loading="lazy"
                          decoding="async"
                          width="520"
                          height="520"
                        />
                      </button>
                      <p className={styles.unitCaption}>{heroUnitLeft.blurb}</p>
                    </div>
                  )}

                  <div id="consultation-form" className={styles.formCol}>
                    <div className={styles.heroForm}>
                      {/* FIX: Form stays centered column without any clipping or overflow */}
                      <UniversalForm formId="contact" />
                    </div>
                  </div>

                  {heroUnitRight && (
                    <div className={styles.rightCol}>
                      {/* FIX: Right column mirrors the left image for perfect symmetry */}
                      <button
                        type="button"
                        className={styles.heroImageButton}
                        onClick={() => openLightbox(heroRightIndex)}
                        aria-label={`Open ${heroUnitRight.label} image`}
                      >
                        <img
                          src={heroUnitRight.src}
                          alt="Whole-home water system (model 2)"
                          className={styles.unitImg}
                          loading="lazy"
                          decoding="async"
                          width="520"
                          height="520"
                        />
                      </button>
                      <p className={styles.unitCaption}>{heroUnitRight.blurb}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.showcaseSection}>
          <div className={styles.container}>
            <div className={styles.showcaseGrid}>
              {storyTiles.map((tile) => {
                const idx = getImageIndex(tile.imageId)
                const asset = galleryImages[idx]
                return (
                  <button
                    type="button"
                    key={tile.title}
                    className={styles.showcaseCard}
                    onClick={() => openLightbox(idx)}
                    aria-label={`Open ${tile.title} image`}
                  >
                    <div className={styles.showcaseImage}>
                      <img src={asset.src} alt={asset.alt} loading="lazy" decoding="async" width="480" height="360" />
                    </div>
                    <div>
                      <h4>{tile.title}</h4>
                      <p>{tile.copy}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        <section className={styles.highlights}>
          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>How HydroPros’ Whole-Home Purification Works</h3>
            <div className={styles.highlightGrid}>
              {insightCards.map((card) => (
                <article key={card.title}>
                  <h4>{card.title}</h4>
                  <p>{card.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Why HydroPros?</h3>
            <div className={styles.featuresGrid}>
              {[
                {
                  title: 'Intelligent Filtration',
                  text: 'Adapts to local water profiles for consistent purity.',
                },
                {
                  title: 'Sustainable Solution',
                  text: 'Cut plastic waste with a long-life, serviceable system.',
                },
                {
                  title: 'Unmatched Taste',
                  text: 'Crisp, clean water for cooking, coffee, and daily life.',
                },
                {
                  title: 'Peace of Mind',
                  text: 'Built-in monitoring and concierge service keep performance on track.',
                },
              ].map((card) => (
                <article key={card.title} className={styles.feature}>
                  <h4 className={styles.featureTitle}>{card.title}</h4>
                  <p className={styles.featureText}>{card.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.testimonials}>
          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Trusted by Industry Leaders</h3>
            <div className={styles.testimonial}>
              <blockquote>
                “HydroPros transformed the way our clients experience water. Taste, clarity, and trust — all elevated.”
              </blockquote>
              <cite>– Isabella Chen, Harborwell Hotels</cite>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {lightboxOpen && (
        <div
          className={styles.lightboxOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Product image viewer"
          onClick={closeLightbox}
        >
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.lightboxClose} aria-label="Close" onClick={closeLightbox}>
              ×
            </button>

            <button
              type="button"
              className={`${styles.lightboxArrow} ${styles.left}`}
              aria-label="Previous image"
              onClick={prevImage}
            >
              ‹
            </button>

            <img
              className={styles.lightboxImage}
              src={galleryImages[lightboxIndex].src}
              alt={galleryImages[lightboxIndex].alt}
              loading="lazy"
              decoding="async"
              width="1080"
              height="1350"
            />

            <button
              type="button"
              className={`${styles.lightboxArrow} ${styles.right}`}
              aria-label="Next image"
              onClick={nextImage}
            >
              ›
            </button>

            <div className={styles.lightboxCaption}>{galleryImages[lightboxIndex].label}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LandingPage
