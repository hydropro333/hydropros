import { useState } from 'react'
import styles from './Gallery.module.css'

import waterboy2 from '../assets/waterboy2.png'
import waterboy4 from '../assets/waterboy4.png'
import waterboy6 from '../assets/waterboy6.png'
import waterboy7 from '../assets/waterboy7.png'
import waterboy9 from '../assets/waterboy9.png'
import waterboy10 from '../assets/waterboy10.png'
import waterboy11 from '../assets/waterboy11.png'
import waterboy12 from '../assets/waterboy12.png'
import waterboy13 from '../assets/waterboy13.png'
import waterboy14 from '../assets/waterboy14.png'
import waterboy15 from '../assets/waterboy15.png'
import waterboy16 from '../assets/waterboy16.png'
import waterboy17 from '../assets/waterboy17.png'
import waterboy18 from '../assets/waterboy18.png'

const galleryItems = [
  { src: waterboy2, caption: 'Whole-home system installation — Newport Richey, FL' },
  { src: waterboy4, caption: 'Water softener upgrade — Port Richey, FL' },
  { src: waterboy6, caption: 'Filtration system setup — Hudson, FL' },
  { src: waterboy7, caption: 'Complete water treatment — Newport Richey, FL' },
  { src: waterboy9, caption: 'Residential installation — Palm Harbor, FL' },
  { src: waterboy10, caption: 'Well water system — Port Richey, FL' },
  { src: waterboy11, caption: 'Multi-stage filtration — Hudson, FL' },
  { src: waterboy12, caption: 'Water quality solution — Newport Richey, FL' },
  { src: waterboy13, caption: 'Home filtration system — Clearwater, FL' },
  { src: waterboy14, caption: 'Softener and filter combo — Port Richey, FL' },
  { src: waterboy15, caption: 'New construction install — Tampa, FL' },
  { src: waterboy16, caption: 'System replacement — Newport Richey, FL' },
  { src: waterboy17, caption: 'Whole-home solution — Hudson, FL' },
  { src: waterboy18, caption: 'Premium water system — Dunedin, FL' },
]

function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const openLightbox = (index) => {
    setActiveIndex(index)
    setLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    document.body.style.overflow = ''
  }

  const goNext = (e) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev + 1) % galleryItems.length)
  }

  const goPrev = (e) => {
    e.stopPropagation()
    setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowRight') setActiveIndex((prev) => (prev + 1) % galleryItems.length)
    if (e.key === 'ArrowLeft') setActiveIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className="container">
          <span className="tagline">
            <span className="badge-dot" /> Our Work
          </span>
          <h1>Installation Gallery</h1>
          <p>
            Browse our recent installations across the Tampa Bay area. Each system is custom-designed
            for the home's specific water conditions and family needs.
          </p>
        </div>
      </section>

      <section className={styles.gallerySection}>
        <div className="container">
          <div className={styles.grid}>
            {galleryItems.map((item, index) => (
              <button
                key={index}
                className={styles.gridItem}
                onClick={() => openLightbox(index)}
                aria-label={`View ${item.caption}`}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  decoding="async"
                />
                <div className={styles.overlay}>
                  <span className={styles.caption}>{item.caption}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2>Ready to Transform Your Water?</h2>
            <p>
              Join hundreds of satisfied homeowners across the Tampa Bay area.
              Schedule your free water test today.
            </p>
            <a href="/service" className="btn btn-primary">
              Request a Consultation
            </a>
          </div>
        </div>
      </section>

      {lightboxOpen && (
        <div
          className={styles.lightbox}
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            className={styles.closeBtn}
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            &times;
          </button>

          <button
            className={`${styles.navBtn} ${styles.prevBtn}`}
            onClick={goPrev}
            aria-label="Previous image"
          >
            &#8249;
          </button>

          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryItems[activeIndex].src}
              alt={galleryItems[activeIndex].caption}
            />
            <p className={styles.lightboxCaption}>
              {galleryItems[activeIndex].caption}
            </p>
            <p className={styles.lightboxCounter}>
              {activeIndex + 1} / {galleryItems.length}
            </p>
          </div>

          <button
            className={`${styles.navBtn} ${styles.nextBtn}`}
            onClick={goNext}
            aria-label="Next image"
          >
            &#8250;
          </button>
        </div>
      )}
    </div>
  )
}

export default Gallery
