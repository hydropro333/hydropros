import PropTypes from 'prop-types'
import styles from './PageHero.module.css'

function PageHero({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  stats,
  rightSlot,
  heroImage,
  tone,
}) {
  const isDark = tone === 'dark'

  return (
    <section className={`${styles.hero} ${isDark ? styles.heroDark : ''}`}>
      <div
        className={`${styles.backdrop} ${isDark ? styles.backdropDark : ''}`}
        aria-hidden="true"
      />
      <div className={styles.inner}>
        <div className={styles.copy}>
          {eyebrow && (
            <span className="tagline">
              <span className="badge-dot" />
              {eyebrow}
            </span>
          )}
          <h1>{title}</h1>
          <p>{description}</p>
          <div className={styles.actions}>
            {primaryAction && (
              <a className="btn btn-primary" href={primaryAction.href}>
                {primaryAction.label}
              </a>
            )}
            {secondaryAction && (
              <a className="btn btn-secondary" href={secondaryAction.href}>
                {secondaryAction.label}
              </a>
            )}
          </div>
          {stats?.length > 0 && (
            <dl className={styles.stats}>
              {stats.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {heroImage && (
            <figure className={styles.supportImage}>
              <img src={heroImage.src} alt={heroImage.alt} loading="lazy" decoding="async" />
              {heroImage.caption && <figcaption>{heroImage.caption}</figcaption>}
            </figure>
          )}
        </div>
        <div className={styles.visual}>
          {rightSlot ? (
            <div>{rightSlot}</div>
          ) : (
            <div className={styles.visualCard}>
              <div className={styles.dropGlow} />
              <div className={styles.droplet}>
                <div className={styles.innerDroplet} />
              </div>
              <div className={styles.visualSummary}>
                <p className={styles.visualTitle}>Signature Purity Mix</p>
                <ul>
                  <li>Structured hydration cascade</li>
                  <li>Trace mineral harmonics</li>
                  <li>Smart remineralization pulse</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

PageHero.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  primaryAction: PropTypes.shape({
    href: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  secondaryAction: PropTypes.shape({
    href: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    }),
  ),
  rightSlot: PropTypes.node,
  heroImage: PropTypes.shape({
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    caption: PropTypes.string,
  }),
  tone: PropTypes.oneOf(['light', 'dark']),
}

PageHero.defaultProps = {
  eyebrow: undefined,
  primaryAction: undefined,
  secondaryAction: undefined,
  stats: undefined,
  rightSlot: undefined,
  heroImage: undefined,
  tone: 'light',
}

export default PageHero
