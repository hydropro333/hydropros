import styles from './HeroLeadForm.module.css'

function HeroLeadForm() {
  return (
    <form className={styles.form} id="home-hero-form" autoComplete="on">
      <div className={styles.header}>
        <h3>Design My Water System</h3>
        <p>Share a few details to receive a tailored purity blueprint within 48 hours.</p>
      </div>
      <div className={styles.grid}>
        <div className="form-field">
          <label htmlFor="h-name">Full name</label>
          <input
            id="h-name"
            name="name"
            type="text"
            placeholder="Alex Rivera"
            autoComplete="name"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="h-email">Email</label>
          <input
            id="h-email"
            name="email"
            type="email"
            placeholder="you@company.com"
            autoComplete="email"
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="h-location">Location</label>
          <input
            id="h-location"
            name="location"
            type="text"
            placeholder="City, country"
            autoComplete="address-level2"
          />
        </div>
        <div className="form-field">
          <label htmlFor="h-volume">Daily water demand</label>
          <select id="h-volume" name="volume" defaultValue="">
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
        <label htmlFor="h-notes">What are you optimizing for?</label>
        <textarea
          id="h-notes"
          name="notes"
          placeholder="Taste, wellness, sustainability or guest experience — tell us what matters."
        />
      </div>
      <input
        type="text"
        name="companyWebsite"
        className="sr-only"
        tabIndex="-1"
        autoComplete="off"
      />
      <button type="submit" className="btn btn-primary">
        Request My Blueprint
      </button>
    </form>
  )
}

export default HeroLeadForm
