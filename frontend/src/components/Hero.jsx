import PropTypes from 'prop-types'
import styles from './Hero.module.css'
import waterBg from '../assets/water.png'

function Hero({ eyebrow, title, description, cta }) {
  return (
    <section className={styles.hero}>
      <div
        className={styles.backdrop}
        style={{ backgroundImage: `url(${waterBg})` }}
        aria-hidden="true"
      />
      <div className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          {eyebrow && (
            <span className="tagline">
              <span className="badge-dot" />
              {eyebrow}
            </span>
          )}
          <h1>{title}</h1>
          <p>{description}</p>
          {cta && (
            <a className="btn btn-primary" href={cta.href}>
              {cta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

Hero.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cta: PropTypes.shape({
    href: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }),
}

Hero.defaultProps = {
  eyebrow: undefined,
  cta: null,
}

export default Hero
