import PropTypes from 'prop-types'
import styles from './Testimonials.module.css'

function Testimonials({ title, description, items }) {
  return (
    <section id="stories" className={styles.section}>
      <div className={styles.heading}>
        <span className="tagline">
          <span className="badge-dot" /> Proven Trust
        </span>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <div className={styles.carousel}>
        {items.map((item) => (
          <figure key={item.name} className={styles.card}>
            <blockquote>“{item.quote}”</blockquote>
            <figcaption>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

Testimonials.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      quote: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default Testimonials
