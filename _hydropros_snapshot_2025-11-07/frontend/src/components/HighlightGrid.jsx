import PropTypes from 'prop-types'
import styles from './HighlightGrid.module.css'

function HighlightGrid({ items }) {
  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {items.map((item) => (
          <article key={item.title} className={styles.card}>
            <div className={styles.metric}>{item.metric}</div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

HighlightGrid.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      metric: PropTypes.string,
    }),
  ).isRequired,
}

export default HighlightGrid