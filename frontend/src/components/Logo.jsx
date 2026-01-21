import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styles from './Logo.module.css'
import brandPng from '../assets/main logo.png'

// TODO: REPLACE THIS WITH CLEAN LOGO FILENAME once a trimmed transparent PNG is available.

function Logo({ variant = 'combined', size = 'md' }) {
  const isPrimary = size === 'md'
  return (
    <Link className={`${styles.logo} ${styles[size]}`} to="/" aria-label="HydroPros home">
      <span className={styles.markWrapper}>
        {/* alt text describes the image for accessibility */}
        <img
          src={brandPng}
          alt="HydroPros"
          className={styles.brandImage}
          width="420"
          height="150"
          decoding="async"
          loading={isPrimary ? 'eager' : 'lazy'}
        />
      </span>
      {variant === 'combined' && <span className="sr-only">HydroPros</span>}
    </Link>
  )
}

Logo.propTypes = {
  variant: PropTypes.oneOf(['mark', 'wordmark', 'combined']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
}

export default Logo
