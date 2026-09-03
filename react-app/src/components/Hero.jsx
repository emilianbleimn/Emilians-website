import { useEffect, useRef } from 'react';

export default function Hero() {
  const heroRef = useRef(null);

  // Sanfter Cursor-Spotlight (GPU-Transform, daher flüssig)
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || !window.matchMedia) return undefined;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;

    let raf = null;
    let mx = 0;
    let my = 0;
    const apply = () => {
      raf = null;
      hero.style.setProperty('--mx', `${mx}px`);
      hero.style.setProperty('--my', `${my}px`);
    };
    const onMove = (ev) => {
      const r = hero.getBoundingClientRect();
      mx = ev.clientX - r.left - 270;
      my = ev.clientY - r.top - 270;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    hero.addEventListener('mousemove', onMove);
    return () => hero.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="hero" id="start" ref={heroRef}>
      <div className="hero-bg" aria-hidden="true">
        <span className="hero-glow"></span>
      </div>

      <div className="container hero-inner">
        <div className="hero-content reveal">
          <span className="eyebrow">Webdesign &amp; Entwicklung</span>
          <h1>Websites, die<br /><span className="gold">zu dir passen.</span></h1>
          <p className="hero-lead">
            Ich gestalte moderne Websites, die zu dir und deinem Vorhaben passen –
            klar, ehrlich und persönlich umgesetzt. Vom ersten Gespräch bis zur
            fertigen Seite bist du direkt bei mir.
          </p>
          <div className="hero-actions">
            <a href="#anfrage" className="btn btn-primary btn-lg">Projekt anfragen</a>
            <a href="#leistungen" className="btn btn-ghost btn-lg">Leistungen ansehen</a>
          </div>
        </div>

        <div className="hero-visual reveal" aria-hidden="true">
          <div className="mock-window">
            <div className="mock-bar">
              <span></span><span></span><span></span>
              <div className="mock-url">ebsolutions.info</div>
            </div>
            <div className="mock-body">
              <div className="mock-hero"></div>
              <div className="mock-row"><div className="mock-card"></div><div className="mock-card"></div><div className="mock-card"></div></div>
              <div className="mock-line long"></div>
              <div className="mock-line"></div>
              <div className="mock-line short"></div>
              <div className="mock-btn"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
