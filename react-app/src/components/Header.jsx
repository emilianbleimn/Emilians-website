import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#leistungen', label: 'Leistungen' },
  { href: '#ablauf', label: 'Ablauf' },
  { href: '#preise', label: 'Preis' },
  // { href: '#referenzen', label: 'Referenzen' }, // ausgeblendet, bis es Referenzen gibt
  { href: '#faq', label: 'FAQ' },
  { href: '#kontakt', label: 'Kontakt' },
];

export default function Header({ theme, onToggleTheme }) {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled((window.scrollY || window.pageYOffset) > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setNavOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const close = () => setNavOpen(false);

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#start" className="brand" aria-label="EB Motion Startseite" onClick={close}>
          <span className="brand-mark" aria-hidden="true">EB</span>
          <span className="brand-text">EB&nbsp;Motion</span>
        </a>

        <nav className={`nav${navOpen ? ' open' : ''}`} id="primaryNav" aria-label="Hauptnavigation">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={close}>{l.label}</a>
          ))}
          <a href="#anfrage" className="btn btn-primary nav-cta" onClick={close}>Anfrage starten</a>
        </nav>

        <button
          className="theme-toggle"
          type="button"
          aria-label={theme === 'light' ? 'Zu Dark Mode wechseln' : 'Zu Light Mode wechseln'}
          onClick={onToggleTheme}
        >
          <svg className="icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          <svg className="icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
        </button>

        <button
          className="nav-toggle"
          aria-label={navOpen ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={navOpen}
          aria-controls="primaryNav"
          onClick={() => setNavOpen((o) => !o)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
  );
}
