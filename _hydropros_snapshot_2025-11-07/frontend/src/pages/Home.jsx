import PageHero from '../components/PageHero.jsx'
import UniversalForm from '../components/UniversalForm.jsx'
import HighlightGrid from '../components/HighlightGrid.jsx'
import InnovationShowcase from '../components/InnovationShowcase.jsx'
import ImpactGrid from '../components/ImpactGrid.jsx'
import Testimonials from '../components/Testimonials.jsx'
import CallToAction from '../components/CallToAction.jsx'
import PartnerStrip from '../components/PartnerStrip.jsx'
import ProcessTimeline from '../components/ProcessTimeline.jsx'
// CHANGED: We are adding this line to import your new product image
import hydroSystemImage from '../assets/hydrosystem1.png'
import styles from './Home.module.css'

// Moved content inline for portability and easier authoring
const homeHighlights = [
  {
    title: 'Triple-Stage Mineral Intelligence',
    description:
      'Adaptive filtration cascades that analyze local water profiles and self-optimize in real time.',
    metric: '99.7% contaminant removal',
  },
  {
    title: 'Hydration Experience Engine',
    description:
      'Micro-structured water delivers a softer mouthfeel while preserving essential trace minerals.',
    metric: '7.4 pH balance maintained',
  },
  {
    title: 'Predictive Purity Monitoring',
    description:
      'Edge sensors benchmark purity against WHO standards, pushing live intelligence to your devices.',
    metric: '24/7 purity analytics',
  },
]

const impactStatements = [
  {
    title: '4.2M gallons restored',
    body: 'Operations teams leverage HydroPros to reclaim and reuse process water safely.',
  },
  {
    title: '68% plastic reduction',
    body: 'Cut bottled water dependency with on-site micro-filtration and hydration hubs.',
  },
  {
    title: 'Carbon neutral delivery',
    body: 'Supply chain logistics optimized for short-haul replenishment and recyclable media.',
  },
]

const testimonialData = [
  {
    quote:
      'HydroPros transformed the way our clients experience water. Taste, clarity, and trust — all elevated.',
    name: 'Isabella Chen',
    role: 'Director of Experience, Harborwell Hotels',
  },
  {
    quote:
      'Their engineering team anticipated every compliance challenge and handled implementation flawlessly.',
    name: 'Marcus Avery',
    role: 'VP Facilities, Lumarian Health',
  },
  {
    quote:
      'The purity analytics dashboard helps us demonstrate measurable ESG wins to our stakeholders.',
    name: 'Priya Nandakumar',
    role: 'Sustainability Lead, Ridgeway Foods',
  },
]

const salesSolutions = [
  {
    title: 'HydroPros Apex',
    description:
      'Flagship purification suite with AI-balanced remineralization, modular membranes, and hospitality-grade dispensing.',
    icon: 'apex',
    metrics: ['Large venues', 'Smart remineralization', 'IoT telemetry'],
  },
  {
    title: 'HydroPros Origin',
    description:
      'Compact system engineered for residential and boutique applications without compromising taste.',
    icon: 'origin',
    metrics: ['Slim footprint', 'Fast install', 'Cloud insights'],
  },
  {
    title: 'HydroPros Continuum',
    description:
      'Industrial-scale purification with redundant safeguards, automated flushing, and supply chain integration.',
    icon: 'continuum',
    metrics: ['Multi-stage redundancy', 'Industrial analytics', 'ESG reporting'],
  },
]

const partnerBadges = [
  'Global Hospitality Awards',
  'ISO 22000 Certified',
  'HydroTech Innovation Laureate',
  'Sustainable Cities Initiative',
]

const heroStats = [
  { label: 'Purity consistency', value: '99.994%' },
  { label: 'Client retention', value: '94%+' },
  { label: 'Hydration experiences delivered', value: '1800+' },
]

const timelineSteps = [
  {
    title: 'Immersive water audit',
    description:
      'We analyze incoming water, user behaviors, and architectural constraints to architect your purity blueprint.',
  },
  {
    title: 'Experience prototyping',
    description:
      'Spatial designers and hydro engineers co-create tasting scenarios, dispensing touchpoints, and digital flows.',
  },
  {
    title: 'White-glove commissioning',
    description:
      'Our team installs, calibrates, and pressure-tests every component, ensuring zero disruption to your operation.',
  },
  {
    title: 'Continuous intelligence',
    description:
      'Sensors surface purity analytics, ESG metrics, and predictive maintenance insights across your portfolio.',
  },
]

function Home() {
  return (
    <div className={styles.page}>
      <PageHero
        eyebrow="HydroPros Systems"
        title={'Water luxury with scientific precision'}
        description="Precision-engineered filtration, adaptive mineral intelligence, and immersive hydration experiences crafted for elite hospitality, wellness, and residential environments."
        primaryAction={{ href: '#contact', label: 'Design My System' }}
        secondaryAction={{ href: '/sales', label: 'Explore Portfolio' }}
        stats={heroStats}
        rightSlot={<UniversalForm formId="contact" />}
      />
      <PartnerStrip items={partnerBadges} />
      <div className={styles.sectionGroup}>
        <HighlightGrid items={homeHighlights} />
        <div className={`gradient-card ${styles.immersionPanel}`}>
          <div className={styles.immersionCopy}>
            <span className="tagline">
              <span className="badge-dot" /> Experience Design
            </span>
            <h2>Purity you can see, taste, and feel</h2>
            <p>
              From sculpted countertop fountains to ambient hydration lounges, HydroPros choreographs
              every encounter with water. Lighting gradients, microbubble infusion, and tactile finishes are all tuned
              to reinforce your brand&apos;s signature experience.
            </p>
            <ul className={styles.immersionPoints}>
              <li>Sommelier-led taste calibration for every installation</li>
              <li>Architectural integration kits with bespoke finishes</li>
              <li>Companion mobile app with hydration storytelling</li>
            </ul>
          </div>
          {/* CHANGED: We've replaced the old 'div' that had the wave animations 
            with this new 'div' that contains your product image.
          */}
          <div className={styles.immersionVisual}>
            <img
              src={hydroSystemImage}
              alt="The HydroPros water filtration system"
              className={styles.productImage}
            />
          </div>
        </div>
      </div>
      <InnovationShowcase
        title="Choose the system that fits your venue"
        caption="From signature penthouses to expansive resorts, HydroPros scales artisanal hydration with resilient engineering and intelligent monitoring."
        items={salesSolutions}
      />
      <ImpactGrid
        title="Engineered for measurable sustainability"
        copy="Every HydroPros deployment pairs indulgent hydration with data-backed resource reductions and community impact."
        items={impactStatements}
      />
      <ProcessTimeline
        title="Our end-to-end commissioning ritual"
        caption="A dedicated hydro concierge team guides your project from discovery to ongoing optimization."
        steps={timelineSteps}
      />
      <Testimonials
        title="Trusted by iconic destinations"
        description="Global hospitality leaders, wellness brands, and visionary communities rely on HydroPros to deliver unforgettable water experiences."
        items={testimonialData}
      />
      <CallToAction />
    </div>
  )
}

export default Home