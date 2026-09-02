import SectionHead from './SectionHead.jsx';

const FEATURES = [
  'Komplette Website nach Maß',
  'Bis zu 12 Unterseiten',
  'Eigene Domain inklusive',
  'Hosting inklusive',
  'Sicher – SSL & HTTPS',
  'Für Handy, Tablet & Desktop',
  'SEO-Grundlagen',
];

export default function Pricing() {
  return (
    <section className="section section-alt" id="preise">
      <div className="container">
        <SectionHead
          eyebrow="Preis"
          title="Ein fairer Festpreis"
          sub="Einmalig für die komplette Website – Wartung & Pflege kannst du optional monatlich dazubuchen. Ohne versteckte Kosten."
        />
        <div className="pricing single">
          <article className="price-card featured reveal">
            <div className="ribbon">Rundum sorglos</div>
            <h3>Deine Website</h3>
            <p className="price-desc">Komplett gebaut &amp; fertig eingerichtet</p>
            <div className="price">1.500&nbsp;€<span className="price-per">einmalig</span></div>
            <p className="price-cycle">Optional: Wartung &amp; Pflege – 129&nbsp;€ / Monat, monatlich kündbar</p>
            <ul className="price-list">
              {FEATURES.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            <a href="#anfrage" className="btn btn-primary btn-block">Jetzt anfragen</a>
          </article>
        </div>
        <p className="price-note reveal">
          Domain, Hosting und Einrichtung sind inklusive. Wartung &amp; Pflege optional
          für 129&nbsp;€ / Monat (monatlich kündbar). Größere Projekte auf Anfrage.
        </p>
      </div>
    </section>
  );
}
