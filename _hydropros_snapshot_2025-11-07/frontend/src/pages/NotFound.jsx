import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

function NotFound() {
  return (
    <section className={styles.wrapper}>
      <div className="gradient-card">
        <span className="tagline">We filtered everything</span>
        <h1>We couldn’t find that page</h1>
        <p>
          Our navigation matrix is crystal clear, but the link you followed is
          a little murky. Let’s guide you back to the source.
        </p>
        <div className={styles.actions}>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link to="/service" className="btn btn-secondary">
            Explore Service
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NotFound
