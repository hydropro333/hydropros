import PropTypes from 'prop-types'
import styles from './InnovationShowcase.module.css'

function InnovationShowcase({ title, caption, items }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className="tagline">
          <span className="badge-dot" /> Systems
        </span>
        <h2>{title}</h2>
        <p>{caption}</p>
      </div>
      <div className={styles.tiles}>
        {items.map((item) => (
          <article key={item.title} className={styles.tile}>
            <div className={styles.icon} data-variant={item.icon} aria-hidden="true" />
            <div className={styles.tileHeader}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
            <ul className={styles.metrics}>
              {item.metrics.map((metric) => (
                <li key={metric}>{metric}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

InnovationShowcase.propTypes = {
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.string,
      metrics: PropTypes.arrayOf(PropTypes.string).isRequired,
    }),
  ).isRequired,
}

export default InnovationShowcase
