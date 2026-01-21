import styles from './ContactForm.module.css'

function ContactForm() {
  return (
    <section id="contact" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <span className="tagline">
            <span className="badge-dot" /> Consultation
          </span>
          <h2>Engineer your next water breakthrough</h2>
          <p>
            Our hydro engineers craft turnkey hydration ecosystems that align with
            architectural, wellness, and sustainability mandates. Tell us about
            your environment and we will design a purity blueprint within 48 hours.
          </p>
          <div className={styles.assurance}>
            <div>
              <strong>Response time:</strong> within 1 business day
            </div>
            <div>
              <strong>Locations:</strong> North America, EU, APAC
            </div>
          </div>
        </div>
        <form className={`${styles.form} gradient-card`} id="consultation" autoComplete="on">
          <div className={styles.formGrid}>
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" type="text" placeholder="Jordan Steele" required />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="you@company.com" required />
            </div>
            <div className="form-field">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" placeholder="Company or venue" />
            </div>
            <div className="form-field">
              <label htmlFor="volume">Daily water demand</label>
              <select id="volume" name="volume" defaultValue="">
                <option value="" disabled>
                  Select range
                </option>
                <option value="up-to-500">Up to 500 gallons</option>
                <option value="500-2000">500 – 2,000 gallons</option>
                <option value="2000-5000">2,000 – 5,000 gallons</option>
                <option value="5000-plus">5,000+ gallons</option>
              </select>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="goals">Performance priorities</label>
            <textarea
              id="goals"
              name="goals"
              placeholder="Tell us about your quality, sustainability, or experience initiatives."
            />
          </div>
          <div className={styles.checkboxRow}>
            <label htmlFor="partner" className={styles.checkboxLabel}>
              <input id="partner" type="checkbox" name="partner" />
              <span>
                Send partner program details and quarterly innovation updates.
              </span>
            </label>
          </div>
          <button type="submit" className="btn btn-primary">
            Request Water Blueprint
          </button>
        </form>
      </div>
    </section>
  )
}

export default ContactForm
