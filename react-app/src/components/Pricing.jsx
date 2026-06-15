import SectionHead from './SectionHead.jsx';

const FEATURES = [
  'Individuelles Design',
  'Für Handy, Tablet & Desktop',
  'Bis zu 6 Unterseiten',
  'Kontaktformular',
  'SEO-Grundlagen',
  'Selbst pflegbar (CMS) auf Wunsch',
];

export default function Pricing() {
  return (
    <section className="section section-alt" id="preise">
      <div className="container">
        <SectionHead
          eyebrow="Preis"
          title="Ein fairer Festpreis"
          sub="Ein klarer Preis – keine Paket-Verwirrung, keine versteckten Kosten."
        />
        <div className="pricing single">
          <article className="price-card featured reveal">
            <div className="ribbon">Festpreis</div>
            <h3>Deine Website</h3>
            <p className="price-desc">Alles für deinen professionellen Auftritt</p>
            <div className="price">1.000&nbsp;€</div>
            <ul className="price-list">
              {FEATURES.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            <a href="#anfrage" className="btn btn-primary btn-block">Jetzt anfragen</a>
          </article>
        </div>
        <p className="price-note reveal">
          Größere Projekte (z.&nbsp;B. ein Online-Shop) erstelle ich dir individuell – frag einfach an.
          Zzgl. evtl. Drittkosten (z.&nbsp;B. Hosting, Domain).
        </p>
      </div>
    </section>
  );
}
