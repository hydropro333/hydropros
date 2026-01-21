import PropTypes from 'prop-types'
import styles from './ProcessTimeline.module.css'

function ProcessTimeline({ title, caption, steps }) {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <span className="tagline">
          <span className="badge-dot" /> Deployment
        </span>
        <h2>{title}</h2>
        <p>{caption}</p>
      </div>
      <ol className={styles.timeline}>
        {steps.map((step, index) => (
          <li key={step.title}>
            <span className={styles.stepNumber}>{index + 1}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

ProcessTimeline.propTypes = {
  title: PropTypes.string.isRequired,
  caption: PropTypes.string.isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

export default ProcessTimeline
