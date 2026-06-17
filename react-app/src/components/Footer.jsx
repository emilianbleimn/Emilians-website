export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <a href="#start" className="brand">
            <span className="brand-mark" aria-hidden="true">EB</span>
            <span className="brand-text">EB Web Studio</span>
          </a>
          <p>Individuelle Websites – persönlich umgesetzt. Von der Landingpage bis zum Online-Shop. Ehrlich &amp; professionell.</p>
        </div>
        <nav className="footer-nav" aria-label="Footer-Navigation">
          <h4>Navigation</h4>
          <a href="#leistungen">Leistungen</a>
          <a href="#ablauf">Ablauf</a>
          <a href="#preise">Preis</a>
          <a href="#referenzen">Referenzen</a>
          <a href="#faq">FAQ</a>
        </nav>
        <nav className="footer-nav" aria-label="Kontakt">
          <h4>Kontakt</h4>
          <a href="mailto:emilianbleimn@gmail.com">E-Mail schreiben</a>
          <a href="#anfrage">Anfrage starten</a>
          <a href="#kontakt">Kontaktformular</a>
        </nav>
      </div>
      <div className="container footer-bottom">
        <p>© {year} EB Web Studio · ein Service von Jurelin. Alle Rechte vorbehalten.</p>
        <p className="footer-made">Gestaltet mit Sorgfalt.</p>
      </div>
    </footer>
  );
}
