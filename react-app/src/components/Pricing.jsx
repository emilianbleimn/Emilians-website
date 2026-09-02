import SectionHead from './SectionHead.jsx';

const FEATURES = [
  'Komplette Website nach Maß',
  'Bis zu 12 Unterseiten',
  'Eigene Domain inklusive',
  'Hosting inklusive',
  'Sicher – SSL & HTTPS',
  'Für Handy, Tablet & Desktop',
  'SEO-Grundlagen',
  'Monatliche Wartung, Updates & Pflege',
];

export default function Pricing() {
  return (
    <section className="section section-alt" id="preise">
      <div className="container">
        <SectionHead
          eyebrow="Preis"
          title="Faire Preise, alles inklusive"
          sub="Einmalig für die komplette Website, monatlich für die laufende Pflege – klar und ohne versteckte Kosten."
        />
        <div className="pricing single">
          <article className="price-card featured reveal">
            <div className="ribbon">Rundum sorglos</div>
            <h3>Deine Website</h3>
            <p className="price-desc">Komplett gebaut &amp; dauerhaft betreut</p>
            <div className="price">1.500&nbsp;€<span className="price-per">einmalig</span></div>
            <p className="price-cycle">+ 129&nbsp;€ / Monat für Wartung &amp; Pflege</p>
            <ul className="price-list">
              {FEATURES.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            <a href="#anfrage" className="btn btn-primary btn-block">Jetzt anfragen</a>
          </article>
        </div>
        <p className="price-note reveal">
          Domain, Hosting und laufende Pflege sind inklusive – betreut von EB Solutions.
          Größere Projekte auf Anfrage.
        </p>
      </div>
    </section>
  );
}
