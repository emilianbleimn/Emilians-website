import SectionHead from './SectionHead.jsx';

const PLANS = [
  {
    name: 'Refresh',
    desc: 'Auffrischung deiner bestehenden Seite',
    price: '490 €',
    features: [
      'Neues, modernes Design',
      'Bestehende Inhalte übernommen',
      'Für Handy, Tablet & Desktop',
      'Technik- & Performance-Check',
      'Meist in ca. 1 Woche fertig',
    ],
  },
  {
    name: 'Landingpage',
    desc: 'Eine Seite, die auf den Punkt kommt',
    price: '690 €',
    features: [
      'Einzelne Seite (One-Pager)',
      'Kontaktformular',
      'Für Handy, Tablet & Desktop',
      'SEO-Grundlagen',
      'Domain & Hosting eingerichtet',
    ],
  },
  {
    name: 'Business-Website',
    desc: 'Der komplette Auftritt für dein Unternehmen',
    price: '1.500 €',
    featured: true,
    ribbon: 'Empfohlen',
    features: [
      'Bis zu 12 Unterseiten',
      'Eigene Domain inklusive',
      'Hosting inklusive',
      'Sicher – SSL & HTTPS',
      'Kontaktformular',
      'SEO-Grundlagen',
    ],
  },
];

export default function Pricing() {
  return (
    <section className="section section-alt" id="preise">
      <div className="container">
        <SectionHead
          eyebrow="Preise"
          title="Faire Preise für jedes Vorhaben"
          sub="Vom Refresh bis zur kompletten Firmen-Website – alle Preise einmalig. Das feste Angebot bekommst du nach einem kurzen Gespräch."
        />
        <div className="pricing">
          {PLANS.map((p) => (
            <article className={`price-card reveal${p.featured ? ' featured' : ''}`} key={p.name}>
              {p.ribbon ? <div className="ribbon">{p.ribbon}</div> : null}
              <h3>{p.name}</h3>
              <p className="price-desc">{p.desc}</p>
              <div className="price"><span className="from">ab</span>{p.price}</div>
              <ul className="price-list">
                {p.features.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
              <a href="#anfrage" className={`btn ${p.featured ? 'btn-primary' : 'btn-ghost'} btn-block`}>Anfragen</a>
            </article>
          ))}
        </div>
        <p className="price-note reveal">
          Alle Preise einmalig. Optional: Wartung &amp; Pflege für 129&nbsp;€ / Monat – monatlich kündbar.
          Größere Projekte auf Anfrage.
        </p>
      </div>
    </section>
  );
}
