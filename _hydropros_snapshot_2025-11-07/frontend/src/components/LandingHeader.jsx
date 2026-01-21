import React from 'react';
import Logo from './Logo.jsx';
import styles from './LandingHeader.module.css';

function LandingHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Logo size="md" />
        <div className={styles.contact}>
          <span>Call For a Free Consultation:</span>
          <a href="tel:850-912-9097">850-912-9097</a>
        </div>
      </div>
    </header>
  );
}

export default LandingHeader;