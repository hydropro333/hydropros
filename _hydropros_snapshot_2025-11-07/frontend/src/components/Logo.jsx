import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import styles from './Logo.module.css'
// CHANGED: We are now importing your new logo file
import brandPng from '../assets/hydropros-logo.jpg'

function Logo({ variant = 'combined', size = 'md' }) {
  // Use the provided JPG wordmark; keep structure for sizing consistency
  return (
    // CHANGED: This label is for screen readers, updated to "HydroPros"
    <Link className={`${styles.logo} ${styles[size]}`} to="/" aria-label="HydroPros home">
      <span className={styles.markWrapper}>
        {/* CHANGED: The alt text is for accessibility, updated to "HydroPros" */}
        <img src={brandPng} alt="HydroPros" className={styles.brandImage} />
      </span>
      {/* CHANGED: This text is for screen readers, updated to "HydroPros" */}
      {variant === 'combined' && <span className="sr-only">HydroPros</span>}
    </Link>
  )
}

Logo.propTypes = {
  variant: PropTypes.oneOf(['mark', 'wordmark', 'combined']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
}

export default Logo