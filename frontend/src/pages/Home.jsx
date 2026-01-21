import { Link } from 'react-router-dom'
import UniversalForm from '../components/UniversalForm.jsx'
import systemImage from '../assets/hydrosystem1.png'
import styles from './Home.module.css'

const floridaHighlights = [
  {
    title: 'Whole-home filtration & softening',
    copy: 'Custom-built systems for Florida city and well water remove grit, chlorine, and hardness minerals so every tap runs clear and consistent.',
  },
  {
    title: 'Well pump installation & repair',
    copy: 'From low pressure to no water, we size, install, and service pumps and pressure tanks so your well keeps up with daily demand.',
  },
  {
    title: 'Drinking water systems',
    copy: 'Point-of-use reverse osmosis and under-sink filtration deliver bottled-water taste at the kitchen, bar, or fridge line without the plastic waste.',
  },
]

const howItWorks = [
  {
    title: 'Evaluate & test',
    copy: 'We start with a Florida-focused water test and pressure check so you can see exactly what is coming from your city or well supply.',
  },
  {
    title: 'Design your solution',
    copy: 'You receive a clear plan that pairs whole-home filtration, softening, and drinking-water options with your home size and water test results.',
  },
  {
    title: 'Install & verify',
    copy: 'Licensed crews set the equipment, dial in pumps and pressure, and confirm treated water at key fixtures before we consider the job complete.',
  },
]

const roBenefits = [
  'Multi-stage reverse osmosis reduces dissolved solids and many problem tastes while polishing every glass of water.',
  'Compact under-sink or in-cabinet footprint feeds a dedicated faucet, fridge, or ice maker without taking over the kitchen.',
  'Simple upkeep with periodic filter and membrane changes keeps flow and flavor where they should be.',
]

const trustSignals = [
  {
    title: 'Built for Florida water',
    copy: 'Systems are designed around local hardness, iron, sulfur, and chlorine profiles—whether you are on city lines or a private well.',
  },
  {
    title: 'Licensed, careful installation',
    copy: 'Work is completed by insured crews who protect your home, respect your time, and leave the job site clean.',
  },
  {
    title: 'Ongoing testing & support',
    copy: 'Florida Hydro Pros offers follow-up testing, tune-ups, and service plans so your water stays consistent long after install day.',
  },
]

function Home() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className="tagline">
              <span className="badge-dot" /> Florida homes
            </span>
            <h1>Whole-Home Water Filtration for Florida Homes</h1>
            <p>
              Give your home the kind of water it was meant to have—clean, reliable, and consistent
              from the street or well all the way to the last bathroom. Florida Hydro Pros treats
              city and well water so it looks, tastes, and feels better at every tap.
            </p>
            <ul className={styles.heroPoints}>
              <li>Whole-home solution, not just a softener</li>
              <li>Optional reverse osmosis faucet for the kitchen</li>
              <li>Low-maintenance design with long media life</li>
            </ul>
            <Link to="/service#consultation-form" className="btn btn-primary">
              Contact
            </Link>
            <figure className={styles.heroImage}>
              <img
                src={systemImage}
                alt="Whole-home filtration system canister and tank"
                loading="lazy"
                decoding="async"
                width="320"
                height="420"
              />
              <figcaption>Whole-Home Filtration (10-stage)</figcaption>
            </figure>
          </div>
          <div className={styles.formShell}>
            <UniversalForm formId="contact" />
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionSoft}`}>
        <div className="container">
          <h2>Why it matters in Florida</h2>
          <div className={styles.cards}>
            {floridaHighlights.map((item) => (
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
          <h2>How it works</h2>
          <ol className={styles.steps}>
            {howItWorks.map((step, index) => (
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
        <div className={`container ${styles.drinkingUpgrade}`}>
          <div>
            <span className="tagline">
              <span className="badge-dot" /> Drinking upgrade
            </span>
            <h2>Reverse osmosis for everyday drinking</h2>
            <p>
              The point-of-entry processor handles the entire house. Reverse osmosis focuses on the
              glass in your hand, polishing water with a semi-permeable membrane and dedicated
              faucet.
            </p>
            <ul>
              {roBenefits.map((benefit) => (
                <li key={benefit}>{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionSoft}`}>
        <div className="container">
          <h2>Trust signals</h2>
          <div className={styles.cards}>
            {trustSignals.map((item) => (
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
            <h2>Ready for balanced water at every tap?</h2>
            <p>
              Share your address and goals. We&apos;ll test, size the equipment, and plan
              installation together.
            </p>
          </div>
          <Link to="/service#consultation-form" className="btn btn-primary">
            Contact
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
