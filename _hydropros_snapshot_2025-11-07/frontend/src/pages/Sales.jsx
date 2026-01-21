import PageHero from '../components/PageHero.jsx'
import UniversalForm from '../components/UniversalForm.jsx'
import ProcessTimeline from '../components/ProcessTimeline.jsx'
import styles from './Service.module.css'

const servicePrograms = [
  {
    title: 'Signature Care',
    description:
      'Dedicated hydro-engineer, quarterly optimization visits, and proactive consumables replacement.',
    highlights: ['Quarterly recalibration', 'Hydro analytics reports', 'Priority support desk'],
  },
  {
    title: 'Everpure Assurance',
    description:
      'Continuous monitoring, 2-hour response SLAs, and compliance documentation for regulated environments.',
    highlights: ['24/7 monitoring', '2-hour response', 'Regulatory compliance kits'],
  },
  {
    title: 'Co-create Lab',
    description:
      'Partner with our R&D team to design custom hydration experiences for flagship destinations.',
    highlights: ['R&D collaboration', 'Prototype deployment', 'Executive workshops'],
  },
]

const serviceMetrics = [
  { label: 'Sensors reporting every', value: '12 sec' },
  { label: 'Client satisfaction score', value: '98%' },
  { label: 'Global service hubs', value: '27' },
]

const stats = [
  { label: 'Service network', value: '27 hubs' },
  { label: 'Median response', value: '62 minutes' },
  { label: 'Sensor diagnostics', value: '24/7/365' },
]

const diagnostics = [
  {
    title: 'Real-time anomaly detection',
    description:
      'Edge AI monitors over 40 parameters — from turbidity to dissolved oxygen — alerting our command center before guests notice changes.',
  },
  {
    title: 'Wellness compliance',
    description:
      'Generate spa, hospitality, and municipal compliance reports at the push of a button with auditable sensor histories.',
  },
  {
    title: 'Experience choreography',
    description:
      'Update remineralization profiles, temperature cues, and lighting scenes remotely to align with seasonal menus or events.',
  },
]

const timeline = [
  {
    title: 'Baseline calibration',
    description:
      'We benchmark purity metrics, guest experience feedback, and operational flows to lock in your water signature.',
  },
  {
    title: 'Predictive maintenance',
    description:
      'Our cloud continuously schedules filter exchanges, sanitization, and micro-adjustments based on live analytics.',
  },
  {
    title: 'Impact storytelling',
    description:
      'Receive curated dashboards and ready-to-share visuals that showcase savings, sustainability, and guest delight.',
  },
]

function Service() {
  return (
    <div className={styles.page}>
      <PageHero
        eyebrow="Service Collective"
        title={'White-glove stewardship for flawless water experiences'}
        // CHANGED: Description updated to "HydroPros"
        description="Our global service network preserves your HydroPros installation with predictive intelligence, sensory recalibrations, and rapid on-site support."
        primaryAction={{ href: '#contact', label: 'Enroll in Service' }}
        secondaryAction={{ href: '#programs', label: 'Explore Programs' }}
        stats={stats}
        rightSlot={<UniversalForm formId="contact" />}
      />
      <section className={styles.metrics}>
        {serviceMetrics.map((metric) => (
          <article key={metric.label}>
            <h3>{metric.value}</h3>
            <p>{metric.label}</p>
          </article>
        ))}
      </section>
      <section className={styles.programs} id="programs">
        {servicePrograms.map((program) => (
          <article key={program.title} className={styles.programCard}>
            <h3>{program.title}</h3>
            <p>{program.description}</p>
            <ul>
              {program.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
      <section className={styles.diagnostics}>
        <div className={styles.diagnosticsCopy}>
          <span className="tagline">
            <span className="badge-dot" /> Diagnostics
          </span>
          <h2>Command center monitoring</h2>
          <p>
            {/* CHANGED: Text updated to "HydroPros'" */}
            HydroPros' network operations center pairs live sensor diagnostics with
            human connoisseurs who taste-test and calibrate every system remotely.
          </p>
        </div>
        <div className={styles.diagnosticsGrid}>
          {diagnostics.map((item) => (
            <article key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>
      <ProcessTimeline
        title="Your service journey"
        caption="Our hydro concierge team stays with you from day one, turning maintenance into a signature brand ritual."
        steps={timeline}
      />
    </div>
  )
}

export default Service