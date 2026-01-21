import PropTypes from 'prop-types';
import styles from './UniversalForm.module.css';

function UniversalForm({ formId }) {
  return (
    <div className={styles.wrapper} id={formId}>
      <div className={styles.header}>
        <h3>Request a Consultation</h3>
        <p>
          Fill out the form to schedule your appointment, or call us directly.
        </p>
      </div>

      <div className={styles.callOption}>
        <span>Or Call Us Now For Immediate Assistance:</span>
        <a href="tel:850-912-9097" className={styles.phoneLink}>
          850-912-9097
        </a>
      </div>

      <form className={styles.form}>
        <div className={styles.formGrid}>
          <div className="form-field">
            <label htmlFor="universal-name">Full Name</label>
            <input id="universal-name" name="name" type="text" placeholder="John Doe" required />
          </div>
          <div className="form-field">
            <label htmlFor="universal-phone">Phone Number</label>
            <input id="universal-phone" name="phone" type="tel" placeholder="(555) 123-4567" required />
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="universal-email">Email Address</label>
          <input id="universal-email" name="email" type="email" placeholder="you@company.com" required />
        </div>

        <div className="form-field">
          <label htmlFor="universal-address">Service Address</label>
          <input id="universal-address" name="address" type="text" placeholder="123 Main St, City, State" required />
        </div>

        <div className={styles.formGrid}>
            <div className="form-field">
                <label htmlFor="universal-reason">Reason for Inquiry</label>
                <select id="universal-reason" name="reason" required defaultValue="">
                    <option value="" disabled>Select a reason...</option>
                    <option value="New Installation">New Installation</option>
                    <option value="Free Water Test">Request A Free Water Test</option>
                    <option value="Phone Consultation">Phone Consultation</option>
                    <option value="Service Existing System">Service Existing System</option>
                </select>
            </div>
            <div className="form-field">
                <label htmlFor="universal-date">Requested Date</label>
                <input id="universal-date" name="date" type="date" required />
            </div>
        </div>

        <div className={styles.permission}>
          <input id="universal-permission" name="permission" type="checkbox" required />
          {/* CHANGED: Text updated to "HydroPros" */}
          <label htmlFor="universal-permission">
            I grant HydroPros permission to contact me regarding this inquiry.
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Schedule My Appointment
        </button>
      </form>
    </div>
  );
}

UniversalForm.propTypes = {
  formId: PropTypes.string,
};

UniversalForm.defaultProps = {
  formId: null,
};

export default UniversalForm;