import { useEffect, useRef, useState } from 'react';

function Counter({ target, suffix = '' }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(target);
      return undefined;
    }
    if (!('IntersectionObserver' in window)) {
      setVal(target);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);

    function run() {
      const dur = 1400;
      let start = null;
      const tick = (ts) => {
        if (start === null) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
    return () => io.disconnect();
  }, [target]);

  return <strong ref={ref}>{val}{suffix}</strong>;
}

export default function Stats() {
  return (
    <section className="stats" aria-label="Auf einen Blick">
      <div className="container stats-grid">
        <div className="stat reveal"><Counter target={24} suffix={' h'} /><span>Antwortzeit</span></div>
        <div className="stat reveal"><Counter target={100} suffix={' %'} /><span>Responsiv</span></div>
        <div className="stat reveal"><strong>A+</strong><span>Performance &amp; SEO</span></div>
        <div className="stat reveal"><strong>1:1</strong><span>Persönliche Betreuung</span></div>
      </div>
    </section>
  );
}
