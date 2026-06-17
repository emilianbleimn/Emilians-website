const CheckIcon = () => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
);

const POINTS = [
  'Individuelles Design statt Standard-Template',
  'Blitzschnell & für Google optimiert',
  'Perfekt auf Handy, Tablet & Desktop',
  'Transparente, faire Festpreise',
  'Pünktliche Lieferung & klare Kommunikation',
];

const BADGES = [
  { ic: '100', strong: 'Performance', span: 'Score von 100', alt: false },
  { ic: '◆', strong: 'Responsive', span: 'Auf jedem Gerät gut', alt: true },
  { ic: '◆', strong: 'Sicher', span: 'HTTPS & aktuell', alt: false },
  { ic: '◆', strong: 'SEO', span: 'Gefunden werden', alt: true },
];

export default function Why() {
  return (
    <section className="section section-alt" id="warum">
      <div className="container two-col">
        <div className="two-col-text reveal">
          <span className="eyebrow">Warum EB Motion</span>
          <h2>Persönlich, ehrlich, ohne Baukasten</h2>
          <p className="section-sub">
            Du bekommst keine Vorlage von der Stange, sondern eine Website, die wirklich zu dir passt –
            mit einem festen Ansprechpartner von Anfang bis Launch.
          </p>
          <ul className="check-list">
            {POINTS.map((p, i) => (
              <li key={i}><CheckIcon /> {p}</li>
            ))}
          </ul>
          <a href="#anfrage" className="btn btn-primary">Projekt besprechen</a>
        </div>

        <div className="two-col-visual reveal" aria-hidden="true">
          {BADGES.map((b, i) => (
            <div className={`badge-card${b.alt ? ' alt' : ''}`} key={i}>
              <div className="badge-ic">{b.ic}</div>
              <strong>{b.strong}</strong>
              <span>{b.span}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
