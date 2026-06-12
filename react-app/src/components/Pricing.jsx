import SectionHead from './SectionHead.jsx';
import { plans } from '../data.js';

export default function Pricing() {
  return (
    <section className="section section-alt" id="preise">
      <div className="container">
        <SectionHead
          eyebrow="Pakete"
          title="Faire Pakete mit klarem Preis"
          sub="Richtwerte als Orientierung – dein finales Angebot stelle ich passgenau auf dein Projekt zusammen."
        />
        <div className="pricing">
          {plans.map((p) => (
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
          Alle Preise zzgl. ggf. anfallender Drittkosten (z.&nbsp;B. Hosting, Domain). Unverbindliche Richtwerte.
        </p>
      </div>
    </section>
  );
}
