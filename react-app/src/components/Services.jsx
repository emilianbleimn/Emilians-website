import SectionHead from './SectionHead.jsx';

const SERVICES = [
  {
    title: 'Business-Websites',
    text: 'Professionelle Websites, die Vertrauen schaffen und neue Kunden gewinnen.',
    icon: (<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18M8 21h8" /></svg>),
  },
  {
    title: 'Landingpages',
    text: 'Conversion-optimierte Seiten für Kampagnen, Produkte und Aktionen – auf den Punkt.',
    icon: (<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" /></svg>),
  },
  {
    title: 'Redesign & Relaunch',
    text: 'Deine bestehende Website bekommt einen frischen, modernen und schnellen Look.',
    icon: (<svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>),
  },
  {
    title: 'SEO & Performance',
    text: 'Schnelle Ladezeiten und Top-Platzierungen, damit dich die richtigen Kunden finden.',
    icon: (<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>),
  },
  {
    title: 'Wartung & Support',
    text: 'Updates, Sicherheit und Änderungen – zuverlässig im Hintergrund erledigt.',
    icon: (<svg viewBox="0 0 24 24"><path d="M12 2a3 3 0 0 1 3 3v1.2a6 6 0 0 1 2 1.1l1-.6a3 3 0 1 1 3 5.2l-1 .6a6 6 0 0 1 0 2.3l1 .6a3 3 0 1 1-3 5.2l-1-.6a6 6 0 0 1-2 1.1V21a3 3 0 0 1-6 0v-1.2a6 6 0 0 1-2-1.1l-1 .6a3 3 0 1 1-3-5.2l1-.6a6 6 0 0 1 0-2.3l-1-.6a3 3 0 1 1 3-5.2l1 .6a6 6 0 0 1 2-1.1V5a3 3 0 0 1 3-3z" /><circle cx="12" cy="12" r="2.5" /></svg>),
  },
];

export default function Services() {
  return (
    <section className="section" id="leistungen">
      <div className="container">
        <SectionHead
          eyebrow="Leistungen"
          title="Das baue ich für dich"
          sub="Egal ob Selbstständige:r, kleines Unternehmen oder Verein – ich baue die Website, die wirklich zu dir passt."
        />
        <div className="cards">
          {SERVICES.map((s, i) => (
            <article className="card reveal" key={i}>
              <div className="card-ic" aria-hidden="true">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
