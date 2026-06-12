import { useEffect } from 'react';

/**
 * Blendet alle Elemente mit der Klasse `.reveal` sanft ein, sobald sie
 * in den sichtbaren Bereich scrollen (fügt die Klasse `.in` hinzu).
 * Wird einmal nach dem Mounten der App aufgerufen.
 */
export function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || !els.length) {
      els.forEach((el) => el.classList.add('in'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
