import { useEffect, useMemo, useState } from "react";
import styles from "./LandingPage.module.css";
import UniversalForm from "../components/UniversalForm.jsx";
import LandingHeader from "../components/LandingHeader.jsx";

// Product images you provided
import systemA from "../assets/hydrosystem2.png";
import systemB from "../assets/hydrpsystem3.png";

// Top banner image (water ribbon across the very top)
import waterBanner from "../assets/water.png";

// Full-page background image
import pageBackground from "../assets/background.png";

function LandingPage() {
  // lightboxOpen (tracks if the overlay is visible)
  const [lightboxOpen, setLightboxOpen] = useState(false);
  // lightboxIndex (which image is shown: 0 or 1)
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // images (list with src, alt, label, description)
  const images = useMemo(
    () => [
      {
        src: systemA,
        alt: "HydroPros whole-home water system, Finish A",
        label: "System Finish A",
        blurb:
          "Whole-home purification engineered for Florida homes. Finish A blends with bright, coastal interiors.",
      },
      {
        src: systemB,
        alt: "HydroPros whole-home water system, Finish B",
        label: "System Finish B",
        blurb:
          "Same performance. Different aesthetic. Finish B delivers a bold, premium presence.",
      },
    ],
    []
  );

  // Open the lightbox at a given index
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // Close the lightbox
  const closeLightbox = () => setLightboxOpen(false);

  // Previous and next image controls
  const prevImage = () => {
    setLightboxIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };
  const nextImage = () => {
    setLightboxIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  // Keyboard support (Escape closes; Left/Right navigate)
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen]);

  return (
    // Page background image behind everything
    <div
      className={styles.page}
      style={{
        background: `url(${pageBackground}) center top / cover no-repeat fixed`,
      }}
    >
      {/* === Very Top Water Banner ===
          We now place <LandingHeader /> INSIDE this section so the water image
          appears behind the header instead of a white strip. */}
      <section
        className={styles.topBanner}
        style={{ backgroundImage: `url(${waterBanner})` }}
        aria-label="Water banner"
      >
        <div className={styles.container}>
          <div className={styles.topBannerRow}>
            <div className={styles.topBannerText}>
              Advanced Whole-Home Filtration • Softer Water • Cleaner Taste • Professional Installation
            </div>
          </div>
        </div>

        {/* Header is rendered inside the banner and forced transparent by CSS */}
        <div className={styles.headerDock}>
          <LandingHeader />
        </div>
      </section>

      {/* === Bold 3-D Brand Header === */}
      <section className={styles.brandBanner} aria-label="HydroPros brand">
        <div className={styles.container}>
          <div className={styles.brandInner}>
            <h1 className={styles.brandMark}>
              <span className={styles.brandMarkFront}>HydroPros</span>
              <span className={styles.brandMarkBack} aria-hidden="true">
                HydroPros
              </span>
            </h1>
            <div className={styles.brandSlogan}>
              <span>Healthy Water.</span> <span>Healthy Life.</span>
            </div>
          </div>
        </div>
      </section>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.container}>
            <div className={styles.heroContent}>
              <h2 className={styles.heroTitle}>
                Experience the Future of Water Purification
              </h2>
              <p className={styles.heroSubtitle}>
                Request a free consultation and discover how HydroPros is
                revolutionizing hydration for modern environments.
              </p>

              {/* Media row: image card, form, image card */}
              <div className={styles.mediaRow}>
                {/* Left product card */}
                <button
                  type="button"
                  className={styles.productCard}
                  onClick={() => openLightbox(0)}
                  aria-label="Open System Finish A image"
                >
                  <div className={styles.productImageWrap}>
                    <img
                      className={styles.productImg}
                      src={images[0].src}
                      alt={images[0].alt}
                    />
                  </div>
                  <div className={styles.productMeta}>
                    <div className={styles.productTitle}>{images[0].label}</div>
                    <p className={styles.productBlurb}>{images[0].blurb}</p>
                    <div className={styles.productStyles}>
                      Available styles: Light Metallic, Deep Graphite
                    </div>
                  </div>
                </button>

                {/* Form */}
                <div className={styles.heroForm}>
                  <UniversalForm formId="contact" />
                </div>

                {/* Right product card */}
                <button
                  type="button"
                  className={styles.productCard}
                  onClick={() => openLightbox(1)}
                  aria-label="Open System Finish B image"
                >
                  <div className={styles.productImageWrap}>
                    <img
                      className={styles.productImg}
                      src={images[1].src}
                      alt={images[1].alt}
                    />
                  </div>
                  <div className={styles.productMeta}>
                    <div className={styles.productTitle}>{images[1].label}</div>
                    <p className={styles.productBlurb}>{images[1].blurb}</p>
                    <div className={styles.productStyles}>
                      Available styles: Light Metallic, Deep Graphite
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.features}>
          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Why HydroPros?</h3>
            <div className={styles.featuresGrid}>
              <div className={styles.feature}>
                <h4>Intelligent Filtration</h4>
                <p>Adapts to local water profiles for consistent purity.</p>
              </div>
              <div className={styles.feature}>
                <h4>Sustainable Solution</h4>
                <p>Cut plastic waste with a long-life, serviceable system.</p>
              </div>
              <div className={styles.feature}>
                <h4>Unmatched Taste</h4>
                <p>Crisp, clean water for cooking, coffee, and daily life.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.testimonials}>
          <div className={styles.container}>
            <h3 className={styles.sectionTitle}>Trusted by Industry Leaders</h3>
            <div className={styles.testimonial}>
              <blockquote>
                "HydroPros transformed the way our clients experience water.
                Taste, clarity, and trust — all elevated."
              </blockquote>
              <cite>– Isabella Chen, Harborwell Hotels</cite>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={`${styles.container} ${styles.footerInner}`}>
          <p>&copy; {new Date().getFullYear()} HydroPros. All rights reserved.</p>
          <p>
            <a href="#" className={styles.footerLink}>
              Privacy Policy
            </a>
          </p>
        </div>
      </footer>

      {/* Lightbox overlay */}
      {lightboxOpen && (
        <div
          className={styles.lightboxOverlay}
          role="dialog"
          aria-modal="true"
          aria-label="Product image viewer"
          onClick={closeLightbox}
        >
          <div
            className={styles.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.lightboxClose}
              aria-label="Close"
              onClick={closeLightbox}
            >
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

            {/* Show the entire system image without cropping */}
            <img
              className={styles.lightboxImage}
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
            />

            <button
              type="button"
              className={`${styles.lightboxArrow} ${styles.right}`}
              aria-label="Next image"
              onClick={nextImage}
            >
              ›
            </button>

            <div className={styles.lightboxCaption}>
              {images[lightboxIndex].label}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
