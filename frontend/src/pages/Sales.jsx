import PageHero from '../components/PageHero.jsx'
import UniversalForm from '../components/UniversalForm.jsx'
import systemImage from '../assets/hydrosystem1.png'
import styles from './Sales.module.css'

const includedItems = [
  {
    title: 'Custom system design',
    copy: 'We begin with a water test and home review, then size filtration, softening, and pump components so your system fits your plumbing and usage—not the other way around.',
  },
  {
    title: 'Whole-home filtration & softening',
    copy: 'Multi-stage equipment strips out sediment, chlorine, and hardness minerals before they reach fixtures, appliances, and laundry.',
  },
  {
    title: 'City and well water compatibility',
    copy: 'Whether you are on municipal lines or a private well, we configure media and valves to handle iron, sulfur, manganese, and common Florida water challenges.',
  },
  {
    title: 'Optional drinking water upgrades',
    copy: 'Add point-of-use reverse osmosis, under-sink filters, or UV polishing for premium drinking water at the kitchen, bar, or fridge line.',
  },
]

const benefitItems = [
  {
    title: 'Less scale & buildup',
    copy: 'Conditioned water helps keep glass, tile, and fixtures from collecting hard-water spots and mineral rings.',
  },
  {
    title: 'Better taste & clarity',
    copy: 'Filtration reduces chlorine, odors, and many nuisance contaminants so water looks clear and tastes cleaner.',
  },
  {
    title: 'Gentler on skin, hair, and laundry',
    copy: 'Balanced water rinses more completely, helping clothes feel softer and showers feel less harsh.',
  },
  {
    title: 'Protection for plumbing & appliances',
    copy: 'Water heaters, dishwashers, and smart fixtures see less scale and sediment, supporting longer service life.',
  },
]

const maintenanceItems = [
  'Scheduled system health checks to verify flow, pressure, and basic water quality.',
  'Media and resin replacement when test results show it is time—not on a guess.',
  'RO and drinking-water filter changes to keep taste and production where they should be.',
  'Optional pump and pressure-tank inspections for homes on private wells.',
]

function Sales() {
  return (
    <div className={styles.page}>
      <PageHero
        eyebrow="Solutions"
        title="Whole-Home Filtration + RO for Ideal Drinking"
        description="Equip your home with a point-of-entry processor for every tap and optional reverse osmosis for the kitchen. Both are sized for Florida water quality and flow rates."
        primaryAction={{ href: '/#contact', label: 'Schedule a consultation' }}
        secondaryAction={{ href: '/service', label: 'See installation & service' }}
        stats={[
          { label: 'Stages of treatment', value: '10' },
          { label: 'RO reduction range', value: 'Up to 99%' },
          { label: 'Maintenance visits', value: 'As needed' },
        ]}
        heroImage={{
          src: systemImage,
          alt: 'Whole-home filtration system canister and tank',
          caption: 'Whole-Home Filtration (10-stage)',
        }}
        rightSlot={<UniversalForm formId="sales-contact" />}
      />

      <section className={styles.section}>
        <div className="container">
          <h2>What’s included</h2>
          <div className={styles.cards}>
            {includedItems.map((item) => (
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
          <h2>Benefits</h2>
          <div className={styles.grid}>
            {benefitItems.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2>Maintenance overview</h2>
          <div className={styles.maintenance}>
            <p>
              Both systems are built for low-touch ownership. The whole-home processor regenerates
              automatically, while RO filters are swapped during quick service visits.
            </p>
            <ul>
              {maintenanceItems.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2>Warranty & financing</h2>
          <div className={styles.warranty}>
            <p>
              REPLACE THIS WITH YOUR WARRANTY DETAILS. Financing and payment options are available
              after we finalize equipment sizing and installation scope.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container gradient-card ${styles.finalCta}`}>
          <div>
            <h2>Design your system</h2>
            <p>
              Share your address, water concerns, and household size. We&apos;ll test your supply,
              tailor the configuration, and outline installation timelines.
            </p>
          </div>
          <a className="btn btn-primary" href="/#contact">
            Schedule a consultation
          </a>
        </div>
      </section>
    </div>
  )
}

export default Sales
