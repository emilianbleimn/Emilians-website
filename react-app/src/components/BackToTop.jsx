import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow((window.scrollY || window.pageYOffset) > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={`to-top${show ? ' show' : ''}`}
      aria-label="Nach oben scrollen"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m18 15-6-6-6 6" /></svg>
    </button>
  );
}
