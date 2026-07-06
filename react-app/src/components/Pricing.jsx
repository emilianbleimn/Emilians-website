import SectionHead from './SectionHead.jsx';

const FEATURES = [
  'Modernes Design',
  'Für Handy, Tablet & Desktop',
  'Bis zu 12 Unterseiten',
  'Kontaktformular',
  'SEO-Grundlagen',
  'Hosting, Wartung & Updates – ich übernehme alles',
];

export default function Pricing() {
  return (
    <section className="section section-alt" id="preise">
      <div className="container">
        <SectionHead
          eyebrow="Preis"
          title="Ein faires Monats-Abo"
          sub="Ein fester Monatspreis – Website, Hosting und Pflege inklusive, ohne versteckte Kosten."
        />
        <div className="pricing single">
          <article className="price-card featured reveal">
            <div className="ribbon">Rundum sorglos</div>
            <h3>Deine Website</h3>
            <p className="price-desc">Website, Hosting &amp; Pflege – alles in einem</p>
            <div className="price">129&nbsp;€<span className="price-per">/ Monat</span></div>
            <p className="price-cycle">im Jahresabo (12 Monate)</p>
            <ul className="price-list">
              {FEATURES.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            <a href="#anfrage" className="btn btn-primary btn-block">Jetzt anfragen</a>
          </article>
        </div>
        <p className="price-note reveal">
          Betreut von Jurelin – Hosting, Domain und Wartung sind im Abo enthalten.
          Größere Projekte auf Anfrage.
        </p>
      </div>
    </section>
  );
}
