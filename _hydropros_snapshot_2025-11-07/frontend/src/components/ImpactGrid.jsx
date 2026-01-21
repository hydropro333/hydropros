import PropTypes from 'prop-types'
import styles from './ImpactGrid.module.css'

function ImpactGrid({ title, copy, items }) {
  return (
    <section id="impact" className={styles.section}>
      <div className={styles.header}>
        <span className="tagline">
          <span className="badge-dot" /> Impact
        </span>
        <h2>{title}</h2>
        <p>{copy}</p>
      </div>
      <div className={styles.grid}>
        {items.map((item) => (
          <article key={item.title} className={styles.card}>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

ImpactGrid.propTypes = {
  title: PropTypes.string.isRequired,
  copy: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      body: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default ImpactGrid
