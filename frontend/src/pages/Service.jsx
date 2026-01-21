import PageHero from '../components/PageHero.jsx'
import UniversalForm from '../components/UniversalForm.jsx'
import systemImage from '../assets/hydrosystem1.png'
import styles from './Service.module.css'

const installSteps = [
  {
    title: 'Evaluation & water testing',
    copy: 'We inspect your plumbing, test your water, and confirm pressure so we know exactly what your system needs to correct.',
  },
  {
    title: 'System recommendation',
    copy: 'You receive a clear proposal outlining the right combination of whole-home treatment, pumps, and drinking-water solutions for your home.',
  },
  {
    title: 'Professional installation',
    copy: 'Technicians set tanks, pumps, and controls, make clean tie-ins, and bring your new equipment online with care.',
  },
  {
    title: 'Verification & education',
    copy: 'After startup we re-test the water, confirm operation, and walk you through how to get the most from your system.',
  },
]

const maintenanceOptions = [
  {
    title: 'Whole-home filtration & softening',
    copy: 'We offer tune-ups that include media inspection, valve checks, and basic water testing so your system keeps up with Florida demand.',
  },
  {
    title: 'Well pump & pressure systems',
    copy: 'Service options cover pump performance checks, pressure-tank inspections, and troubleshooting for low-flow or short-cycling wells.',
  },
  {
    title: 'Drinking water systems',
    copy: 'From RO filter changes to UV lamp swaps, we keep point-of-use systems producing clean, great-tasting water.',
  },
]

const supportChannels = [
  {
    title: 'Phone',
    copy: 'Call 954-404-2312 to schedule routine maintenance, ask questions, or request urgent support. Most messages are returned within one business day.',
  },
  {
    title: 'Email',
    copy: 'Send photos and details to info@floridahydropros.com so we can review your setup and recommend the right next step.',
  },
  {
    title: 'On-site service',
    copy: 'When remote help is not enough, we dispatch technicians for repairs, upgrades, and full system evaluations.',
  },
]

function Service() {
  return (
    <div className={styles.page}>
      <PageHero
        eyebrow="Service"
        title="Professional Installation and Ongoing Care"
        description="From the first site check to long-term maintenance, our team keeps your whole-home processor and optional RO system performing for Florida conditions."
        tone="dark"
        primaryAction={{ href: '/#contact', label: 'Request service' }}
        secondaryAction={{ href: '/sales', label: 'Review systems' }}
        stats={[
          { label: 'Install steps', value: '3-part process' },
          { label: 'Filter cadence', value: 'As needed' },
          { label: 'Support window', value: '1 business day' },
        ]}
        heroImage={{
          src: systemImage,
          alt: 'Whole-home filtration system canister and tank',
          caption: 'Whole-Home Filtration (10-stage)',
        }}
        rightSlot={<UniversalForm formId="service-contact" />}
      />

      <section className={styles.section}>
        <div className="container">
          <h2>Installation process</h2>
          <ol className={styles.steps}>
            {installSteps.map((step, index) => (
              <li key={step.title}>
                <span>{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2>Maintenance options</h2>
          <div className={styles.cards}>
            {maintenanceOptions.map((item) => (
              <article key={item.title} className={styles.card}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2>Support</h2>
          <div className={styles.cards}>
            {supportChannels.map((item) => (
              <article key={item.title} className={styles.card}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container gradient-card ${styles.finalCta}`}>
          <div>
            <h2>Need service?</h2>
            <p>
              Tell us what you need checked, and we&apos;ll coordinate a visit or remote guidance.
            </p>
          </div>
          <a className="btn btn-primary" href="/#contact">
            Request service
          </a>
        </div>
      </section>
    </div>
  )
}

export default Service
