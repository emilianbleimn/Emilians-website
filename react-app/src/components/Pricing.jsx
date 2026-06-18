import { useState } from 'react';
import SectionHead from './SectionHead.jsx';
import { startSubscriptionCheckout } from '../lib/stripe.js';

const FEATURES = [
  'Individuelles Design',
  'Für Handy, Tablet & Desktop',
  'Bis zu 12 Unterseiten',
  'Kontaktformular',
  'SEO-Grundlagen',
  'Hosting, Wartung & Updates – ich übernehme alles',
];

export default function Pricing() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubscribe() {
    setError('');
    setLoading(true);
    try {
      await startSubscriptionCheckout();
      // Bei Erfolg übernimmt Stripe die Weiterleitung – kein Reset nötig.
    } catch (e) {
      setError(e.message || 'Etwas ist schiefgelaufen.');
      setLoading(false);
    }
  }

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
            <button
              type="button"
              className={`btn btn-primary btn-block${loading ? ' is-loading' : ''}`}
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? 'Weiterleitung …' : 'Jetzt abonnieren'}
            </button>
            <a href="#anfrage" className="btn btn-ghost btn-block">Erst unverbindlich anfragen</a>
            {error && <p className="pay-status err">{error}</p>}
          </article>
        </div>
        <p className="price-note reveal">
          Betreut von Jurelin – Hosting, Domain und Wartung sind im Abo enthalten.
          Größere Projekte (z.&nbsp;B. ein Online-Shop) auf Anfrage.
        </p>
      </div>
    </section>
  );
}
