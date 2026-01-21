import styles from './CallToAction.module.css'

function CallToAction() {
  return (
    <section className={styles.section} id="download">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className="tagline">
            <span className="badge-dot" /> Next step
          </span>
          <h2>Download the purity architecture playbook</h2>
          <p>
            Explore schematics, sensor maps, and commissioning checklists that
            {/* CHANGED: Text updated to "HydroPros" */}
            reveal how HydroPros orchestrates premium water experiences for
            modern environments.
          </p>
        </div>
        <div className={styles.actions}>
          <a className="btn btn-primary" href="/sales">
            View Systems
          </a>
          <a className="btn btn-secondary" href="#consultation">
            Schedule Demo
          </a>
        </div>
      </div>
    </section>
  )
}

export default CallToAction