import PropTypes from 'prop-types'
import styles from './PartnerStrip.module.css'

function PartnerStrip({ items }) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {items.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  )
}

PartnerStrip.propTypes = {
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default PartnerStrip
